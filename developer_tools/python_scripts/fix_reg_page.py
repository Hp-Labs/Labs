import os

with open('src/app/register/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Instead of fetching register-otp/verify, we just call register directly
replacement = '''
    const handleOTPSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
  
      try {
        const res = await register(username, email, phone, password, emailOTP, phoneOTP);
        if (res.success) {
          setOtpNotification('🚀 Account Created Successfully! Logging you in...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          setError(res.error || 'Registration failed.');
        }
      } catch (err: any) {
        setError("Network error during registration.");
      } finally {
        setIsLoading(false);
      }
    };
'''

import re
c = re.sub(r'const handleOTPSubmit = async.*?setIsLoading\(false\);\s*\}\s*\};', replacement.strip(), c, flags=re.DOTALL)

with open('src/app/register/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
