// ============================================================
// HpLabs  Ticket Store (server-side only)
// Backed by SQLite
// ============================================================

import { getDb } from "@/lib/db";
import crypto from "crypto";

export type TicketStatus = "open" | "in_progress" | "resolved" | "escalated";
export type DeliveryStatus = "sent" | "failed" | "not-configured";

export interface SupportTicket {
  ticketId: string;           // HPT-XXXXXXXX
  userId: string;
  name: string;
  email: string;
  phone: string;
  issueDescription: string;
  labId?: string;
  sessionId?: string;
  errorCode?: string;
  systemDiagnostics: {
    userAgent?: string;
    timestamp: string;
    serverXP?: number;
    serverLabsCompleted?: number;
  };
  remediationAttempts: string[];
  status: TicketStatus;
  emailDelivery?: DeliveryStatus;
  whatsappDelivery?: DeliveryStatus;
  createdAt: string;         // ISO timestamp
  updatedAt: string;
}

function rowToTicket(row: any): SupportTicket {
  return {
    ticketId: row.ticket_id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    issueDescription: row.issue_description,
    labId: row.lab_id || undefined,
    sessionId: row.session_id || undefined,
    errorCode: row.error_code || undefined,
    systemDiagnostics: JSON.parse(row.system_diagnostics),
    remediationAttempts: JSON.parse(row.remediation_attempts),
    status: row.status as TicketStatus,
    emailDelivery: row.email_delivery || "not-configured",
    whatsappDelivery: row.whatsapp_delivery || "not-configured",
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export function createTicket(data: Omit<SupportTicket, "ticketId" | "status" | "createdAt" | "updatedAt">): SupportTicket {
  const db = getDb();
  const ticketId = "HPT-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  const now = Date.now();

  db.prepare(`
    INSERT INTO support_tickets (
      ticket_id, user_id, name, email, phone, issue_description,
      lab_id, session_id, error_code, system_diagnostics, remediation_attempts,
      status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)
  `).run(
    ticketId, data.userId, data.name, data.email, data.phone, data.issueDescription,
    data.labId || null, data.sessionId || null, data.errorCode || null,
    JSON.stringify(data.systemDiagnostics || {}),
    JSON.stringify(data.remediationAttempts || []),
    now, now
  );

  return getTicket(ticketId)!;
}

export function getTicket(ticketId: string): SupportTicket | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM support_tickets WHERE ticket_id = ?").get(ticketId) as any;
  if (!row) return null;
  return rowToTicket(row);
}

export function updateTicketStatus(ticketId: string, status: TicketStatus) {
  const db = getDb();
  db.prepare("UPDATE support_tickets SET status = ?, updated_at = ? WHERE ticket_id = ?")
    .run(status, Date.now(), ticketId);
}

export function getAllTickets(): SupportTicket[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM support_tickets ORDER BY created_at DESC").all() as any[];
  return rows.map(rowToTicket);
}
export function updateTicketDeliveryStatus(ticketId: string, emailDelivery: DeliveryStatus, whatsappDelivery: DeliveryStatus) {
  const db = getDb();
  try {
    db.prepare("UPDATE support_tickets SET email_delivery = ?, whatsapp_delivery = ?, updated_at = ? WHERE ticket_id = ?")
      .run(emailDelivery, whatsappDelivery, Date.now(), ticketId);
  } catch (e) {
    // Columns might not exist yet if migration didn't run, handle gracefully
    console.warn("Could not update delivery status in DB. Missing columns?");
  }
}
