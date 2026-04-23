'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { getSubscriptionServices } from '@/utils/subscriptions';

function OnboardingContent() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    api.get('/services')
      .then(res => setServices(
        getSubscriptionServices(res.data || [])
          .sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd))
      ))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (serviceId) => {
    setSelectedId(serviceId);
    try {
      const res = await api.post('/subscriptions/checkout', { serviceId });
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } catch (err) {
      setSelectedId(null);
      alert('Failed to start checkout: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col">
      {/* Top bar */}
      <header className="w-full flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#0a1128]">
            <Image src="/logo.png" alt="Proben" width={26} height={26} className="brightness-0 invert object-contain" />
          </div>
          <span className="font-black text-[#0a1128] text-lg tracking-tight">Proben</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-bold text-gray-400 hover:text-[#0a1128] transition-colors flex items-center gap-1.5"
        >
          Skip for now
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center px-6 py-16">
        {/* Welcome section */}
        <div className="text-center max-w-2xl mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-[#82C341]/10 text-[#5a8a2a] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Step 2 of 2 · Choose Your Plan
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#0a1128] tracking-tight leading-tight mb-4">
            Welcome{user?.organization_name ? `, ${user.organization_name}` : ''}!
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            Select a healthcare coordination package to get started. You can upgrade or change plans anytime.
          </p>
        </div>

        {/* Plan cards */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#82C341] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full animate-in fade-in duration-500">
            {services.map((service, index) => {
              const isPopular = index === 1;
              return (
                <div
                  key={service.id}
                  className={`relative flex flex-col bg-white rounded-[3rem] border transition-all duration-500 p-10 group ${
                    isPopular
                      ? 'border-[#82C341] shadow-2xl shadow-[#82C341]/10 ring-4 ring-[#82C341]/5 -translate-y-2'
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-[#0a1128]/5 hover:-translate-y-2'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-8 right-8 bg-[#82C341] text-[#0a1128] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${isPopular ? 'bg-[#82C341] text-[#0a1128]' : 'bg-gray-50 text-gray-400'}`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-[#0a1128] mb-2 tracking-tight">{service.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#0a1128]">${parseFloat(service.price_usd).toFixed(0)}</span>
                      <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">/ month</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-10">
                    <p className="text-gray-500 text-sm font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4">
                      {service.description || 'Full access to our healthcare coordination suite.'}
                    </p>
                    {service.benefits?.length > 0 && (
                      <ul className="space-y-3 pt-4 border-t border-gray-50">
                        {service.benefits.slice(0, 4).map((benefit, i) => (
                          <li key={i} className="flex gap-3 text-sm font-bold text-[#0a1128]/70">
                            <CheckCircle2 className="w-4 h-4 text-[#82C341] shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                        {service.benefits.length > 4 && (
                          <li className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-7">
                            +{service.benefits.length - 4} more
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubscribe(service.id)}
                    disabled={!!selectedId}
                    className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-60 disabled:cursor-not-allowed ${
                      isPopular
                        ? 'bg-[#82C341] text-[#0a1128] hover:bg-[#76b13b] shadow-xl shadow-[#82C341]/20'
                        : 'bg-[#0a1128] text-white hover:bg-[#82C341] hover:text-[#0a1128] shadow-xl shadow-[#0a1128]/10'
                    }`}
                  >
                    {selectedId === service.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-14 text-sm font-medium text-gray-400 text-center">
          Not sure which plan fits?{' '}
          <Link href="/dashboard" className="text-[#0a1128] font-bold hover:underline underline-offset-4">
            Explore the dashboard first
          </Link>
          {' '}or{' '}
          <Link href="/support" className="text-[#0a1128] font-bold hover:underline underline-offset-4">
            contact support
          </Link>.
        </p>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#82C341] border-t-transparent" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
