'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import {
  CreditCard, DollarSign, Download, Search, ChevronRight,
  ShieldCheck, Clock, CheckCircle, CheckCircle2, Zap,
  ArrowRight, AlertTriangle, RefreshCw, PartyPopper, X,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { getActiveSubscription, getSubscriptionRenewalDate, getSubscriptionServices } from '@/utils/subscriptions';
import { isHostedInvoiceFileUrl } from '@/utils/invoices';
import { useSubscription } from '@/context/SubscriptionContext';

const InvoiceDownloadButton = dynamic(
  () => import('@/components/payments/InvoiceDownloadButton'),
  { ssr: false }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d) ? '—' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtAmount(v) {
  return `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const wait = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Overview tab ─────────────────────────────────────────────────────────────

function Overview({ services, activeSub, loading, onSubscribe }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const activeRenewalDate = getSubscriptionRenewalDate(activeSub);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-[2rem] py-24 flex flex-col items-center gap-6 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
          <CreditCard className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-navy-900">No plans available</p>
          <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">Please check back later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Active plan hero */}
      {activeSub && (
        <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-lime-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-lime-600">Active Plan</span>
                <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                <span className="text-[10px] font-medium text-gray-400">Current Status</span>
              </div>
              <h2 className="text-xl font-bold text-navy-900">
                {activeSub.plan_name || activeSub.service_name}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {fmtAmount(activeSub.amount_usd)}/month · Renews {fmtDate(activeRenewalDate)}
              </p>
            </div>
          </div>
          
          <button className="px-6 py-2.5 bg-navy-900 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-navy-800 transition-colors">
            Manage Subscription
          </button>
        </div>
      )}

      {/* Plan cards grid */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Available Plans</h3>

        <div className={`grid gap-6 ${services.length === 1 ? 'grid-cols-1 max-w-sm' : services.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
          {services.map((service) => {
            const isCurrent = activeSub?.service_id === service.id;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedPlan(service)}
                className={`relative flex flex-col bg-white rounded-xl p-6 border transition-all cursor-pointer ${
                  isCurrent ? 'border-navy-900 ring-1 ring-navy-900' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-navy-900">{service.name}</h3>
                  {isCurrent && <CheckCircle2 className="w-4 h-4 text-lime-600" />}
                </div>
                
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-navy-900">${parseFloat(service.price_usd).toFixed(0)}</span>
                  <span className="text-xs font-medium text-gray-400">/mo</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  {service.description || "Enhanced medical workflow tools."}
                </p>

                <div className="space-y-3 mb-8 flex-1">
                  {service.benefits?.slice(0, 5).map((b, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 mt-0.5 shrink-0" />
                      <span className="text-[11px] font-medium text-navy-900/70">{b}</span>
                    </div>
                  ))}
                </div>

                {!isCurrent ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); onSubscribe(service.id); }}
                    className="w-full py-2.5 rounded-lg bg-navy-900 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-navy-800 transition-colors"
                  >
                    Select Plan
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-lg bg-gray-50 text-gray-400 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center">
                    Current Plan
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan detail modal */}
      <Modal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} title="Plan Details">
        {selectedPlan && (
          <div className="space-y-8 py-4">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-navy-900 text-lime-400 rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-navy-900 tracking-tight">{selectedPlan.name}</h3>
                <p className="text-sm font-medium text-gray-500">{fmtAmount(selectedPlan.price_usd)} per month</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
               <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Description</h4>
               <p className="text-sm text-navy-900/70 leading-relaxed">
                {selectedPlan.description || "Comprehensive service plan tailored for organizational needs."}
               </p>
            </div>

            {selectedPlan.benefits?.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Features Included</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPlan.benefits.map((b, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-bold text-navy-900/80 leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => { onSubscribe(selectedPlan.id); setSelectedPlan(null); }}
                className="w-full py-4.5 rounded-xl bg-navy-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-navy-800 transition-all flex items-center justify-center gap-2"
              >
                {activeSub?.service_id === selectedPlan.id ? 'Already Subscribed' : 'Select This Plan'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Payments tab ─────────────────────────────────────────────────────────────

function PaymentsView({ invoices, transactions, loading, user, onPayInvoice }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const allItems = [
    ...invoices.map(inv => ({ ...inv, _type: 'invoice' })),
    ...transactions.map(tx => ({ ...tx, _type: 'transaction' })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const visible = allItems.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = !q || (item.title || '').toLowerCase().includes(q) || (item.reference || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-navy-900 transition-colors" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reference or title..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-100 bg-white text-sm font-medium text-navy-900 outline-none focus:ring-4 focus:ring-navy-900/5 transition-all"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none px-4 py-3 rounded-xl border border-gray-100 bg-white text-xs font-bold uppercase tracking-wider text-gray-500 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
             <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />
          </div>
        ) : visible.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mb-4">
               <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-navy-900">No transactions found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-wider text-gray-400">Transaction Details</th>
                  <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                  <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-wider text-gray-400">Amount</th>
                  <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-wider text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          item._type === 'invoice' ? 'bg-amber-50 text-amber-600' : 'bg-navy-900 text-lime-400'
                        }`}>
                          {item._type === 'invoice' ? <AlertTriangle className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-navy-900 truncate">
                            {item.title || item.type || 'Service'}
                          </p>
                          <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                            ID: {(item.id || item.reference || '').toString().slice(0, 10).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-medium text-navy-900">{fmtDate(item.created_at)}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-navy-900">{fmtAmount(item.amount_usd)}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wide ${
                        item.status === 'paid' || item.status === 'success' || item.status === 'active'
                          ? 'bg-lime-500/10 text-lime-600 border border-lime-500/20'
                          : item.status === 'unpaid' || item.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {item._type === 'invoice' && item.status !== 'paid' && (
                          <button
                            onClick={() => onPayInvoice(item)}
                            className="px-4 py-2 bg-navy-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-navy-800 transition-colors"
                          >
                            Pay
                          </button>
                        )}
                        {isHostedInvoiceFileUrl(item.file_url) ? (
                          <a 
                            href={item.file_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-2 text-gray-400 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        ) : (item.status === 'paid' || item.status === 'success') && item._type !== 'transaction' ? (
                          <div className="scale-75 origin-right">
                            <InvoiceDownloadButton transaction={item} user={user} />
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-100">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{visible.length} Total records</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

function BillingHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { refresh: refreshGlobalSubscriptions } = useSubscription();

  const currentView = searchParams.get('view') || 'overview';

  const [invoices, setInvoices]         = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [services, setServices]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [subscribing, setSubscribing]   = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const activeSub = getActiveSubscription(subscriptions);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [txRes, subRes, svcRes] = await Promise.all([
        api.get('/payments/transactions'),
        api.get('/subscriptions'),
        api.get('/services'),
      ]);

      setInvoices(txRes.data.invoices || []);
      setTransactions(txRes.data.transactions || []);
      setSubscriptions(subRes.data || []);
      setServices(
        getSubscriptionServices(svcRes.data || [])
          .sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd))
      );
    } catch (err) {
      console.error('Failed to load billing data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const reference = searchParams.get('reference') || searchParams.get('trxref');
      // Paystack redirects back with ?success=true&reference=xxx&trxref=xxx
      const isPaystackReturn = searchParams.get('success') === 'true' && reference;
      // Also handle the legacy ?payment=success param just in case
      const isLegacyReturn = searchParams.get('payment') === 'success' && reference;

      if (isPaystackReturn || isLegacyReturn) {
        try {
          const res = await api.post('/subscriptions/verify', { reference });
          if (res.data?.pendingWebhook) {
            for (let i = 0; i < 5; i++) {
              await wait(1500);
              const s = await api.get('/subscriptions');
              const synced = (s.data || []).find(
                sub => sub.service_id === res.data.serviceId && sub.status === 'active'
              );
              if (synced) break;
            }
          }
          setPaymentSuccess(true);
          // Also refresh the global subscription context so the sidebar/dashboard reflects the new plan
          refreshGlobalSubscriptions();
        } catch (err) {
          console.error('Subscription verification failed:', err);
        }
        // Clean the URL, then fetch fresh data
        router.replace('/dashboard/payments');
        await fetchData();
        return;
      }
      await fetchData();
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscribe = async (serviceId) => {
    setSubscribing(true);
    try {
      const res = await api.post('/subscriptions/checkout', { serviceId });
      if (res.data.checkoutUrl) window.location.href = res.data.checkoutUrl;
    } catch (err) {
      alert('Could not start checkout: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubscribing(false);
    }
  };

  const handlePayInvoice = async (invoice) => {
    try {
      const res = await api.post('/payments/initialize', {
        amount_usd: invoice.amount_usd,
        email: user?.email,
        metadata: { type: 'invoice', invoice_id: invoice.id, description: `Invoice: ${invoice.title}` },
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      alert('Payment error: ' + (err.response?.data?.error || err.message));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Subscription Plans' },
    { id: 'payments', label: 'Transaction History' },
  ];

  return (
    <div className="flex-1 bg-white min-h-screen">
      <DashboardHeader title="Billing Hub" subtitle="Subscription and financial management" />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-8">

        {/* ── Subscription success banner ── */}
        <AnimatePresence>
          {paymentSuccess && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-navy-900 text-white rounded-xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-lime-500 text-navy-900 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Payment Successful</p>
                  <p className="text-xs text-white/60 font-medium">Your subscription has been updated.</p>
                </div>
              </div>
              <button 
                onClick={() => setPaymentSuccess(false)} 
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab bar */}
        <div className="flex border-b border-gray-100 gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => router.push(`?view=${tab.id}`)}
              className={`pb-4 px-1 text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentView === tab.id 
                  ? 'text-navy-900' 
                  : 'text-gray-400 hover:text-navy-900'
              }`}
            >
              {tab.label}
              {currentView === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {currentView === 'payments' ? (
            <PaymentsView
              invoices={invoices}
              transactions={transactions}
              loading={loading}
              user={user}
              onPayInvoice={handlePayInvoice}
            />
          ) : (
            <Overview
              services={services}
              activeSub={activeSub}
              loading={loading || subscribing}
              onSubscribe={handleSubscribe}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function BillingHubPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
      </div>
    }>
      <BillingHubContent />
    </Suspense>
  );
}
