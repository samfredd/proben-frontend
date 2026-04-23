"use client";
import { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Download,
  Search,
  Plus,
  ChevronRight,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Receipt,
  CheckCircle,
  Filter,
  FileText,
  ExternalLink,
  Activity,
  CheckCircle2,
  Zap,
  ArrowRight
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

const InvoiceDownloadButton = dynamic(() => import('@/components/payments/InvoiceDownloadButton'), { ssr: false });

export default function ClientPayments() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'overview';
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unpaidBalance, setUnpaidBalance] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForSubscriptionSync = async (serviceId) => {
    if (!serviceId) {
      return;
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await wait(1200);
      const subRes = await api.get('/subscriptions');
      const subs = subRes.data || [];
      const syncedSubscription = subs.find(
        (sub) =>
          sub.service_id === serviceId &&
          sub.status === 'active' &&
          sub.paystack_subscription_code
      );

      if (syncedSubscription) {
        return;
      }
    }
  };
  const activeSub = getActiveSubscription(subscription);
  const activeRenewalDate = getSubscriptionRenewalDate(activeSub);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = (tx.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (tx.id || '').toString().toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Invoices
      const invRes = await api.get('/invoices');
      const invoices = invRes.data.invoices || [];

      // Fetch Subscriptions
      const subRes = await api.get('/subscriptions');
      const subs = subRes.data || [];
      setSubscription(subs);

      // Combine for transaction history
      const formattedSubs = subs.map(sub => ({
        id: sub.id,
        title: `Subscription: ${sub.plan_name || sub.service_name || 'Service'}`,
        amount_usd: sub.amount_usd,
        status: sub.status === 'active' ? 'paid' : sub.status,
        created_at: sub.created_at,
        file_url: '#' // Subscriptions might not have a downloadable file
      }));

      setTransactions([...invoices, ...formattedSubs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

      const unpaid = invoices
        .filter(inv => inv.status !== 'paid')
        .reduce((sum, inv) => sum + Number(inv.amount_usd), 0);
      setUnpaidBalance(unpaid);

      // Fetch Profile for actual balance_usd
      const userRes = await api.get('/auth/me');
      if (userRes.data?.user) {
        setAccountBalance(Number(userRes.data.user.balance_usd) || 0);
      }
      
      const servRes = await api.get('/services');
      const recurringServices = getSubscriptionServices(servRes.data || [])
        .sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd));
      setServices(recurringServices);

    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      const reference = searchParams.get('reference') || searchParams.get('trxref');
      if (searchParams.get('success') === 'true' && reference) {
        try {
          // Verify payment first
          const verificationRes = await api.post('/subscriptions/verify', { reference });
          if (verificationRes.data?.pendingWebhook) {
            await waitForSubscriptionSync(verificationRes.data.serviceId);
          }
          // Clear URL parameters
          router.replace('/dashboard/payments');
        } catch (error) {
          console.error('Subscription verification failed:', error);
        }
      }
      // After any verifications, load the data
      await fetchData();
    };

    initializePage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscribe = async (serviceId) => {
    try {
      setLoading(true);
      const res = await api.post('/subscriptions/checkout', { serviceId });
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } finally {
      setLoading(false);
    }
  };


  const handlePayInvoice = async (invoice) => {
    try {
      const res = await api.post('/payments/initialize', {
        amount_usd: invoice.amount_usd,
        email: user?.email,
        metadata: {
          type: 'invoice',
          invoice_id: invoice.id,
          description: `Invoice: ${invoice.title}`
        }
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      alert('Error initializing payment: ' + (error.response?.data?.error || error.message));
    }
  };

  const formatDateSafely = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const Overview = () => {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Comparison Grid Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-navy-900 mb-3 tracking-tight">Your Subscription Workspace</h2>
          <p className="text-gray-500 font-medium leading-relaxed italic">Compare healthcare packages and manage your organization&apos;s recurring service agreements.</p>
        </div>

        {loading ? (
          <div className="p-20 flex items-center justify-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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

        {/* Action Footer for active users */}
        {activeSub && (
          <div className="mt-12 p-10 bg-navy-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in duration-700">
             <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-lime-400">Account Health</span>
                <h3 className="text-2xl font-black tracking-tight">
                  {activeRenewalDate ? `Your next renewal is on ${formatDateSafely(activeRenewalDate)}` : 'Your plan is currently active'}
                </h3>
                <p className="text-navy-200/60 font-medium text-sm italic">
                  {activeRenewalDate ? 'Automated billing via Paystack Secure Checkout.' : 'Your organization has an active plan on file.'} (Amount: ${parseFloat(activeSub.amount_usd).toFixed(2)}/mo)
                </p>
             </div>
             <button onClick={() => router.push('?view=payments')} className="px-10 py-5 bg-white text-navy-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-lime-400 transition-all shadow-2xl shadow-white/5 shrink-0">
               View Billing History
             </button>
          </div>
        )}

        {/* Plan Details Modal */}
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
      </div>
    );
  };

  const PaymentsView = () => (
    <section className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col pt-8 animate-in slide-in-from-right-4 duration-700">
      <div className="px-8 pb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-navy-900 tracking-tight">Transaction History</h3>
          <p className="text-gray-400 text-sm font-medium">Download invoices and track your health spending</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 rounded-xl border border-gray-100 bg-white outline-none font-bold text-xs text-navy-900" 
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 hover:text-navy-900 transition-all text-xs font-bold outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
              <th className="px-8 py-5">Invoice ID</th>
              <th className="px-8 py-5">Service Details</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="6" className="px-8 py-20 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Loading history...</td></tr>
            ) : filteredTransactions.length === 0 ? (
              <tr><td colSpan="6" className="px-8 py-20 text-center text-xs font-black text-gray-400 uppercase tracking-widest">No transactions available</td></tr>
            ) : filteredTransactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <span className="text-sm font-black text-navy-900 tracking-tight">{tx.id.slice(0, 8)}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-bold text-navy-900 group-hover:text-blue-600 transition-colors">{tx.title}</div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-medium text-gray-400 uppercase">{formatDateSafely(tx.created_at)}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-black text-navy-900">${Number(tx.amount_usd).toFixed(2)}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {tx.status === 'paid' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                    )}
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{tx.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    {tx.status !== 'paid' && (
                      <button
                        onClick={() => handlePayInvoice(tx)}
                        className="px-4 py-2 bg-navy-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-navy-800 transition-all"
                      >
                        Pay
                      </button>
                    )}
                    {isHostedInvoiceFileUrl(tx.file_url) ? (
                      <a href={tx.file_url} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-navy-900 transition-all">
                        <Download className="w-4 h-4" />
                      </a>
                    ) : tx.status === 'paid' ? (
                      <InvoiceDownloadButton transaction={tx} user={user} />
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="Payments & Billing" subtitle="Manage your subscriptions, invoices, and payment methods" />

      <main className="p-8 space-y-8 max-w-[1600px] mx-auto text-navy-900">
        <AnimatePresence mode="wait">
          {currentView === 'payments' ? (
            <motion.div key="payments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <PaymentsView />
            </motion.div>
          ) : (
            <motion.div key="overview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <Overview />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
