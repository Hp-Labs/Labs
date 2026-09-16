import os
import re

login_file = 'src/app/login/page.tsx'
with open(login_file, 'r', encoding='utf-8') as f:
    c = f.read()

replacement = '''
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return <div className="min-h-screen bg-[#06030c] flex items-center justify-center"><div className="text-[var(--hp-primary)]">Redirecting to Dashboard...</div></div>;
}
'''
with open(login_file, 'w', encoding='utf-8') as f:
    f.write(replacement)


register_file = 'src/app/register/page.tsx'
with open(register_file, 'w', encoding='utf-8') as f:
    f.write(replacement.replace('LoginPage', 'RegisterPage'))

