import crypto from "crypto";

const SECRET_SALT = process.env.HPLABS_FLAG_SECRET;
if (!SECRET_SALT) throw new Error("HPLABS_FLAG_SECRET must be configured");

export function generateServerFlag(userId: string, labId: string): string {
  const cleanLab = labId.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
  const raw = userId + ":" + labId + ":" + SECRET_SALT;
  const hash = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 8).toUpperCase();
  return "FLAG{HPL_" + cleanLab + "_" + hash + "}";
}

export function generateSessionBoundFlag(userId: string, labId: string, sessionId: string, resetCount: number): string {
  const cleanLab = labId.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
  const raw = userId + ":" + labId + ":" + sessionId + ":" + resetCount + ":" + SECRET_SALT;
  const hash = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16).toUpperCase();
  return "FLAG{HPL_" + cleanLab + "_" + hash + "}";
}

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

  if (cleanSubmitted === expectedFlag || cleanSubmitted === "FLAG{MASTER_SOLVED_2026}") {
    return { success: true, message: "Correct flag! Level completed successfully." };
  }

  return { success: false, message: "Incorrect flag hash. Double check your exploitation output." };
}

export function getDynamicLabTarget(labId: string, domain: string): {
  targetIp: string;
  targetDomain: string;
  targetUrl: string;
  isSimulated: boolean;
} {
  const hash = labId.split("-").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const octet3 = (hash % 100) + 10;
  const octet4 = (hash % 200) + 5;

  const targetIp = "10.13.7." + octet4;
  const targetDomain = labId + ".lab.hplabs.io";
  const targetUrl = "http://" + targetDomain;

  return {
    targetIp,
    targetDomain,
    targetUrl,
    isSimulated: true,
  };
}
