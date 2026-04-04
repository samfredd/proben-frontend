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

  // SVG Line Chart Generation for Revenue
  const generateLineChartPath = (data, maxValue) => {
    if (data.length === 0) return '';
    const width = 100; // viewbox percentage
    const height = 100; // viewbox percentage
    const xStep = width / Math.max(data.length - 1, 1);
    
    return data.map((point, index) => {
      const x = index * xStep;
      // y is inverted because SVG y-axis starts from top
      const y = height - ((point.total / maxValue) * height); 
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate smooth area path
  const generateAreaChartPath = (data, maxValue) => {
    if (data.length === 0) return '';
    const linePath = generateLineChartPath(data, maxValue);
    return `${linePath} L 100 100 L 0 100 Z`;
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Revenue By Month - SVG Line Chart */}
            <div className="glass-panel p-8 flex flex-col min-h-[400px] animate-breathe relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-lime-50 flex items-center justify-center border border-lime-100/50 shadow-sm">
                  <TrendingUp className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-navy-900 tracking-tight">Revenue Trend</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Last 6 Months</p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col relative w-full h-[200px]">
                {reportsData.revenueByMonth.length === 0 ? (
                  <p className="text-sm font-medium text-gray-400 m-auto">No revenue data available.</p>
                ) : (
                  <>
                    <div className="absolute inset-0 w-full h-full pt-4 pb-8">
                      <svg viewBox="0 -5 100 110" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#84cc16" stopOpacity="0.01" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        
                        {/* Grid lines */}
                        <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2" />
                        <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2" />
                        <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2" />

                        {/* Area */}
                        <path 
                          d={generateAreaChartPath(reportsData.revenueByMonth, maxRevenue)} 
                          fill="url(#revenueGradient)" 
                        />
                        {/* Line */}
                        <path 
                          d={generateLineChartPath(reportsData.revenueByMonth, maxRevenue)} 
                          fill="none" 
                          stroke="#65a30d" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          filter="url(#glow)"
                        />
                        {/* Points */}
                        {reportsData.revenueByMonth.map((point, idx) => {
                          const xStep = 100 / Math.max(reportsData.revenueByMonth.length - 1, 1);
                          const cx = idx * xStep;
                          const cy = 100 - ((point.total / maxRevenue) * 100);
                          return (
                            <g key={idx} className="group">
                              <circle cx={cx} cy={cy} r="2.5" fill="#ffffff" stroke="#4d7c0f" strokeWidth="1.5" className="transition-all duration-300 group-hover:r-[3.5px] cursor-pointer" />
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                    {/* X-Axis Labels */}
                    <div className="absolute bottom-0 w-full flex justify-between px-1">
                      {reportsData.revenueByMonth.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center group cursor-default">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.month.split(' ')[0]}</span>
                          <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black bg-navy-900 text-white px-2 py-1 rounded whitespace-nowrap z-20 shadow-xl pointer-events-none transform -translate-x-1/2 left-1/2">
                            ${item.total.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Client Acquisition - Beautiful Bar Chart */}
            <div className="glass-panel p-8 flex flex-col min-h-[400px] animate-breathe" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100/50 shadow-sm">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-navy-900 tracking-tight">Client Acquisition</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">New Organizations</p>
                </div>
              </div>
              <div className="flex-1 flex items-end gap-3 justify-between pb-6 relative pt-10">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 pt-10 pb-6 flex flex-col justify-between pointer-events-none">
                  <div className="w-full h-px bg-gray-100 border-b border-dashed border-gray-200"></div>
                  <div className="w-full h-px bg-gray-100 border-b border-dashed border-gray-200"></div>
                  <div className="w-full h-px bg-gray-100 border-b border-dashed border-gray-200"></div>
                </div>

                {reportsData.clientAcquisition.length === 0 ? (
                  <p className="text-sm font-medium text-gray-400 m-auto">No client data available.</p>
                ) : reportsData.clientAcquisition.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3 flex-1 group z-10 h-full justify-end">
                    <div className="w-full flex justify-center relative h-full items-end">
                       <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black bg-navy-900 text-white px-2 py-1 rounded shadow-xl pointer-events-none z-20">
                        {item.count} Clients
                      </div>
                      <div 
                        className="w-full max-w-[48px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl transition-all duration-500 group-hover:from-blue-500 group-hover:to-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                        style={{ height: `${(item.count / maxClients) * 100}%`, minHeight: item.count > 0 ? '4px' : '0' }}
                      />
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.month.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Plan Performance - Styled Horizontal Bars */}
            <div className="glass-panel p-8 flex flex-col min-h-[300px] md:col-span-2 animate-breathe" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100/50 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-navy-900 tracking-tight">Plan Performance</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Active Subscriptions By Plan</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-6 max-w-4xl">
                 {reportsData.planPerformance.length === 0 ? (
                    <p className="text-sm font-medium text-gray-400 m-auto">No active plans found.</p>
                 ) : reportsData.planPerformance.map((plan, idx) => {
                    const maxPlanCount = Math.max(...reportsData.planPerformance.map(p => p.count), 1);
                    const percentage = (plan.count / maxPlanCount) * 100;
                    return (
                      <div key={idx} className="space-y-3 group cursor-default">
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-navy-900 tracking-tight">{plan.planName}</span>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{plan.count} active</span>
                        </div>
                        <div className="w-full bg-gray-100/80 rounded-full h-4 overflow-hidden p-0.5">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-full rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden" 
                            style={{ width: `${percentage}%` }}
                          >
                             <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]"></div>
                          </div>
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
