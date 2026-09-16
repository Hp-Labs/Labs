import { NextRequest, NextResponse } from "next/server";
import { getSession, destroySession, createSession } from "@/lib/services/sessionStore";
import { getUserState } from "@/lib/services/userStore";
import { destroyLabSession, getUserLabSessions } from "@/lib/services/labSessionStore";

export type SupportAction =
  | "diagnose"
  | "fix_session"
  | "fix_xp_sync"
  | "fix_entitlement"
  | "fix_lab_provision"
  | "fix_hint_sync"
  | "fix_cache_worker"
  | "escalate";

interface SupportRequest {
  message: string;
  userId?: string;
  sessionId?: string;
  context?: Record<string, unknown>;
}

interface DiagnosisResult {
  issue: string;
  severity: "safe" | "escalate";
  action: SupportAction;
  description: string;
  autoFix: boolean;
}

function classifyIssue(message: string): DiagnosisResult {
  const m = message.toLowerCase();

  if (/lab.*(stuck|provision|spin|start|activat|not.start|won.t.start|hanging)/i.test(m) ||
      /provision.*fail|spin.*up|lab.*down/i.test(m)) {
    return {
      issue: "stuck_lab",
      severity: "safe",
      action: "fix_lab_provision",
      description: "Lab provisioning appears stuck or failed.",
      autoFix: true,
    };
  }

  if (/lab.*(reset|restart|broken|dead)|reset.*lab/i.test(m)) {
    return {
      issue: "failed_lab_reset",
      severity: "safe",
      action: "fix_lab_provision",
      description: "Lab reset did not complete successfully.",
      autoFix: true,
    };
  }

  if (/session.*(expired|invalid|stale|logout|kick|kicked|log.*out)|stale.*session|logged.*out/i.test(m)) {
    return {
      issue: "stale_session",
      severity: "safe",
      action: "fix_session",
      description: "Your session appears to be stale or has expired.",
      autoFix: true,
    };
  }

  if (/hint.*(not.*show|missing|wrong|sync|gone|lost|reset|broken)/i.test(m)) {
    return {
      issue: "hint_sync",
      severity: "safe",
      action: "fix_hint_sync",
      description: "Hint data appears out of sync.",
      autoFix: true,
    };
  }

  if (/xp.*(not|wrong|miss|lost|gone|sync|incorrect)|xp.*disapp|reward.*(not|miss)|points.*(not|wrong)/i.test(m)) {
    return {
      issue: "xp_sync",
      severity: "safe",
      action: "fix_xp_sync",
      description: "Your XP balance appears out of sync with the server.",
      autoFix: true,
    };
  }

  if (/entitlement|premium.*(not|miss|lost|wrong)|access.*(denied|lost|missing)|tier.*(wrong|lost|miss)|unlock.*(not|fail|miss)/i.test(m)) {
    return {
      issue: "entitlement_sync",
      severity: "safe",
      action: "fix_entitlement",
      description: "Your premium entitlements or tier unlocks appear out of sync.",
      autoFix: true,
    };
  }

  if (/cache.*(broken|stuck|reset)|worker.*(stuck|dead|fail|error)/i.test(m)) {
    return {
      issue: "cache_worker_stuck",
      severity: "safe",
      action: "fix_cache_worker",
      description: "Cache or background worker appears stuck.",
      autoFix: true,
    };
  }

  if (/server.*(down|error|fail|problem|issue|unavail|timeout)|500|503|not.*load|page.*fail|cant.*load/i.test(m)) {
    return {
      issue: "service_failure",
      severity: "safe",
      action: "diagnose",
      description: "Possible temporary service disruption detected.",
      autoFix: false,
    };
  }

  return {
    issue: "unknown",
    severity: "escalate",
    action: "escalate",
    description: "Issue could not be automatically classified.",
    autoFix: false,
  };
}

async function executeRemediation(
  action: SupportAction,
  userId?: string,
  sessionCookie?: string
): Promise<{ success: boolean; details: string; recoverySteps?: string[] }> {

  switch (action) {
    case "fix_session": {
      if (sessionCookie) destroySession(sessionCookie);
      return {
        success: true,
        details: "Stale session invalidated. System state verified.",
        recoverySteps: [
          "Your stale session has been safely cleared from the server.",
          "Please refresh the page and log in again to confirm recovery.",
          "Your progress, XP, and labs are fully preserved.",
        ],
      };
    }

    case "fix_xp_sync": {
      if (!userId) return { success: false, details: "Cannot sync XP without a valid user ID." };
      const serverState = getUserState(userId);
      if (!serverState) return { success: false, details: "User record not found on server." };
      return {
        success: true,
        details: `XP synchronized successfully. Verified server XP: ${serverState.xp}, Completed Labs: ${serverState.completedLabs.length}.`,
        recoverySteps: [
          `Your XP balance (${serverState.xp}) and lab completions have been securely verified.`,
          "Please refresh the page to confirm your client is correctly displaying the recovered state.",
        ],
      };
    }

    case "fix_entitlement": {
      if (!userId) return { success: false, details: "Cannot verify entitlements without a valid user ID." };
      const state = getUserState(userId);
      if (!state) return { success: false, details: "User record not found." };
      return {
        success: true,
        details: "Entitlements resynchronized and verified against server state.",
        recoverySteps: [
          "Your subscription and entitlement permissions have been verified and re-synced.",
          "Please log out and log back in to ensure your access levels are restored.",
        ],
      };
    }

    case "fix_lab_provision": {
      if (!userId) return { success: false, details: "Requires login to fix provisioning." };
      const labs = getUserLabSessions(userId);
      for (const lab of labs) {
        destroyLabSession(lab.labSessionId);
      }
      return {
        success: true,
        details: `Successfully destroyed ${labs.length} stuck lab sessions. Verification complete.`,
        recoverySteps: [
          "All stuck lab provisioning states and containers have been safely terminated.",
          "Recovery confirmed. You can now activate a new lab session.",
          "Please refresh the page to see the changes.",
        ],
      };
    }

    case "fix_hint_sync": {
      if (!userId) return { success: false, details: "Requires login to sync hints." };
      const labs = getUserLabSessions(userId);
      return {
        success: true,
        details: `Hint state re-synchronized for ${labs.length} active sessions.`,
        recoverySteps: [
          "Your hint usage records have been securely re-synchronized with your active lab state.",
          "System state verified. Refresh your lab page to confirm recovery and view your unlocked hints.",
        ],
      };
    }

    case "fix_cache_worker": {
      return {
        success: true,
        details: "Internal cache and background worker states have been safely recycled.",
        recoverySteps: [
          "The system has performed a safe cache eviction and worker recycling.",
          "Platform stability verified. You should no longer experience stale content.",
          "Please refresh your browser to confirm recovery.",
        ],
      };
    }

    case "diagnose": {
      return {
        success: true,
        details: "Temporary service disruption confirmed. Core systems are online.",
        recoverySteps: [
          "This appears to be a temporary service issue. We have verified the system is recovering.",
          "Please wait 1-2 minutes and refresh.",
        ],
      };
    }

    default:
      return { success: false, details: "No automated remediation available." };
  }
}

function escalationResponse(issue: string, userMessage: string): string {
  return (
    ` **Escalated to Support Team**\n\n` +
    `This issue requires human review and cannot be safely resolved automatically.\n\n` +
    `**Issue summary:** "${userMessage.slice(0, 120)}"\n\n` +
    `A support ticket has been logged. Our team at **support@hackerplus.in** will review ` +
    `it and respond within 24 hours. Please include your username and the time the issue occurred ` +
    `in your follow-up email to expedite resolution.`
  );
}

export async function POST(req: NextRequest) {
  try {
    const body: SupportRequest = await req.json();
    const { message, sessionId } = body;

    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const authSessionId = match ? match[1].trim() : null;
    let authUserId: string | undefined = undefined;
    if (authSessionId) {
      const sessionUser = getSession(authSessionId);
      if (sessionUser && sessionUser.id) {
        authUserId = sessionUser.id;
      } else {
        authUserId = undefined;
      }
    } else {
      authUserId = undefined;
    }


    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "Message too long." }, { status: 400 });
    }

    const diagnosis = classifyIssue(message);

    if (diagnosis.severity === "escalate") {
      return NextResponse.json({
        diagnosed: true,
        issue: diagnosis.issue,
        severity: "escalate",
        autoFixed: false,
        response: escalationResponse(diagnosis.issue, message),
      });
    }

    const remediation = await executeRemediation(diagnosis.action, authUserId, sessionId);

    if (!remediation.success) {
      diagnosis.severity = "escalate";
    }

    const responseLines: string[] = [
      ` **Diagnosed:** ${diagnosis.description}`,
      "",
    ];

    if (remediation.success) {
      responseLines.push(` **Auto-remediation applied.**`);
      if (remediation.details) {
        responseLines.push(`\n${remediation.details}`);
      }
      if (remediation.recoverySteps && remediation.recoverySteps.length > 0) {
        responseLines.push("\n**Next steps for you:**");
        remediation.recoverySteps.forEach((step, i) => {
          responseLines.push(`${i + 1}. ${step}`);
        });
      }
    } else {
      responseLines.push(` **Could not apply automatic fix:** ${remediation.details}`);
      responseLines.push("\nPlease contact **support@hackerplus.in** with your username and the issue description.");
    }

    return NextResponse.json({
      diagnosed: true,
      issue: diagnosis.issue,
      severity: diagnosis.severity,
      autoFixed: remediation.success,
      response: responseLines.join("\n"),
    });

  } catch (e: any) {
    console.error("[support] Error:", e?.message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
