'use client';
import { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/subscriptions');
      setSubs(response.data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const formatDateSafely = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Subscription Management" subtitle="Monitor and manage active recurring agreements" />

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        <div className="glass-panel overflow-hidden animate-breathe">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100/50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Organization</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Active Plan</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Monthly Revenue</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Next Reset</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/30">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Syncing Subscription Data...</p>
                       </div>
                    </td>
                  </tr>
                ) : subs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <p className="text-[10px] font-black (clients) uppercase tracking-[0.2em] text-gray-300">No active recurring subscriptions found</p>
                    </td>
                  </tr>
                ) : subs.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-white/40 transition-all duration-300">
                    <td className="px-8 py-6">
                      <p className="font-black text-navy-900 tracking-tight text-lg">{sub.organization_name || sub.client_name || 'Client'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                           <Activity className="w-5 h-5" />
                        </div>
                        <span className="font-black text-navy-900 tracking-tight">{sub.plan_name || sub.service_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-lg font-black text-navy-900 tracking-tighter">${Number(sub.amount_usd || 0).toLocaleString()}</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">USD</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-300" />
                          <span className="text-sm font-black text-navy-900/60 uppercase tracking-tight">
                            {formatDateSafely(sub.current_period_end || sub.next_billing_date)}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ${
                        sub.status === 'active' 
                          ? 'bg-lime-500 text-white shadow-lime-500/20' 
                          : 'bg-orange-500 text-white shadow-orange-500/20'
                      }`}>
                        {sub.status === 'active' ? 'Active Agreement' : sub.status}
                      </span>
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
