'use client';
import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState('all');
  const [filterOrg, setFilterOrg] = useState('all');

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/mngmnt/transactions');
      setPayments(response.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(txn => {
    const typeMatch = filterType === 'all' || txn.type === filterType;
    const orgMatch = filterOrg === 'all' || txn.organization_name === filterOrg;
    return typeMatch && orgMatch;
  });

  const organizations = [...new Set(payments.map(p => p.organization_name))];

  const getTransactionLabel = (type) => {
    switch (type) {
      case 'subscription_create': return 'New Subscription';
      case 'subscription_renewal': return 'Subscription Renewal';
      case 'invoice_payment': return 'Invoice Settlement';
      case 'booking_payment': return 'Booking Payment';
      default: return type.replace(/_/g, ' ');
    }
  };

  const getTransactionReference = (txn) => txn?.metadata?.paystack_reference || txn?.reference || 'N/A';

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Financial Tracking" subtitle="Real-time oversight of all platform transactions" />

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="flex gap-4 w-full md:w-auto">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="px-6 py-3 rounded-2xl glass-panel border-none outline-none text-[10px] font-black uppercase tracking-widest text-navy-900 focus:ring-2 focus:ring-lime-500 transition-all bg-white/50"
              >
                <option value="all">All Types</option>
                <option value="subscription_create">Subscriptions</option>
                <option value="subscription_renewal">Renewals</option>
                <option value="invoice_payment">Invoices</option>
              </select>

              <select 
                value={filterOrg} 
                onChange={(e) => setFilterOrg(e.target.value)}
                className="px-6 py-3 rounded-2xl glass-panel border-none outline-none text-[10px] font-black uppercase tracking-widest text-navy-900 focus:ring-2 focus:ring-lime-500 transition-all bg-white/50"
              >
                <option value="all">All Clients</option>
                {organizations.filter(Boolean).map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
           </div>
           
           <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Showing {filteredPayments.length} transactions
           </div>
        </div>

        <div className="glass-panel overflow-hidden animate-breathe">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100/30">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Event Detail</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Organization</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/20">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loading Transaction Ledger...</p>
                       </div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">No matching transactions found</p>
                    </td>
                  </tr>
                ) : filteredPayments.map((txn) => (
                  <tr key={txn.id} className="group hover:bg-white/40 transition-all duration-300">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-500 ${
                          txn.type.includes('subscription') ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : 'bg-lime-50 text-lime-600 group-hover:bg-lime-600 group-hover:text-white'
                        }`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="font-black text-navy-900 tracking-tight leading-none mb-1">{getTransactionLabel(txn.type)}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(txn.created_at).toLocaleDateString()} at {new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <p className="font-black text-navy-900 tracking-tight">{txn.organization_name}</p>
                      <p className="text-[10px] font-bold text-gray-400">{txn.client_email}</p>
                    </td>
                    <td className="px-8 py-7">
                       <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-navy-900 tracking-tighter">${Number(txn.amount_usd || 0).toLocaleString()}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">USD</span>
                       </div>
                    </td>
                    <td className="px-8 py-7">
                       <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                         txn.status === 'success' ? 'bg-lime-500 text-white shadow-lime-500/20' : 'bg-red-500 text-white shadow-red-500/20'
                       }`}>
                         {txn.status === 'success' ? 'Settled' : txn.status}
                       </span>
                    </td>
                    <td className="px-8 py-7 text-right">
                       <code className="px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-400 rounded-lg group-hover:bg-navy-900 group-hover:text-white transition-colors">{getTransactionReference(txn)}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
