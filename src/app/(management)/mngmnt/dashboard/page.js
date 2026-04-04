'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Activity, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ArrowUpRight,
  TrendingUp,
  Briefcase,
  Clock,
  UserPlus,
  FileText,
  Zap,
  Shield,
  ArrowRight,
  Target
} from 'lucide-react';
import Link from 'next/link';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

// Elite Spline Utility
const getBezierPath = (points, height = 40) => {
  if (points.length < 2) return '';
  const xStep = 100 / (points.length - 1);
  const maxVal = Math.max(...points, 1);
  
  const pts = points.map((p, i) => ({
    x: i * xStep,
    y: height - ((p / maxVal) * height)
  }));

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    d += ` C ${cp1x} ${curr.y}, ${cp1x} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalPatients: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    pendingBookings: 0,
    unpaidInvoicesCount: 0,
    unpaidInvoicesValue: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/analytics/admin');
        const { stats: newStats, recentActivity: newRecentActivity } = res.data;
        setStats(newStats);
        setRecentActivity(newRecentActivity || []);
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const displayStats = [
    { name: 'Patient Network', value: stats.totalPatients.toLocaleString(), icon: Users, accent: 'indigo', link: '/mngmnt/patients' },
    { name: 'Monthly Velocity', value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: TrendingUp, accent: 'lime', link: '/mngmnt/payments' },
    { name: 'Partner Clusters', value: stats.totalOrganizations.toString(), icon: Building2, accent: 'purple', link: '/mngmnt/clients' },
    { name: 'Pending Settlements', value: `$${stats.unpaidInvoicesValue.toLocaleString()}`, icon: CreditCard, accent: 'orange', link: '/mngmnt/invoices' },
    { name: 'Active Tiers', value: stats.activeSubscriptions.toString(), icon: Briefcase, accent: 'blue', link: '/mngmnt/subscriptions' },
    { name: 'Op. Queue', value: stats.pendingBookings.toString(), icon: Calendar, accent: 'rose', link: '/mngmnt/support' },
  ];

  return (
    <div className="flex-1 bg-transparent min-h-screen pb-20">
      <DashboardHeader title="Master Control Hub" subtitle="Authorized systems command and cross-tenant intelligence" />

      <main className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto">
        
        {/* Elite Command Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel-dark bg-navy-900 p-12 relative overflow-hidden group rounded-[3rem] border border-white/5"
        >
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-accent mix-blend-screen filter blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-lime-400 mix-blend-screen filter blur-[120px] animate-float-slow" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-10">
              <div className="w-28 h-28 flex-shrink-0 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-3xl">
                <Shield className="w-14 h-14 text-accent drop-shadow-[0_0_15px_rgba(130,195,65,0.6)]" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Authorized Command Active</span>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">Tactical Master Center</h2>
                <div className="flex gap-4">
                   <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      Sovereignty: 100% Secure
                   </div>
                   <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      Clusters: Latency 8ms
                   </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 shrink-0">
               <Link href="/mngmnt/reports" className="px-10 py-5 bg-accent text-navy-900 font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-white transition-all shadow-2xl flex items-center gap-3">
                 <Target className="w-4 h-4" /> Deploy Analytics
               </Link>
            </div>
          </div>
        </motion.div>

        {/* Elite KPI Grid with Hover Splines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
           {displayStats.map((stat, idx) => (
             <motion.div key={stat.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
               <Link href={stat.link}>
                 <div className="glass-panel p-8 h-full flex flex-col justify-between hover:translate-y-[-6px] transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-5 h-5 text-accent" />
                    </div>
                    <div className="space-y-6">
                       <div className={`w-12 h-12 bg-${stat.accent}-500/10 rounded-xl flex items-center justify-center text-${stat.accent}-600 group-hover:bg-${stat.accent}-500 group-hover:text-white transition-all duration-500`}>
                          <stat.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1.5">{stat.name}</p>
                          <h3 className="text-3xl font-black text-navy-900 tracking-tighter leading-none">{stat.value}</h3>
                       </div>
                    </div>
                 </div>
               </Link>
             </motion.div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Operations Stream */}
          <section className="lg:col-span-8 space-y-10">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center border border-slate-100">
                      <Activity className="w-6 h-6 text-accent" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-navy-900 tracking-tight">Infrastructure Flux</h2>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Real-time Cluster Events</p>
                   </div>
                </div>
             </div>

             <div className="glass-panel overflow-hidden rounded-[2.5rem]">
                <div className="divide-y divide-slate-50/50">
                   {loading ? (
                      <div className="py-24 text-center">
                        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Access Required...</p>
                      </div>
                   ) : recentActivity.length === 0 ? (
                      <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">Zero Event Traffic</div>
                   ) : recentActivity.map((activity, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-default"
                      >
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
                               {activity.type === 'booking' ? <Calendar className="w-6 h-6 text-indigo-500" /> : <Users className="w-6 h-6 text-blue-500" />}
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-navy-900 group-hover:text-accent transition-colors truncate mb-1">{activity.organization_name}</h4>
                               <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{activity.description}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(activity.reference_date).toLocaleDateString()}</span>
                               </div>
                            </div>
                         </div>
                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                           ['confirmed', 'paid', 'active'].includes(activity.status) ? 'bg-lime-50 text-accent border-accent/20' : 
                           'bg-slate-50 text-slate-400 border-slate-100'
                         }`}>
                            {activity.status || activity.type}
                         </span>
                      </motion.div>
                   ))}
                </div>
             </div>
          </section>

          {/* Pulse Check with Elite Sparklines */}
          <section className="lg:col-span-4 space-y-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center border border-slate-100">
                   <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-navy-900 tracking-tight">Pulse Check</h2>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Network Vitality Hub</p>
                </div>
             </div>

             <div className="space-y-6">
                <div className="glass-panel-dark bg-navy-900 p-10 rounded-[3rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                      <TrendingUp className="w-16 h-16 text-accent group-hover:rotate-12 transition-transform duration-500" />
                   </div>
                   <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em] mb-4">Capital Collection</h4>
                   <div className="flex items-baseline gap-4 mb-8">
                      <span className="text-4xl font-black text-accent tracking-tighter">
                        {Math.round((stats.monthlyRevenue / (stats.monthlyRevenue + stats.unpaidInvoicesValue || 1)) * 100)}%
                      </span>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Efficiency Benchmark</span>
                   </div>
                   
                   {/* Elite Spline Sparkline */}
                   <svg viewBox="0 0 100 40" className="w-full h-12 overflow-visible">
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }} 
                        animate={{ pathLength: 1, opacity: 1 }} 
                        transition={{ duration: 2 }}
                        d={getBezierPath([20, 35, 25, 45, 30, 50, 40], 40)}
                        fill="none" stroke="#82C341" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_rgba(130,195,65,0.8)]"
                      />
                   </svg>

                   <div className="w-full bg-white/5 rounded-full h-1.5 mt-10 overflow-hidden">
                      <motion.div initial={{ width: 0 }} 
                        animate={{ width: `${(stats.monthlyRevenue / (stats.monthlyRevenue + stats.unpaidInvoicesValue || 1)) * 100}%` }}
                        className="bg-accent h-full shadow-[0_0_15px_rgba(130,195,65,1)]"
                      />
                   </div>
                </div>

                <div className="glass-panel p-10 rounded-[3rem] border border-slate-100 hover:border-accent/20 transition-all group">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-4">Scalability Node</h4>
                   <div className="flex items-baseline gap-4 mb-8">
                      <span className="text-4xl font-black text-navy-900 tracking-tighter">{stats.totalPatients}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Records Base</span>
                   </div>
                   
                   <svg viewBox="0 0 100 40" className="w-full h-12 overflow-visible">
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }} 
                        animate={{ pathLength: 1, opacity: 1 }} 
                        transition={{ duration: 2, delay: 0.5 }}
                        d={getBezierPath([10, 25, 15, 35, 40, 30, 45], 40)}
                        fill="none" stroke="#82C341" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        className="opacity-20 translate-y-1"
                      />
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }} 
                        animate={{ pathLength: 1, opacity: 1 }} 
                        transition={{ duration: 2, delay: 0.3 }}
                        d={getBezierPath([10, 25, 15, 35, 40, 30, 45], 40)}
                        fill="none" stroke="#82C341" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_rgba(130,195,65,0.4)]"
                      />
                   </svg>

                   <div className="mt-12 grid grid-cols-2 gap-6">
                      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-accent/5 transition-all text-center">
                         <p className="text-2xl font-black text-navy-900 tracking-tighter">{Math.round(stats.totalPatients / (stats.totalOrganizations || 1))}</p>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Avg Record/Cluster</p>
                      </div>
                      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-accent/5 transition-all text-center">
                         <p className="text-2xl font-black text-navy-900 tracking-tighter">{stats.activeSubscriptions}</p>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Managed Tiers</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}
