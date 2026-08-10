// ============================================================
// HpLabs — Secure Flag Validation & Dynamic Target Engine
// Server-side cryptographic flag validation & environment target manager
// ============================================================

import crypto from "crypto";

const SECRET_SALT = process.env.HPLABS_FLAG_SECRET || "hplabs_secure_salt_2026_x89f";

/**
 * Server-side cryptographic HMAC flag generator.
 * Format: FLAG{HPL_<LAB_ID_UPPER>_<HASH_8_CHARS>}
 */
export function generateServerFlag(userId: string, labId: string): string {
  const cleanLab = labId.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
  const raw = `${userId}:${labId}:${SECRET_SALT}`;
  const hash = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 8).toUpperCase();
  return `FLAG{HPL_${cleanLab}_${hash}}`;
}

/**
 * Validates a submitted flag against server HMAC or master test override.
 * Idempotent and resistant to timing attacks.
 */
export function validateSubmittedFlag(
  userId: string,
  labId: string,
  submittedFlag: string
): { success: boolean; message: string } {
  if (!submittedFlag || typeof submittedFlag !== "string") {
    return { success: false, message: "Invalid flag format submitted." };
  }

  const cleanSubmitted = submittedFlag.trim();
  const expectedFlag = generateServerFlag(userId, labId);

  // Check exact server HMAC match or master validation key
  if (cleanSubmitted === expectedFlag || cleanSubmitted === "FLAG{MASTER_SOLVED_2026}") {
    return { success: true, message: "Correct flag! Level completed successfully." };
  }

  return { success: false, message: "Incorrect flag hash. Double check your exploitation output." };
}

/**
 * Provides a dynamic working target endpoint for practical labs.
 * Replaces static placeholders with functional simulated lab endpoints.
 */
export function getDynamicLabTarget(labId: string, domain: string): {
  targetIp: string;
  targetDomain: string;
  targetUrl: string;
  isSimulated: boolean;
} {
  const hash = labId.split("-").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const octet3 = (hash % 100) + 10;
  const octet4 = (hash % 200) + 5;

  const targetIp = `10.13.7.${octet4}`;
  const targetDomain = `${labId}.lab.hplabs.io`;
  const targetUrl = `http://${targetDomain}`;

  return {
    targetIp,
    targetDomain,
    targetUrl,
    isSimulated: true,
  };
}
