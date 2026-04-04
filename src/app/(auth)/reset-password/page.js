'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/api/api';
import { CheckCircle, Lock } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No reset token found. Please check your email link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout 
        title="Security Verified" 
        subtitle="Your password has been successfully updated. You are being redirected."
        imageSrc="/auth_visual_premium.png"
      >
        <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center shadow-xl shadow-lime-500/10">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-navy-900">Password Updated</h1>
            <p className="text-gray-500 font-medium">
                Your credentials have been reset. Redirecting to sign in page...
            </p>
          </div>
          <div className="w-full flex justify-center">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-lime-500 animate-progress" />
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create New Credentials" 
      subtitle="Finalize your account recovery by setting a strong, unique password."
      imageSrc="/auth_visual_premium.png"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-left">
          <h2 className="text-4xl font-black text-navy-900 tracking-tight mb-3">New Password</h2>
          <p className="text-gray-500 font-medium">Set your new access credentials below.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="New Password"
            icon="lock"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={!token}
          />
          <AuthInput
            label="Confirm New Password"
            icon="lock"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={!token}
          />

          <AuthButton loading={loading} disabled={!token}>
            Update Password
          </AuthButton>
        </form>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-500 border-t-transparent shadow-xl shadow-lime-500/20"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
