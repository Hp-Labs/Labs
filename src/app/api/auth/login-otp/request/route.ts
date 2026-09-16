import { NextResponse, NextRequest } from 'next/server';
import { generateAndStoreLoginOTP } from '@/lib/services/otpStore';
import { getUserByEmail } from '@/lib/services/userStore';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });
    
    const normEmail = email.toLowerCase().trim();
    if (!getUserByEmail(normEmail)) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    
    generateAndStoreLoginOTP(normEmail);
    
    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch(e) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
