import { cookies } from "next/headers";
import { getSession } from "@/lib/services/sessionStore";
import { getUserById } from "@/lib/services/userStore";

const SUPER_ADMIN_EMAIL = "info@hackerplus.in";

/**
 * Validates that the current request is from the ONE Super Admin.
 * Does not trust the session payload, hits the DB to verify the real email.
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("hplabs_session_id")?.value;
    if (!sessionId) return false;

    const sessionUser = getSession(sessionId);
    if (!sessionUser || !sessionUser.id) return false;

    const realUser = getUserById(sessionUser.id);
    if (!realUser || !realUser.email) return false;

    return realUser.email.toLowerCase() === SUPER_ADMIN_EMAIL;
  } catch (e) {
    console.error("[SuperAdminAuth] Check failed:", e);
    return false;
  }
}
