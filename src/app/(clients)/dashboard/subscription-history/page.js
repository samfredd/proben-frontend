'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  ArrowRight,
  Receipt,
  Calendar,
  DollarSign,
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    icon: CheckCircle2,
    classes: 'bg-lime-100 text-lime-700 border-lime-200',
    dot: 'bg-lime-500',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    classes: 'bg-red-50 text-red-600 border-red-100',
    dot: 'bg-red-400',
  },
  past_due: {
    label: 'Past Due',
    icon: AlertTriangle,
    classes: 'bg-amber-50 text-amber-600 border-amber-100',
    dot: 'bg-amber-400',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    classes: 'bg-blue-50 text-blue-600 border-blue-100',
    dot: 'bg-blue-400',
  },
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function SubscriptionHistoryPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/subscriptions')
      .then((res) => setSubscriptions(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const active = subscriptions.filter((s) => s.status === 'active');
  const past = subscriptions.filter((s) => s.status !== 'active');

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader
        title="Subscription History"
        subtitle="A full record of every plan your organization has held"
      />

      <main className="p-8 space-y-10 max-w-[1200px] mx-auto">
        {/* Summary strip */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Total Plans', value: subscriptions.length, icon: Receipt },
            { label: 'Active Now', value: active.length, icon: CheckCircle2 },
            {
              label: 'Total Spent',
              value: `$${subscriptions
                .filter((s) => s.status === 'active' || s.status === 'cancelled')
                .reduce((sum, s) => sum + Number(s.amount_usd || 0), 0)
                .toFixed(0)}`,
              icon: DollarSign,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="glass-panel p-6 flex items-center gap-5 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-navy-900/5 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-navy-900/50" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                <p className="text-2xl font-black text-navy-900 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-[3rem]">
            <Zap className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-navy-900 mb-2">No subscription history yet</h3>
            <p className="text-gray-500 font-medium mb-8">Pick a plan to get started.</p>
            <Link
              href="/dashboard/subscriptions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-lime-500 hover:text-navy-900 transition-all shadow-xl shadow-navy-900/10"
            >
              View Plans <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Active subscriptions */}
            {active.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-navy-900/40">
                  Current
                </h2>
                {active.map((sub, i) => (
                  <SubscriptionRow key={sub.id} sub={sub} index={i} />
                ))}
              </section>
            )}

            {/* Past subscriptions */}
            {past.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-navy-900/40">
                  History
                </h2>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[1.85rem] top-6 bottom-6 w-px bg-gray-100" />
                  <div className="space-y-4">
                    {past.map((sub, i) => (
                      <SubscriptionRow key={sub.id} sub={sub} index={i} timeline />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SubscriptionRow({ sub, index, timeline = false }) {
  const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`glass-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-xl transition-all duration-300 ${
        timeline ? 'ml-8' : ''
      }`}
    >
      {timeline && (
        <div
          className={`absolute -left-[0.35rem] w-3 h-3 rounded-full border-2 border-white ${cfg.dot} shrink-0`}
        />
      )}

      <div className="flex items-center gap-5 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-navy-900 text-lime-400 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-navy-900 text-lg leading-tight truncate">
            {sub.service_name || sub.plan_name || 'Subscription'}
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-0.5">
            Started {formatDate(sub.created_at)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 shrink-0">
        {/* Amount */}
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</p>
          <p className="font-black text-navy-900 text-lg">
            ${Number(sub.amount_usd || 0).toFixed(0)}
            <span className="text-xs text-gray-400 font-bold"> /mo</span>
          </p>
        </div>

        {/* Next billing / period end */}
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {sub.status === 'active' ? 'Next Billing' : 'Ended'}
          </p>
          <p className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {formatDate(sub.current_period_end || sub.next_billing_date)}
          </p>
        </div>

        {/* Status badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${cfg.classes}`}
        >
          <Icon className="w-3 h-3" />
          {cfg.label}
        </div>
      </div>
    </motion.div>
  );
}
