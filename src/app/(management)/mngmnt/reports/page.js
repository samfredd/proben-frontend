'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { TrendingUp, Users, ShieldCheck, Loader2 } from 'lucide-react';
import api from '@/api/api';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState({
    revenueByMonth: [],
    clientAcquisition: [],
    planPerformance: []
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/analytics/reports');
        setReportsData(res.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const maxRevenue = Math.max(...reportsData.revenueByMonth.map(r => r.total), 1);
  const maxClients = Math.max(...reportsData.clientAcquisition.map(r => r.count), 1);

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="System Reports" subtitle="High-level analytics and business metrics" />
      
      <main className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-lime-600" />
            <p className="text-xs font-bold uppercase tracking-widest">Loading Reports...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Revenue By Month */}
            <div className="glass-panel p-8 flex flex-col min-h-[300px] animate-breathe" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-lime-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-navy-900 tracking-tight">Revenue by Month</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 6 Months</p>
                </div>
              </div>
              <div className="flex-1 flex items-end gap-2 justify-between">
                {reportsData.revenueByMonth.length === 0 ? (
                  <p className="text-sm font-medium text-gray-400 m-auto">No revenue data available.</p>
                ) : reportsData.revenueByMonth.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="w-full flex justify-center relative">
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black bg-navy-900 text-white px-2 py-1 rounded">
                        ${item.total.toLocaleString()}
                      </div>
                      <div 
                        className="w-full max-w-[40px] bg-lime-500 rounded-t-md transition-all duration-500 hover:bg-lime-400"
                        style={{ height: `${(item.total / maxRevenue) * 150}px`, minHeight: item.total > 0 ? '4px' : '0' }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{item.month.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Client Acquisition */}
            <div className="glass-panel p-8 flex flex-col min-h-[300px] animate-breathe" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-navy-900 tracking-tight">Client Acquisition</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Organizations</p>
                </div>
              </div>
              <div className="flex-1 flex items-end gap-2 justify-between">
                {reportsData.clientAcquisition.length === 0 ? (
                  <p className="text-sm font-medium text-gray-400 m-auto">No client data available.</p>
                ) : reportsData.clientAcquisition.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="w-full flex justify-center relative">
                       <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black bg-navy-900 text-white px-2 py-1 rounded">
                        {item.count}
                      </div>
                      <div 
                        className="w-full max-w-[40px] bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-400"
                        style={{ height: `${(item.count / maxClients) * 150}px`, minHeight: item.count > 0 ? '4px' : '0' }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{item.month.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Plan Performance */}
            <div className="glass-panel p-8 flex flex-col min-h-[300px] md:col-span-2 animate-breathe" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-navy-900 tracking-tight">Plan Performance</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Subscriptions By Plan</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4">
                 {reportsData.planPerformance.length === 0 ? (
                    <p className="text-sm font-medium text-gray-400 m-auto">No active plans found.</p>
                 ) : reportsData.planPerformance.map((plan, idx) => {
                    const maxPlanCount = Math.max(...reportsData.planPerformance.map(p => p.count), 1);
                    const percentage = (plan.count / maxPlanCount) * 100;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-navy-900">{plan.planName}</span>
                          <span className="text-xs font-black text-gray-400">{plan.count} active</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-purple-500 h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                 })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
