import { cookies } from 'next/headers';
import { getSession } from '@/lib/services/sessionStore';
import { getUserById } from '@/lib/services/userStore';
import { logSecurityEvent } from '@/lib/db';
import { consumeRateLimit } from '@/lib/services/rateLimiter';

export async function requireAdminAPI(endpointName: string = "unknown"): Promise<any> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('hplabs_session_id')?.value;
  
  if (!sessionId) {
    return null;
  }

  const sessionUser = getSession(sessionId);
  if (!sessionUser || !sessionUser.id) {
    return null;
  }

  // Fetch real user from database, do not trust session payload
  const realUser = getUserById(sessionUser.id);
  if (!realUser || realUser.email.toLowerCase() !== "info@hackerplus.in" || (realUser.mfaEnabled && !sessionUser.mfaVerified)) {
    logSecurityEvent({
      eventType: "admin_api_access_denied",
      userId: sessionUser.id,
      details: { endpoint: endpointName, email: realUser?.email },
      severity: "warn"
    });
    return null;
  }

  if (!consumeRateLimit(`admin_api_${realUser.id}`, 100, 60 * 1000)) {
     logSecurityEvent({
      eventType: "admin_api_ratelimit_exceeded",
      userId: realUser.id,
      details: { endpoint: endpointName },
      severity: "warn"
    });
    return null; // or throw a 429
  }

  // Audit success
  logSecurityEvent({
    eventType: "admin_api_access_granted",
    userId: realUser.id,
    details: { endpoint: endpointName },
    severity: "info"
  });

  return realUser;
}