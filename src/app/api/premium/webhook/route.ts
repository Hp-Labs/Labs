import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isEventProcessed, markEventProcessed, recordPayment, extendSubscription, revokeSubscription, grantPartnerEntitlement } from "@/lib/services/subscriptionStore";
import { getUserState, getUserByEmail, getUserById } from "@/lib/services/userStore";
import { logSecurityEvent } from "@/lib/db";

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) console.warn('PAYMENT_WEBHOOK_SECRET is missing!');

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const rawBody = await req.text();
    if (!WEBHOOK_SECRET) return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    
    const expectedSignature = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");

    if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      logSecurityEvent({ eventType: "webhook_invalid_signature", severity: "warn" });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const { event_id, event_type, data } = event;

    if (!event_id || !event_type || !data) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // Idempotency: duplicate webhook protection
    if (isEventProcessed(event_id)) {
      return NextResponse.json({ success: true, message: "Event already processed" });
    }

    const { user_id, email, amount, currency, status, plan_id, partner_id } = data;
    
    // Resolve user from user_id or email
    let user: any = null;
    if (user_id) {
      user = getUserById(user_id);
    } else if (email) {
      user = getUserByEmail(email);
    }
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resolvedUserId = user.id;

    // Parse plan and duration from plan_id (format: PLAN_DURATION e.g. PREMIUM_6)
    function parsePlan(planId: string): { plan: 'FREE' | 'BASIC' | 'INTERMEDIATE' | 'PREMIUM' | 'ADVANCED'; duration: number } {
      const up = (planId || '').toUpperCase();
      let plan: 'FREE' | 'BASIC' | 'INTERMEDIATE' | 'PREMIUM' | 'ADVANCED' = 'PREMIUM';
      if (up.includes('BASIC')) plan = 'BASIC';
      else if (up.includes('INTERMEDIATE')) plan = 'INTERMEDIATE';
      else if (up.includes('PREMIUM')) plan = 'PREMIUM';
      
      const match = up.match(/[_-](\d+)/);
      const duration = match ? parseInt(match[1], 10) : 1;
      return { plan, duration };
    }

    switch (event_type) {
      case "payment.succeeded":
      case "subscription.renewed":
      case "checkout.session.completed": {
        const { plan, duration } = parsePlan(plan_id || 'PREMIUM_1');
        
        recordPayment(event_id, resolvedUserId, amount || 0, currency || "INR", "succeeded", plan_id || "premium_1");
        extendSubscription(resolvedUserId, plan, duration, 'PAYMENT');
        
        // Calculate expiry date for email
        const expiryMs = Date.now() + duration * 30.44 * 24 * 60 * 60 * 1000;
        const expiryDate = new Date(expiryMs).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // Send payment success + invoice emails (non-blocking)
        const invoiceId = `INV-${Date.now().toString(36).toUpperCase()}`;
        const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        
        import('@/lib/services/emailService').then(({ sendEmail, getPaymentSuccessEmail, getInvoiceEmail, getSubscriptionActivatedEmail }) => {
          // Payment success email
          sendEmail({
            to: user.email,
            subject: `HPLabs - Payment Successful`,
            html: getPaymentSuccessEmail(user.username, plan, amount || 0, currency || 'INR', expiryDate),
            idempotencyKey: `payment_success_email_${event_id}`,
            userId: resolvedUserId,
            eventType: 'payment_success'
          });
          // Invoice email
          sendEmail({
            to: user.email,
            subject: `HPLabs - Invoice ${invoiceId}`,
            html: getInvoiceEmail(user.username, invoiceId, plan, amount || 0, currency || 'INR', dateStr),
            idempotencyKey: `invoice_email_${event_id}`,
            userId: resolvedUserId,
            eventType: 'invoice'
          });
          // Subscription activated email
          sendEmail({
            to: user.email,
            subject: `HPLabs - ${plan} Subscription Activated`,
            html: getSubscriptionActivatedEmail(user.username, plan, duration, expiryDate),
            idempotencyKey: `sub_activated_email_${event_id}`,
            userId: resolvedUserId,
            eventType: 'subscription_activated'
          });
        }).catch(e => console.error("[webhook] Failed to send payment emails:", e));
        
        logSecurityEvent({ eventType: "subscription_activated", userId: resolvedUserId, details: { plan, duration, event_id } });
        break;
      }

      case "payment.failed": {
        const { plan } = parsePlan(plan_id || 'PREMIUM_1');
        recordPayment(event_id, resolvedUserId, amount || 0, currency || "INR", "failed", plan_id || "unknown");
        
        import('@/lib/services/emailService').then(({ sendEmail, getPaymentFailedEmail }) => {
          sendEmail({
            to: user.email,
            subject: 'HPLabs - Payment Failed',
            html: getPaymentFailedEmail(user.username, plan, amount || 0, currency || 'INR'),
            idempotencyKey: `payment_failed_email_${event_id}`,
            userId: resolvedUserId,
            eventType: 'payment_failed'
          });
        }).catch(console.error);
        break;
      }

      case "subscription.expired":
      case "subscription.canceled":
        recordPayment(event_id, resolvedUserId, amount || 0, currency || "INR", "failed", plan_id || "none");
        revokeSubscription(resolvedUserId);
        
        import('@/lib/services/emailService').then(({ sendEmail, getSubscriptionExpiredEmail }) => {
          const { plan } = parsePlan(plan_id || 'PREMIUM');
          sendEmail({
            to: user.email,
            subject: 'HPLabs - Subscription Expired',
            html: getSubscriptionExpiredEmail(user.username, plan),
            idempotencyKey: `sub_expired_email_${event_id}`,
            userId: resolvedUserId,
            eventType: 'subscription_expired'
          });
        }).catch(console.error);
        break;

      case "partner.entitlement.granted":
        grantPartnerEntitlement(resolvedUserId, partner_id, data.duration_months || 1);
        break;

      default:
        console.log("Unhandled webhook event type:", event_type);
    }

    markEventProcessed(event_id);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("[Webhook Error]:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
