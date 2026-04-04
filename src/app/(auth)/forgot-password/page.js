'use client';
import { useState } from 'react';
import api from '@/api/api';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout 
        title="Check Your Inbox" 
        subtitle="We've sent recovery instructions to your work email address."
        imageSrc="/auth_visual_premium.png"
      >
        <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center shadow-xl shadow-lime-500/10">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-navy-900">Email Sent</h1>
            <p className="text-gray-500 font-medium max-w-sm">
                If an account exists for <span className="text-navy-900 font-bold">{email}</span>, you will receive a reset link shortly.
            </p>
          </div>
          <Link href="/login" className="w-full">
            <AuthButton variant="secondary" icon={false}>
                Back to Sign In
            </AuthButton>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Secure Your Account" 
      subtitle="Follow our enterprise-grade security protocols to regain access to your workspace."
      imageSrc="/auth_visual_premium.png"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-left">
          <h2 className="text-4xl font-black text-navy-900 tracking-tight mb-3">Reset Password</h2>
          <p className="text-gray-500 font-medium">Enter your work email to receive a recovery link.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Work Email"
            icon="mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organization.com"
            required
          />

          <AuthButton loading={loading}>
            Send Recovery Link
          </AuthButton>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm font-medium text-gray-500">
            Remembered your password? <Link href="/login" className="text-navy-900 font-bold hover:underline underline-offset-4 decoration-2">Sign In</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
