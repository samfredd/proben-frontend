'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password, 'public');
    if (!res.success) toast.error(res.error);
    setLoading(false);
  };

  return (
    <AuthLayout 
      title="Welcome to the Future of Healthcare" 
      subtitle="Access your comprehensive portal and manage your medical ecosystem with ease."
      imageSrc="/auth_visual_premium.png"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-left">
          <h2 className="text-4xl font-black text-navy-900 tracking-tight mb-3">Sign In</h2>
          <p className="text-gray-500 font-medium">Enter your credentials to access your secure portal.</p>
        </div>



        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Work Email"
            icon="mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@healthcare.com"
            required
          />

          <div className="space-y-2">
            <AuthInput
              label="Password"
              icon="lock"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end">
              <Link href="/forgot-password" size="sm" className="text-xs font-bold text-gray-400 hover:text-navy-900 transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <AuthButton loading={loading}>
            Sign Into Portal
          </AuthButton>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm font-medium text-gray-400">
            New to the platform? <Link href="/signup" className="text-navy-900 font-bold hover:underline underline-offset-4 decoration-2">Register your organization</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
