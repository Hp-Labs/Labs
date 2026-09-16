path = "src/app/api/premium/create-checkout-session/route.ts"
new_content = """import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/sessionStore';

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
    const sessionId = match ? match[1] : null;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = getSession(sessionId);
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    // In a real application, this would contact Stripe/Paddle to generate a Checkout URL
    // For HPLabs, we simply return a mock URL. We DO NOT process the payment here automatically.
    return NextResponse.json({ 
      success: true, 
      url: "https://checkout.hplabs.local/pay/simulated" 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Fixed create-checkout-session.")
