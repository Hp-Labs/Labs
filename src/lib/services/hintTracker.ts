export interface LabSession {
  startTime: number;
  activityScore: number;
  lastActivity: number;
}

const sessions = new Map<string, LabSession>();

export function startSession(sessionId: string) {
  sessions.set(sessionId, {
    startTime: Date.now(),
    activityScore: 0,
    lastActivity: Date.now(),
  });
}

export function registerActivity(sessionId: string) {
  const session = sessions.get(sessionId);
  if (session) {
    session.activityScore += 1;
    session.lastActivity = Date.now();
  }
}

export function getSession(sessionId: string): LabSession | undefined {
  return sessions.get(sessionId);
}
