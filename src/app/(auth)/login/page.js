'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';

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
      title="Elite Operational Intelligence" 
      subtitle="Access your comprehensive tactical portal and manage your medical ecosystem with enterprise precision."
    >
      <div className="space-y-10">
        <div className="text-left">
           <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-accent" />
              <div className="h-px w-8 bg-slate-100" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Auth Module</span>
           </div>
           <h2 className="text-4xl font-black text-navy-900 tracking-tighter mb-3 leading-none">Command Entry</h2>
           <p className="text-sm font-medium text-slate-500">Provide your verified credentials to access the secure network.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <AuthInput
              label="Operational Email"
              icon="mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@proben.hq"
              required
            />

            <div className="space-y-3">
              <AuthInput
                label="System Password"
                icon="lock"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <div className="flex justify-end">
                <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-slate-300 hover:text-accent transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                  Credential Reset <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          <AuthButton loading={loading}>
            Authorize Session Access
          </AuthButton>
        </form>

        <div className="pt-8 border-t border-slate-50">
           <Link href="/signup" className="group w-full p-6 bg-slate-50/50 hover:bg-accent/5 rounded-3xl border border-slate-100 transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-accent group-hover:border-accent transition-all">
                    <UserPlus className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-hover:text-accent/60">New Operations</p>
                    <p className="text-xs font-black text-navy-900 tracking-tight">Register Organization</p>
                 </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-accent group-hover:translate-x-1 transition-all" />
           </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
