'use client';
import { useState, useEffect, useMemo } from 'react';
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
  Crown,
  Zap,
  Sparkles,
  Globe,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/api/api';

// --- MATH UTILITIES ---
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
};

// Spline Utility (Bézier Implementation)
const getBezierPath = (data, maxValue) => {
  if (data.length < 2) return '';
  const height = 100;
  const width = 100;
  const xStep = width / (data.length - 1);
  const points = data.map((p, i) => ({ x: i * xStep, y: height - ((p.total / maxValue) * height) }));
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    d += ` C ${cp1x} ${curr.y}, ${cp1x} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
};

const getAreaPath = (data, maxValue) => {
  if (data.length < 2) return '';
  return `${getBezierPath(data, maxValue)} L 100 100 L 0 100 Z`;
};

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState({
    revenueByMonth: [],
    clientAcquisition: [],
    planPerformance: [],
    revenueByService: [],
    topPerformingClients: [],
    kpiSummary: { totalOrganizations: 0, totalPatients: 0, totalLifetimeValue: 0, activeSubscriptions: 0 }
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

  const { maxRevenue, maxClients, donutTotal } = useMemo(() => ({
    maxRevenue: Math.max(...reportsData.revenueByMonth.map(r => r.total), 1),
    maxClients: Math.max(...reportsData.clientAcquisition.map(r => r.count), 1),
    donutTotal: reportsData.revenueByService.reduce((acc, curr) => acc + curr.value, 0) || 1
  }), [reportsData]);

  const kpiCards = [
    { label: 'Network Clusters', value: reportsData.kpiSummary.totalOrganizations, icon: Building2, accent: 'indigo' },
    { label: 'Patient Base', value: reportsData.kpiSummary.totalPatients.toLocaleString(), icon: Users, accent: 'blue' },
    { label: 'Service Cycles', value: reportsData.kpiSummary.activeSubscriptions, icon: Activity, accent: 'lime' },
    { label: 'Capital Ledger', value: reportsData.kpiSummary.totalLifetimeValue.toLocaleString(), icon: CreditCard, accent: 'emerald', suffix: '$' }
  ];

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Strategic Intelligence" subtitle="High-authority operational audit and system vitality metrics" />
      
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-12 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[500px]">
             <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-8" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronizing Archives...</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {kpiCards.map((card, idx) => (
                <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-8 group hover:translate-y-[-4px] transition-all relative overflow-hidden"
                >
                  <div className={`absolute -right-4 -bottom-4 w-20 h-20 bg-${card.accent}-500 blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-14 h-14 bg-white/50 shadow-xl rounded-2xl flex items-center justify-center border border-white group-hover:bg-${card.accent}-500 group-hover:text-white transition-all`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{card.label}</p>
                      <h3 className="text-3xl font-black text-navy-900 tracking-tighter">
                        {card.suffix || ''}{card.value}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Primary Chart: Revenue Bézier Spline */}
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-8 glass-panel p-10 min-h-[500px] relative overflow-hidden border border-white/40"
              >
                <div className="flex justify-between items-start mb-14 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-navy-900 flex items-center justify-center shadow-2xl">
                      <TrendingUp className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-navy-900 tracking-tight">Revenue Trajectory</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Authorized Capital Review</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/50 border border-white px-5 py-2.5 rounded-2xl shadow-sm">
                     <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                     <span className="text-[10px] font-black text-navy-900 uppercase tracking-widest">Master Ledger Active</span>
                  </div>
                </div>

                <div className="relative h-[300px] w-full group">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="eliteRevGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#82C341" stopOpacity="0.4" />
                        <stop offset="80%" stopColor="#82C341" stopOpacity="0" />
                      </linearGradient>
                      <filter id="orbGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
                      </filter>
                    </defs>
                    <motion.path 
                      initial={{ opacity: 0, pathLength: 0 }} animate={{ opacity: 1, pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
                      d={getAreaPath(reportsData.revenueByMonth, maxRevenue)} 
                      fill="url(#eliteRevGrad)" 
                    />
                    <motion.path 
                      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
                      d={getBezierPath(reportsData.revenueByMonth, maxRevenue)} 
                      fill="none" stroke="#82C341" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      className="drop-shadow-[0_10px_15px_rgba(130,195,65,0.4)]"
                    />
                    {reportsData.revenueByMonth.map((p, i) => {
                       const x = i * (100 / (reportsData.revenueByMonth.length - 1));
                       const y = 100 - ((p.total / maxRevenue) * 100);
                       return (
                         <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + i * 0.1 }}>
                           <circle cx={x} cy={y} r="3" fill="#82C341" opacity="0.3" filter="url(#orbGlow)" />
                           <circle cx={x} cy={y} r="1.5" fill="white" stroke="#82C341" strokeWidth="0.8" />
                         </motion.g>
                       );
                    })}
                  </svg>
                  <div className="absolute bottom-[-45px] w-full flex justify-between px-1">
                    {reportsData.revenueByMonth.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{item.month.split(' ')[0]}</span>
                         <div className="w-1 h-1 bg-slate-100 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Service Mix: Saturated Donut Chart Upgrade */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="lg:col-span-4 glass-panel p-10 overflow-hidden relative group flex flex-col items-center"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-full flex items-center gap-5 mb-14">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                    <PieChartIcon className="w-7 h-7 text-indigo-600 relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-navy-900 tracking-tight">Service Mix</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Cluster Distribution</p>
                  </div>
                </div>

                <div className="relative w-full aspect-square max-w-[240px] flex items-center justify-center mb-10">
                   <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                      {reportsData.revenueByService.reduce((acc, curr, idx) => {
                        const percent = (curr.value / donutTotal) * 100;
                        const startAngle = acc.currentAngle;
                        const endAngle = acc.currentAngle + (percent * 3.6);
                        acc.segments.push(
                          <motion.path key={curr.name} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: idx * 0.2 }}
                            d={describeArc(50, 50, 42, startAngle, endAngle)}
                            fill="none" strokeWidth="12" strokeLinecap="round"
                            style={{ stroke: `hsl(${220 + idx * 25}, 70%, 55%)` }}
                            className="drop-shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:stroke-indigo-400 transition-colors"
                          />
                        );
                        acc.currentAngle = endAngle;
                        return acc;
                      }, { segments: [], currentAngle: 0 }).segments}
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Total Impact</p>
                      <h4 className="text-3xl font-black text-navy-900 tracking-tighter">${(donutTotal/1000).toFixed(1)}K</h4>
                   </div>
                </div>

                <div className="w-full space-y-4">
                  {reportsData.revenueByService.map((service, idx) => (
                    <div key={service.name} className="flex justify-between items-center group/item hover:bg-slate-50 p-2 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm" style={{ backgroundColor: `hsl(${220 + idx * 25}, 70%, 55%)` }} />
                         <span className="text-[11px] font-black text-navy-900 uppercase tracking-widest">{service.name}</span>
                      </div>
                      <span className="text-xs font-black text-indigo-600 tracking-tighter">{Math.round((service.value / donutTotal) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Client Acquisition: Glass Pillars Upgrade */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="lg:col-span-8 glass-panel p-10 min-h-[400px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-14">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm relative">
                      <Activity className="w-7 h-7 text-blue-600 relative z-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-navy-900 tracking-tight">Onboarding Trajectory</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Strategic Scale Audit</p>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-100 flex items-center gap-3">
                     <Globe className="w-4 h-4 text-blue-600 animate-spin-slow" />
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Global Sync</span>
                  </div>
                </div>

                <div className="flex-1 flex items-end gap-10 px-4">
                   {reportsData.clientAcquisition.map((item, idx) => {
                     const heightPercent = (item.count / maxClients) * 100;
                     return (
                       <div key={idx} className="flex-1 flex flex-col items-center gap-6 h-full justify-end group">
                          <div className="relative w-full max-w-[60px] h-full flex items-end">
                             {/* Glass Container Background */}
                             <div className="absolute inset-0 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] opacity-40" />
                             
                             {/* Neon Pillar Fill */}
                             <motion.div initial={{ height: 0 }} animate={{ height: `${heightPercent}%` }} transition={{ type: 'spring', damping: 15, stiffness: 100, delay: idx * 0.1 }}
                               className="relative w-full bg-gradient-to-t from-blue-600 via-blue-500 to-accent rounded-[1.5rem] shadow-[0_15px_30px_rgba(37,99,235,0.4)] group-hover:brightness-110 transition-all flex justify-center pt-2"
                             >
                                {/* Top-cap Glow Orb */}
                                <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] animate-pulse" />
                             </motion.div>

                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 p-2 bg-navy-900 text-white rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all shadow-2xl">
                                +{item.count}
                             </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{item.month.split(' ')[0]}</span>
                       </div>
                     );
                   })}
                </div>
              </motion.div>

              {/* Leaders Dashboard Card */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="lg:col-span-4 glass-panel p-10 border border-white/50"
              >
                <div className="flex items-center gap-5 mb-14">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                    <Crown className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-navy-900 tracking-tight">System Leaders</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Authority Benchmarks</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {reportsData.topPerformingClients.map((client, idx) => (
                    <motion.div key={client.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-amber-200 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                         <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-amber-600 text-sm shadow-sm">
                           0{idx+1}
                         </div>
                         <span className="text-[11px] font-black text-navy-900 uppercase tracking-widest">{client.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-xl font-black text-navy-900 tracking-tighter">{client.count}</span>
                         <Sparkles className="w-4 h-4 text-amber-400 animate-float" />
                      </div>
                    </motion.div>
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
