'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Loader2, 
  Activity, 
  CreditCard, 
  Building2, 
  ArrowUpRight,
  PieChart as PieChartIcon,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/api/api';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState({
    revenueByMonth: [],
    clientAcquisition: [],
    planPerformance: [],
    revenueByService: [],
    topPerformingClients: [],
    kpiSummary: {
      totalOrganizations: 0,
      totalPatients: 0,
      totalLifetimeValue: 0,
      activeSubscriptions: 0
    }
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
    const width = 100;
    const height = 100;
    const xStep = width / Math.max(data.length - 1, 1);
    
    return data.map((point, index) => {
      const x = index * xStep;
      const y = height - ((point.total / maxValue) * height); 
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const generateAreaChartPath = (data, maxValue) => {
    if (data.length === 0) return '';
    const linePath = generateLineChartPath(data, maxValue);
    return `${linePath} L 100 100 L 0 100 Z`;
  };

  const kpiCards = [
    { 
      label: 'Total Organizations', 
      value: reportsData.kpiSummary.totalOrganizations, 
      icon: Building2, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      suffix: ''
    },
    { 
      label: 'Total Patients', 
      value: reportsData.kpiSummary.totalPatients.toLocaleString(), 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      suffix: ''
    },
    { 
      label: 'Active Subscriptions', 
      value: reportsData.kpiSummary.activeSubscriptions, 
      icon: Activity, 
      color: 'text-lime-600', 
      bg: 'bg-lime-50',
      suffix: ''
    },
    { 
      label: 'Lifetime Value', 
      value: reportsData.kpiSummary.totalLifetimeValue.toLocaleString(), 
      icon: CreditCard, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      suffix: '$'
    }
  ];

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader 
        title="Intelligence Hub" 
        subtitle="Advanced reporting and multi-tenant performance analytics" 
      />
      
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-lime-600" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">Aggregating Intelligence...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* KPI Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiCards.map((card, idx) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6 group hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${card.bg} ${card.color} p-3 rounded-2xl`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
                      <h3 className="text-2xl font-black text-navy-900 tracking-tighter mt-1">
                        {card.suffix}{card.value}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Primary Chart: Revenue Trend */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-8 glass-panel p-8 min-h-[450px] relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-lime-50 flex items-center justify-center border border-lime-100">
                      <TrendingUp className="w-6 h-6 text-lime-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-navy-900 tracking-tight">Revenue Trajectory</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Rolling 6-Month Paid Income</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Live Data
                  </div>
                </div>

                <div className="relative h-[280px] w-full mt-4">
                  {reportsData.revenueByMonth.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-bold uppercase">No data found</div>
                  ) : (
                    <>
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="mainRevGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d={generateAreaChartPath(reportsData.revenueByMonth, maxRevenue)} 
                          fill="url(#mainRevGrad)" 
                          className="transition-all duration-1000"
                        />
                        <path 
                          d={generateLineChartPath(reportsData.revenueByMonth, maxRevenue)} 
                          fill="none" 
                          stroke="#65a30d" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        {reportsData.revenueByMonth.map((p, i) => {
                           const x = i * (100 / (reportsData.revenueByMonth.length - 1));
                           const y = 100 - ((p.total / maxRevenue) * 100);
                           return (
                             <circle key={i} cx={x} cy={y} r="1.5" fill="white" stroke="#3f6212" strokeWidth="1" />
                           );
                        })}
                      </svg>
                      {/* X-Axis Labels */}
                      <div className="absolute bottom-[-30px] w-full flex justify-between px-0.5">
                        {reportsData.revenueByMonth.map((item, idx) => (
                          <span key={idx} className="text-[9px] font-black text-gray-400 uppercase tracking-tight">
                            {item.month.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Service Mix: Donut Chart Concept */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-4 glass-panel p-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                    <PieChartIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-navy-900 tracking-tight">Service Mix</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Revenue Distribution</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {reportsData.revenueByService.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 text-[10px] font-black uppercase">No distribution available</div>
                  ) : reportsData.revenueByService.map((service, idx) => {
                    const totalRev = reportsData.revenueByService.reduce((acc, curr) => acc + curr.value, 0);
                    const percent = Math.round((service.value / (totalRev || 1)) * 100);
                    return (
                      <div key={service.name} className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-navy-900">{service.name}</span>
                          <span className="font-black text-indigo-600">{percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-300" 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Bottom Row: Growth and Leaders */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-6 glass-panel p-8"
              >
                 <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-navy-900 tracking-tight">Client Growth</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">New Account Onboarding</p>
                  </div>
                </div>
                <div className="h-[250px] flex items-end justify-between gap-4 pt-10">
                   {reportsData.clientAcquisition.map((item, idx) => (
                     <div key={idx} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                        <div className="w-full max-w-[40px] bg-blue-600/10 rounded-t-xl relative h-full flex items-end overflow-hidden">
                           <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: `${(item.count / maxClients) * 100}%` }}
                             className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl"
                           />
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.month.split(' ')[0]}</span>
                     </div>
                   ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-6 glass-panel p-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                    <Crown className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-navy-900 tracking-tight">Top Performing Clients</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">By Patient Volume</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {reportsData.topPerformingClients.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 font-bold uppercase text-[10px]">No volume data</p>
                  ) : reportsData.topPerformingClients.map((client, idx) => (
                    <div key={client.name} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-amber-100 hover:bg-white transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-black text-gray-300 text-xs shadow-sm group-hover:text-amber-600 transition-colors">
                          {idx + 1}
                        </div>
                        <span className="font-bold text-navy-900">{client.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-navy-900">{client.count}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">Patients</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
