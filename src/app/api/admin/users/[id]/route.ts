import { NextResponse } from 'next/server';
import { requireAdminAPI } from '@/lib/services/adminGuard';
import { getDb, logSecurityEvent } from '@/lib/db';
import { getUserById, updateUser } from '@/lib/services/userStore';
import { revokeAllUserSessions, getUserSessions } from '@/lib/services/sessionStore';
import { revokeAllUserLabSessions, getUserLabSessions } from '@/lib/services/labSessionStore';
import { generateAndStoreRegistrationOTPs } from '@/lib/services/otpStore';
import { recalculateUserAccess, revokeEntitlement, repairSubscription, extendEntitlement } from '@/lib/services/entitlements';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await requireAdminAPI('view_user');
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

  try {
    // Note: in Next.js 15, route params must be awaited!
    const { id: userId } = await params;
    
    const user = getUserById(userId);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    const db = getDb();
    const payments = db.prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    const securityEvents = db.prepare('SELECT * FROM security_events WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(userId);
    const entitlements = db.prepare('SELECT * FROM entitlements WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    const coupons = db.prepare(`
      SELECT c.*, b.organization, b.course_name 
      FROM collaboration_coupons c 
      JOIN collaboration_batches b ON c.collaboration_id = b.id 
      WHERE c.redeemed_by = ? ORDER BY c.redeemed_at DESC
    `).all(userId);
    
    const authSessions = getUserSessions(userId);
    const labSessions = getUserLabSessions(userId);
    
    // safe user object without password hash/salt
    const safeUser = { ...user };
    delete safeUser.passwordHash;
    delete safeUser.passwordSalt;

    return NextResponse.json({ 
      success: true, 
      data: {
        user: safeUser,
        payments,
        securityEvents,
        authSessions,
        labSessions,
        entitlements,
        coupons
      } 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await requireAdminAPI('manage_user');
  if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });

  try {
    const { id: userId } = await params;
    const body = await req.json();
    const { action, payload } = body;

    const targetUser = getUserById(userId);
    if (!targetUser) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    // Ensure they don't lock out themselves or info@hackerplus.in
    if (targetUser.email === 'info@hackerplus.in') {
      return NextResponse.json({ success: false, message: 'Cannot modify Super Admin account' }, { status: 403 });
    }

    let resultMsg = 'Action completed successfully';

    switch (action) {
      case 'suspend':
        updateUser(userId, { suspended: true });
        revokeAllUserSessions(userId);
        revokeAllUserLabSessions(userId);
        resultMsg = 'User suspended and sessions revoked';
        break;
      case 'unsuspend':
        updateUser(userId, { suspended: false });
        resultMsg = 'User unsuspended';
        break;
      case 'force_logout':
        revokeAllUserSessions(userId);
        resultMsg = 'All auth sessions revoked';
        break;
      case 'repair_lab_access':
        revokeAllUserLabSessions(userId);
        resultMsg = 'All stuck lab sessions cleared';
        break;
      case 'extend_entitlement':
        const days = payload?.days || 30;
        const currentExpiry = targetUser.premiumUntil || Date.now();
        const newExpiry = Math.max(currentExpiry, Date.now()) + (days * 24 * 60 * 60 * 1000);
        updateUser(userId, { premiumUntil: newExpiry, plan: 'ADVANCED' });
        recalculateUserAccess(userId);
        resultMsg = `Entitlement extended by ${days} days`;
        break;
      case 'revoke_entitlement':
        updateUser(userId, { premiumUntil: null, plan: 'FREE' });
        recalculateUserAccess(userId);
        resultMsg = 'Entitlement revoked (reverted to FREE)';
        break;
      case 'revoke_collaboration':
        const dbForRevoke = getDb();
        dbForRevoke.prepare("DELETE FROM entitlements WHERE user_id = ? AND source = 'COLLABORATION'`").run(userId);
        recalculateUserAccess(userId);
        resultMsg = 'Collaboration entitlement revoked';
        break;
      case 'resend_verification':
        generateAndStoreRegistrationOTPs(targetUser.email, targetUser.phone);
        resultMsg = 'Verification OTP resent to user';
        break;
      case 'reset_account_state':
        updateUser(userId, { mfaEnabled: false, emailVerified: false });
        revokeAllUserSessions(userId);
        resultMsg = 'Account state reset (MFA and verification cleared)';
        break;
            case 'add_xp':
        const xpAmount = payload?.xp || 5000;
        updateUser(userId, { xp: (targetUser.xp || 0) + xpAmount });
        resultMsg = 'Added ' + xpAmount + ' XP';
        break;
      
      case 'shift_subscription':
        const newPlan = payload?.plan || 'PREMIUM';
        const months = payload?.months || 1;
        const newExp = Date.now() + (months * 30 * 24 * 60 * 60 * 1000);
        
        const shiftDb = getDb();
        shiftDb.prepare(`
          INSERT INTO entitlements (id, user_id, plan, source, status, activated_at, expires_at)
          VALUES (?, ?, ?, 'PAYMENT', 'ACTIVE', ?, ?)
        `).run('man_' + Date.now(), userId, newPlan, Date.now(), newExp);
        
        recalculateUserAccess(userId);
        resultMsg = 'Shifted subscription to ' + newPlan + ' for ' + months + ' months';
        break;
      case 'recalculate_entitlements':
        recalculateUserAccess(userId);
        resultMsg = 'Entitlements successfully recalculated';
        break;
      case 'reconcile_payment':
      case 'repair_subscription':
        const db = getDb();
        const recentPayment = db.prepare('SELECT id, amount, status FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId) as any;
        if (recentPayment && recentPayment.status === 'succeeded') {
           const subExpiry = Math.max(targetUser.premiumUntil || Date.now(), Date.now()) + (30 * 24 * 60 * 60 * 1000);
           updateUser(userId, { premiumUntil: subExpiry, plan: 'ADVANCED' });
        }
        recalculateUserAccess(userId);
        resultMsg = 'Subscription and payments reconciled';
        break;
      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    logSecurityEvent({
      eventType: `admin_action_${action}`,
      userId: userId,
      details: { admin: adminUser.email, payload },
      severity: 'warn'
    });

    return NextResponse.json({ success: true, message: resultMsg });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
