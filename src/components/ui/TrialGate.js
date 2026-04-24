'use client';
import Link from 'next/link';
import { Lock, ArrowRight, Zap } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';

export default function TrialGate({ children, feature = 'This feature' }) {
  const { isTrialing, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
      </div>
    );
  }

  if (!isTrialing) return children;

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Lock icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-[2rem] bg-navy-900 flex items-center justify-center shadow-2xl shadow-navy-900/20">
            <Lock className="w-10 h-10 text-lime-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-navy-900 tracking-tight">
            Upgrade to unlock
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            <span className="font-bold text-navy-900">{feature}</span> is available on paid plans.
            You&apos;re currently on a free trial — choose a subscription to get full access.
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/dashboard/payments"
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-5 bg-navy-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-lime-500 hover:text-navy-900 transition-all shadow-xl shadow-navy-900/10 group"
          >
            View Plans
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="block text-sm font-bold text-gray-400 hover:text-navy-900 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Trust note */}
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
          Secure billing via Paystack · Cancel anytime
        </p>
      </div>
    </div>
  );
}
