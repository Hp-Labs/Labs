import os

path = "src/app/api/support/escalate/route.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace(
    'import { createTicket, getTicket } from "@/lib/services/ticketStore";',
    'import { createTicket, getTicket, updateTicketDeliveryStatus } from "@/lib/services/ticketStore";'
)

old_call = """const teamNotified = await notifySupportTeam(ticket, isSecurity);
    const userNotified = await notifyUserTicketCreated(ticket);
    
    const deliverySuccess = teamNotified || userNotified;"""

new_call = """const teamNotified = await notifySupportTeam(ticket, isSecurity);
    const userNotified = await notifyUserTicketCreated(ticket);
    
    // Record independently
    updateTicketDeliveryStatus(ticket.ticketId, teamNotified.email, teamNotified.whatsapp);
    
    const deliverySuccess = teamNotified.email === "sent" || teamNotified.whatsapp === "sent" || userNotified === "sent";"""

c = c.replace(old_call, new_call)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated escalate route")
