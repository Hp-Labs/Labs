import os

path = "src/lib/services/ticketStore.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Add DeliveryStatus type
c = c.replace('export type TicketStatus = "open" | "in_progress" | "resolved" | "escalated";', 'export type TicketStatus = "open" | "in_progress" | "resolved" | "escalated";\nexport type DeliveryStatus = "sent" | "failed" | "not-configured";')

# Update interface
c = c.replace('status: TicketStatus;', 'status: TicketStatus;\n  emailDelivery?: DeliveryStatus;\n  whatsappDelivery?: DeliveryStatus;')

# Update rowToTicket
c = c.replace('status: row.status as TicketStatus,', 'status: row.status as TicketStatus,\n    emailDelivery: row.email_delivery || "not-configured",\n    whatsappDelivery: row.whatsapp_delivery || "not-configured",')

# Add update method
update_method = """export function updateTicketDeliveryStatus(ticketId: string, emailDelivery: DeliveryStatus, whatsappDelivery: DeliveryStatus) {
  const db = getDb();
  try {
    db.prepare("UPDATE support_tickets SET email_delivery = ?, whatsapp_delivery = ?, updated_at = ? WHERE ticket_id = ?")
      .run(emailDelivery, whatsappDelivery, Date.now(), ticketId);
  } catch (e) {
    // Columns might not exist yet if migration didn't run, handle gracefully
    console.warn("Could not update delivery status in DB. Missing columns?");
  }
}
"""
c = c + "\n" + update_method

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated ticketStore")
