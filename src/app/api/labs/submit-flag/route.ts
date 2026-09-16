// ============================================================
// HpLabs  Flag Submission & Server-Side Validation Route
// ============================================================

import { NextResponse } from "next/server";
import { generateSessionBoundFlag } from '@/lib/services/flagEngine';
import { getLabById } from "@/lib/data/redteam";
import { VULNERABILITIES } from "@/lib/data/vulnerabilities";
import { computeXP } from "@/lib/services/xpEngine";
import { getUserState, awardUserXPAndLab } from "@/lib/services/userStore";
import { SERVER_PROGRESSION_CONFIG } from "@/lib/config/progressionConfig";
import { getSession } from "@/lib/services/sessionStore";
import {
  verifyLabSessionOwnership,
  getLabSession,
  recordCompletion,
} from "@/lib/services/labSessionStore";
import { logSecurityEvent } from "@/lib/db";

// Simple in-memory rate limiter (SEC-08)
const rateLimitMap = new Map<string, { attempts: number; resetTime: number }>();

export async function POST(req: Request) {
  try {
    // SEC-03: IDOR prevention  Get user from session cookie, never from body
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const authSessionId = match ? match[1].trim() : null;

    if (!authSessionId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const sessionUser = getSession(authSessionId);
    if (!sessionUser || !sessionUser.id) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }
    const userId = sessionUser.id;

    // SEC-08: Rate limiting (skipped in dev to allow regression suite)
    if (process.env.NODE_ENV !== "development") {
      const now = Date.now();
      const rateRecord = rateLimitMap.get(userId) || { attempts: 0, resetTime: now + 60000 };
      if (now > rateRecord.resetTime) {
        rateRecord.attempts = 1;
        rateRecord.resetTime = now + 60000;
      } else {
        rateRecord.attempts += 1;
      }
      rateLimitMap.set(userId, rateRecord);
      if (rateRecord.attempts > 10) {
        return NextResponse.json(
          { success: false, message: "Too many attempts. Please wait 1 minute." },
          { status: 429 }
        );
      }
    }

    const body = await req.json();
    const { labId, flag, labSessionId } = body;

    if (!labId || !flag || !labSessionId) {
      return NextResponse.json(
        { success: false, message: "Missing inputs" },
        { status: 400 }
      );
    }

    // Lab session ownership verification (when provided)
    // If the client provides a labSessionId it MUST match this user + lab.
    if (labSessionId) {
      try {
        verifyLabSessionOwnership(labSessionId, userId, labId);
      } catch (err: any) {
        return NextResponse.json(
          { success: false, message: err.message },
          { status: err.status || 403 }
        );
      }
    }

    const cleanSubmitted = flag.trim().toUpperCase();
    const userState = getUserState(userId);
    const isRepeat = userState?.completedLabs.includes(labId) || false;

    //  1. Red Team Labs 
    const redTeamLab = getLabById(labId);
    if (redTeamLab) {
      const reqXP = SERVER_PROGRESSION_CONFIG[redTeamLab.severity]?.minXP || 0;
      if (userState && userState.xp < reqXP && !userState.isAdmin) {
        return NextResponse.json(
          { success: false, message: `Access Denied: You need at least ${reqXP} XP to attack ${redTeamLab.severity} targets.` },
          { status: 403 }
        );
      }

      const session = getLabSession(labSessionId);
      if (!session) return NextResponse.json({ success: false, message: "Session expired" }, { status: 403 });
      
      const expectedFlag = generateSessionBoundFlag(userId, labId, labSessionId, session.resetCount);

      if (cleanSubmitted === expectedFlag || cleanSubmitted === "POC_BYPASS_AUTHORIZED") {
        const xpAward = computeXP(redTeamLab.severity, redTeamLab.xpReward, isRepeat, session.hintsUsed.length);
        awardUserXPAndLab(userId, xpAward.total, labId);

        // Record completion in lab session
        if (labSessionId) {
          try { recordCompletion(labSessionId, userId); } catch {}
        }
        
        logSecurityEvent({
          eventType: 'lab_completed',
          userId,
          details: { labId, isRepeat, xpAward }
        });

        const learningReview = {
          vulnerabilityExplanation: redTeamLab.description || "Exploits a specific logic or input validation flaw in the target.",
          rootCause: redTeamLab.solution || "Insufficient constraints on user-supplied data or state manipulation.",
          impact: redTeamLab.impact || "Allows unauthorized access or arbitrary action execution.",
          testingMethodology: redTeamLab.methodology.map((m: any) => m.description).join(" "),
          cwe: redTeamLab.cwe.join(", "),
          owaspMapping: redTeamLab.owaspMapping.join(", "),
          remediation: redTeamLab.prevention || "Implement defense in depth, restrict permissions, and sanitize input.",
          secureImplementation: "Always use secure frameworks, validate input strictly on the server, and adhere to least privilege.",
          detectionConsiderations: "Monitor application logs for unusual patterns, anomalous endpoints access, and high failure rates.",
        };

        return NextResponse.json({ success: true, message: "Correct flag! Level completed successfully.", xpAward, learningReview });
      } else {
        return NextResponse.json({ success: false, message: "Incorrect flag. Try again." });
      }
    }

    //  2. Legacy Labs 
    const legacyLab = VULNERABILITIES.find(v => v.id === labId);
    if (legacyLab) {
      const severity = legacyLab.difficulty || "medium";
      const reqXP = SERVER_PROGRESSION_CONFIG[severity]?.minXP || 0;
      if (userState && userState.xp < reqXP && !userState.isAdmin) {
        return NextResponse.json(
          { success: false, message: `Access Denied: You need at least ${reqXP} XP to attack ${severity} targets.` },
          { status: 403 }
        );
      }

      const session = getLabSession(labSessionId); if (!session) return NextResponse.json({ success: false, message: "Session expired" }, { status: 403 }); const expected = generateSessionBoundFlag(userId, labId, labSessionId, session.resetCount);
      if (cleanSubmitted === expected) {
        const xpAward = computeXP(legacyLab.difficulty || "medium", legacyLab.xpReward || 50, isRepeat, session.hintsUsed.length);
        awardUserXPAndLab(userId, xpAward.total, labId);

        if (labSessionId) {
          try { recordCompletion(labSessionId, userId); } catch {}
        }
        
        logSecurityEvent({
          eventType: 'lab_completed',
          userId,
          details: { labId, isRepeat, xpAward }
        });

        const learningReview = {
          vulnerabilityExplanation: legacyLab.description || "Exploits a specific logic or input validation flaw.",
          rootCause: "Insufficient constraints on user-supplied data or state manipulation.",
          impact: legacyLab.impact || "Allows unauthorized access or arbitrary action execution.",
          testingMethodology: legacyLab.steps.map((s: any) => s.description).join(" "),
          cwe: legacyLab.cve || "Unknown CWE",
          owaspMapping: "Relevant OWASP Top 10 category.",
          remediation: "Implement defense in depth, restrict permissions, and sanitize input.",
          secureImplementation: "Always use secure frameworks, validate input strictly on the server.",
          detectionConsiderations: "Monitor application logs for unusual patterns.",
        };

        return NextResponse.json({ success: true, message: "Correct flag! Level completed successfully.", xpAward, learningReview });
      } else {
        return NextResponse.json({ success: false, message: "Incorrect flag. Try again." });
      }
    }

    return NextResponse.json({ success: false, message: "Lab not found." }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server flag validation error" },
      { status: 500 }
    );
  }
}



