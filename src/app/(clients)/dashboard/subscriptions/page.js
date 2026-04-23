'use client';
import { useState, useEffect } from 'react';
import api from '@/api/api';
import { motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import { Activity, CheckCircle2, XCircle, ArrowRight, Zap, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getActiveSubscription, getSubscriptionDisplayName, getSubscriptionRenewalDate, getSubscriptionServices } from '@/utils/subscriptions';

function SubscriptionsContent() {
  const [subscription, setSubscription] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const searchParams = useSearchParams();
  const activeSub = getActiveSubscription(subscription);
  const activePlanName = getSubscriptionDisplayName(activeSub);
  const activeRenewalDate = getSubscriptionRenewalDate(activeSub);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const subRes = await api.get('/subscriptions');
      setSubscription(subRes.data || []);

      const servRes = await api.get('/services');
      const recurringServices = getSubscriptionServices(servRes.data || [])
        .sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd));
      setServices(recurringServices);
    } catch (err) {
      console.error('Failed to fetch subscription data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!activeSub) return;
    try {
      setCancelling(true);
      await api.delete(`/subscriptions/${activeSub.id}`);
      setCancelConfirm(false);
      await fetchData();
    } catch (err) {
      alert('Failed to cancel subscription: ' + (err.response?.data?.error || err.message));
    } finally {
      setCancelling(false);
    }
  };

  const handleSubscribe = async (serviceId) => {
    try {
      setLoading(true);
      const res = await api.post('/subscriptions/checkout', { serviceId });
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Failed to initiate subscription checkout: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  const activeRenewalLabel = activeRenewalDate
    ? new Date(activeRenewalDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Subscription Plans</h1>
          <p className="text-gray-500 mt-1">Manage your organization&apos;s healthcare coordination package.</p>
        </div>
        <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl animate-breathe ${activeSub ? 'bg-lime-400 text-navy-900 shadow-lime-400/20' : 'bg-primary text-accent shadow-primary/10'}`}>
          <ShieldCheck className="w-4 h-4" /> Current: {activePlanName || 'Trial Period'}
        </div>
      </div>

      {searchParams.get('success') && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-lg text-navy-900 leading-tight">Plan Activated!</p>
            <p className="text-green-700/70 font-medium text-sm mt-0.5">Your subscription choice has been processed successfully.</p>
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto py-8">
          <h2 className="text-2xl font-black text-navy-900 mb-2 tracking-tight">Compare Our Healthcare Packages</h2>
          <p className="text-gray-500 font-medium text-sm italic">Upgrade or downgrade your plan anytime to match your organization&apos;s growing needs.</p>
        </div>

        {loading ? (
          <div className="p-20 flex items-center justify-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const isCurrent = activeSub?.service_id === service.id;
              const isUpgrade = activeSub && parseFloat(service.price_usd) > parseFloat(activeSub.amount_usd);
              const isDowngrade = activeSub && parseFloat(service.price_usd) < parseFloat(activeSub.amount_usd);

              return (
                <div 
                  key={service.id} 
                  onClick={() => setSelectedPlan(service)}
                  className={`relative flex flex-col bg-white rounded-[3rem] border transition-all duration-500 p-10 group cursor-pointer ${
                    isCurrent 
                      ? 'border-lime-400 shadow-2xl shadow-lime-400/10 ring-4 ring-lime-400/5' 
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-navy-900/5 hover:-translate-y-2'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-8 right-8 bg-lime-400 text-navy-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                      Active Plan
                    </div>
                  )}

                  <div className="mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${isCurrent ? 'bg-lime-400 text-navy-900' : 'bg-gray-50 text-gray-400'}`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-navy-900 mb-2 tracking-tight">{service.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-navy-900">${parseFloat(service.price_usd).toFixed(0)}</span>
                      <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">/ month</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-10">
                    <p className="text-gray-500 text-sm font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4">
                      {service.description || "Full access to our healthcare coordination suite."}
                    </p>
                    
                    {service.benefits && service.benefits.length > 0 && (
                      <ul className="space-y-3 pt-4 border-t border-gray-50">
                        {service.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="flex gap-3 text-sm font-bold text-navy-900/70">
                            <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0 mt-0.5" />
                            <span className="truncate">{benefit}</span>
                          </li>
                        ))}
                        {service.benefits.length > 3 && (
                          <li className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-2 pl-7 hover:text-navy-900 transition-colors">
                            + {service.benefits.length - 3} more benefits (Click to view)
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="pt-2">
                    {!isCurrent ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSubscribe(service.id); }}
                        className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn bg-navy-900 text-white hover:bg-lime-400 hover:text-navy-900 shadow-xl shadow-navy-900/10"
                      >
                        {activeSub ? (isUpgrade ? 'Upgrade Now' : 'Downgrade Plan') : 'Activate Subscription'}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <div className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-center border-2 border-gray-100 text-gray-400">
                        Currently Active
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeSub && (
        <div className="mt-12 p-10 bg-navy-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in duration-700">
           <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-lime-400">Billing Insights</span>
              <h3 className="text-2xl font-black tracking-tight">
                {activeRenewalLabel ? `Your next renewal is on ${activeRenewalLabel}` : `${activePlanName} is currently active`}
              </h3>
              <p className="text-navy-200/60 font-medium text-sm">
                {activeRenewalLabel ? 'Automated billing via Paystack Secure Checkout.' : 'Your organization currently has an active plan on file.'}
              </p>
           </div>
           <button
             onClick={() => setCancelConfirm(true)}
             className="px-10 py-5 bg-white text-navy-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all shadow-2xl shadow-white/5 shrink-0"
           >
             Cancel Subscription
           </button>
        </div>
      )}

      <Modal
        isOpen={cancelConfirm}
        onClose={() => setCancelConfirm(false)}
        title="Cancel Subscription"
      >
        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4 p-6 bg-red-50 rounded-2xl border border-red-100">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-navy-900">Are you sure you want to cancel?</p>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Your <span className="font-bold text-navy-900">{activePlanName}</span> plan will remain active until{' '}
                {activeRenewalLabel || 'the end of the current billing period'}, then will not renew.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setCancelConfirm(false)}
              disabled={cancelling}
              className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-gray-50 text-navy-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Keep Plan
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-colors shadow-xl shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        title="Package Details"
      >
        {selectedPlan && (
          <div className="space-y-8 py-4">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-lime-400 text-navy-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-lime-400/20">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-navy-900 tracking-tight">{selectedPlan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-navy-900">${parseFloat(selectedPlan.price_usd).toFixed(0)}</span>
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">/ monthly recurring</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Detailed Description</h4>
              <p className="text-navy-900 font-medium leading-relaxed italic">
                {selectedPlan.description || "Our premium healthcare coordination package designed for seamless organization and patient support."}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-navy-900 ml-1">Included Benefits & Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPlan.benefits && selectedPlan.benefits.length > 0 ? selectedPlan.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <CheckCircle2 className="w-6 h-6 text-lime-500 shrink-0" />
                    <span className="text-sm font-bold text-navy-900/80">{benefit}</span>
                  </div>
                )) : (
                  <p className="text-gray-400 text-sm font-medium italic col-span-full">No specific benefits listed for this plan.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
               <button
                  onClick={() => { handleSubscribe(selectedPlan.id); setSelectedPlan(null); }}
                  className="w-full py-6 rounded-[1.5rem] bg-accent text-primary font-black uppercase tracking-widest text-sm hover:bg-accent-light transition-all shadow-2xl shadow-accent/20 flex items-center justify-center gap-3"
                >
                  {activeSub?.service_id === selectedPlan.id ? 'Continue with Current Plan' : 'Choose this Package'}
                  <ArrowRight className="w-5 h-5" />
                </button>
               <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest mt-4">Safe & Secure Payment via Paystack</p>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<div>Loading subscriptions...</div>}>
      <SubscriptionsContent />
    </Suspense>
  );
}
