'use client';
import { useState } from 'react';
import {
  BarChart3,
  Search,
  Plus,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { getInvoiceAmount, isHostedInvoiceFileUrl } from '@/utils/invoices';

export default function AdminBillingPage() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'overview';

  const [invoices, setInvoices] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [amount, setAmount] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [status, setStatus] = useState('');

  async function fetchOrganizations() {
    try {
      const res = await api.get('/organizations');
      setOrganizations(res.data);
    } catch (err) {
      console.error('Failed to fetch organizations', err);
    }
  }

  async function fetchInvoices() {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    }
  }

  useEffect(() => {
    if (currentView === 'invoices' || currentView === 'overview') {
      fetchInvoices();
      if (currentView === 'invoices') fetchOrganizations();
    }
  }, [currentView]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await api.post('/invoices', {
        client_id: selectedOrg,
        amount: parseFloat(amount),
        file_url: fileUrl,
        status: 'unpaid'
      });
      setStatus('Invoice successfully uploaded and organization notified.');
      setAmount('');
      setFileUrl('');
      setSelectedOrg('');
      fetchInvoices();
      setTimeout(() => setStatus(''), 5000);
    } catch (err) {
      console.error('Failed to upload invoice', err);
      alert('Failed to upload invoice. Please ensure the database is connected.');
    }
  };

  const Overview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Revenue (MTD)</div>
          <div className="text-3xl font-black text-navy-900 mb-2 font-mono">$42,900.50</div>
          <div className="flex items-center gap-1 text-lime-600 font-bold text-[10px]">
            <TrendingUp className="w-3 h-3" />
            +12.5% from last month
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Pending Collections</div>
          <div className="text-3xl font-black text-navy-900 mb-2 font-mono">$8,450.00</div>
          <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit uppercase">Requires Attention</div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Successful Settlements</div>
          <div className="text-3xl font-black text-navy-900 mb-2 font-mono">98.2%</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Industry Benchmark: 95%</div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Refunds / Disputes</div>
          <div className="text-3xl font-black text-navy-900 mb-2 font-mono">$1,200.00</div>
          <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">3 Active Cases</div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-black text-navy-900 tracking-tight">Recent Activity Overview</h3>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 rounded-2xl bg-navy-900 text-white font-bold text-sm hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10">
              Run Billing Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-5">Client Name</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-navy-900">
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6 uppercase font-black text-xs text-navy-900">{inv.organization_name || 'Organization'}</td>
                  <td className="px-8 py-6 font-black text-sm text-navy-900 font-mono">${getInvoiceAmount(inv).toFixed(2)}</td>
                  <td className="px-8 py-6 text-xs text-gray-400 font-bold">{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${inv.status === 'paid' ? 'bg-navy-900 text-white border-navy-900' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const InvoicesView = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
        <h2 className="text-2xl font-black text-navy-900 tracking-tight mb-8">Generate Agency Invoice</h2>
        {status && <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-xs font-bold">{status}</div>}
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select
            value={selectedOrg}
            onChange={e => setSelectedOrg(e.target.value)}
            className="px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-xs"
            required
          >
            <option value="">Select Organization</option>
            {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-xs"
            required
          />
          <input
            type="url"
            placeholder="PDF Link"
            value={fileUrl}
            onChange={e => setFileUrl(e.target.value)}
            className="px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-xs"
            required
          />
          <button type="submit" className="md:col-span-3 bg-navy-900 text-white py-4 rounded-2xl font-black text-sm uppercase group hover:bg-navy-800 transition-all">
            Dispatch Invoice
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 font-black text-navy-900 uppercase tracking-widest text-xs">Recent Dispatches</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase border-b border-gray-50">
                <th className="px-8 py-5">Agency</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50/20 transition-all">
                  <td className="px-8 py-6 text-sm font-black text-navy-900">{inv.organization_name}</td>
                  <td className="px-8 py-6 text-sm font-black text-navy-900 font-mono">${getInvoiceAmount(inv).toFixed(2)}</td>
                  <td className="px-8 py-6 uppercase text-[10px] font-black text-navy-500">{inv.status}</td>
                  <td className="px-8 py-6 text-right">
                    {isHostedInvoiceFileUrl(inv.file_url) ? (
                      <a href={inv.file_url} target="_blank" className="p-3 bg-gray-50 rounded-xl inline-block hover:bg-gray-100 transition-all"><Download className="w-4 h-4 text-gray-400" /></a>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl inline-block"><Receipt className="w-4 h-4 text-gray-300" /></div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PaymentsView = () => (
    <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-xl font-black text-navy-900 tracking-tight">Payment History</h3>
        <button className="text-xs font-black text-navy-900 uppercase bg-gray-50 px-4 py-2 rounded-xl">Settled Transactions</button>
      </div>
      <div className="divide-y divide-gray-50">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-8 flex items-center justify-between hover:bg-gray-50/30 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center font-black">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-navy-900">Agency Settlement #{8000 + i}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Processed via Stripe • 12 Oct 2023</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-navy-900 font-mono">+$2,450.00</div>
              <div className="text-[10px] font-black text-green-600 uppercase">Successful</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="Financial Operations" subtitle="Manage hospital revenue, billing, and settlements" />

      <main className="p-8 space-y-8 max-w-[1600px] mx-auto text-navy-900">
        <AnimatePresence mode="wait">
          {currentView === 'invoices' && (
            <motion.div key="invoices" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <InvoicesView />
            </motion.div>
          )}
          {currentView === 'payments' && (
            <motion.div key="payments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PaymentsView />
            </motion.div>
          )}
          {(currentView === 'overview' || !['invoices', 'payments'].includes(currentView)) && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Overview />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
