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
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

const containerFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const itemPop = {
  initial: { opacity: 0, scale: 0.95, y: 15 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
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
    { 
      name: 'Network Reach', value: stats.totalPatients.toLocaleString(), sub: 'Global Records',
      icon: Users, accent: 'indigo', description: 'Patient records across all nodes',
      link: '/mngmnt/patients'
    },
    { 
      name: 'Gross Capital', value: `$${stats.monthlyRevenue.toLocaleString()}`, sub: 'Monthly Cycle',
      icon: TrendingUp, accent: 'lime', description: 'Settled revenue this period',
      link: '/mngmnt/payments'
    },
    { 
      name: 'Enterprise Base', value: stats.totalOrganizations.toString(), sub: 'Partnerships',
      icon: Building2, accent: 'purple', description: 'Active client organizations',
      link: '/mngmnt/clients'
    },
    { 
      name: 'Fiscal Exposure', value: `$${stats.unpaidInvoicesValue.toLocaleString()}`, sub: 'Unsettled Ledger',
      icon: CreditCard, accent: 'orange', description: `${stats.unpaidInvoicesCount} invoices pending payment`,
      link: '/mngmnt/invoices'
    },
    { 
      name: 'Active Tiers', value: stats.activeSubscriptions.toString(), sub: 'Recurring Value',
      icon: Briefcase, accent: 'blue', description: 'Paid deployment packages',
      link: '/mngmnt/subscriptions'
    },
    { 
      name: 'Clinical Flow', value: stats.pendingBookings.toString(), sub: 'Op. Queue',
      icon: Calendar, accent: 'rose', description: 'Coordination items awaiting action',
      link: '/mngmnt/support'
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking': return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'invoice': return <FileText className="w-5 h-5 text-lime-600" />;
      case 'patient': return <Users className="w-5 h-5 text-blue-600" />;
      case 'organization': return <Building2 className="w-5 h-5 text-purple-600" />;
      default: return <Activity className="w-5 h-5 text-navy-900" />;
    }
  };

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Operational Hub" subtitle="Real-time Platform Intelligence" />

      <main className="p-4 md:p-8 space-y-10 max-w-[1600px] mx-auto pb-16">
        
        {/* ── Elite Command Hero ── */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-dark bg-navy-900 p-10 sm:p-14 relative overflow-hidden group min-h-[320px] flex items-center rounded-[3rem]"
        >
          {/* Elite Mesh Gradient Layering */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-accent mix-blend-screen filter blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-lime-400 mix-blend-screen filter blur-[100px] animate-float-slow" />
            <div className="absolute top-[30%] right-[15%] w-[40%] h-[40%] rounded-full bg-indigo-500 mix-blend-overlay filter blur-[90px] animate-bounce-soft" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center w-full gap-10">
            <div className="flex items-center gap-10 text-center lg:text-left flex-col lg:flex-row">
              <div className="w-32 h-32 flex-shrink-0 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform group-hover:shadow-[0_0_50px_rgba(130,195,65,0.3)]">
                <Shield className="w-16 h-16 text-accent" />
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                   <span className="px-4 py-1.5 bg-accent/20 text-accent font-black text-[10px] uppercase tracking-[0.3em] rounded-full border border-accent/30 flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" /> SYS. COMMAND ACTIVE
                   </span>
                   <span className="px-4 py-1.5 bg-white/10 text-white/70 font-black text-[10px] uppercase tracking-[0.2em] rounded-full border border-white/20">
                    NETWORK STABLE: 99.8%
                   </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">Platform Master Control</h2>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl">
                    <Activity className="w-4 h-4 text-accent" />
                    <span className="text-sm font-bold text-white/70 uppercase tracking-widest">{stats.totalOrganizations} Partner Clusters</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl">
                    <Users className="w-4 h-4 text-lime-400" />
                    <span className="text-sm font-bold text-white/70 uppercase tracking-widest">{stats.totalPatients} Active Records</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                 className="px-8 py-5 bg-accent text-navy-900 font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3">
                 <Zap className="w-4 h-4" /> Deploy Analytics
               </motion.button>
               <Link href="/mngmnt/reports" className="px-8 py-5 bg-white/10 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] border border-white/20 hover:bg-white/20 transition-all text-center">
                 Review Intelligence
               </Link>
            </div>
          </div>
        </motion.div>

        {/* ── High-Saturation KPI Grid ── */}
        <motion.section variants={containerFade} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-6 md:gap-8">
           {displayStats.map((stat, idx) => (
             <motion.div key={stat.name} variants={itemPop} className="group cursor-pointer">
               <Link href={stat.link}>
                 <div className="glass-panel p-8 h-full flex flex-col justify-between hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden rounded-[2.5rem] border border-transparent hover:border-accent/10">
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-0 group-hover:opacity-20 transition-opacity bg-${stat.accent}-500 blur-3xl rounded-full`} />
                    <div className="space-y-6">
                       <div className={`w-14 h-14 bg-${stat.accent}-50 border border-${stat.accent}-100 rounded-2xl flex items-center justify-center group-hover:bg-${stat.accent}-500 group-hover:text-white transition-all duration-500`}>
                          <stat.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1.5">{stat.name}</p>
                          <h3 className="text-3xl font-black text-navy-900 tracking-tighter leading-none">{stat.value}</h3>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.sub}</p>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-[9px] font-black uppercase text-accent/80 tracking-widest">{stat.accent} Node</span>
                       <ArrowUpRight className="w-3 h-3 text-slate-200 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                 </div>
               </Link>
             </motion.div>
           ))}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Operations Stream (Recent Activity) */}
          <motion.section variants={itemPop} initial="initial" animate="animate" className="lg:col-span-8 space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center border border-slate-50">
                      <Clock className="w-6 h-6 text-accent" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-navy-900 tracking-tight">Operations Stream</h2>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Real-time Platform Logistics</p>
                   </div>
                </div>
                <Link href="/mngmnt/support" className="p-3 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 transition-all text-slate-400 hover:text-accent group">
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>

             <div className="glass-panel overflow-hidden rounded-[2.5rem] border border-slate-100">
                <div className="divide-y divide-slate-50/50">
                   {loading ? (
                      <div className="py-24 text-center">
                        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synching Global Nodes</p>
                      </div>
                   ) : recentActivity.length === 0 ? (
                      <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Zero Operational Events</div>
                   ) : recentActivity.map((activity, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-6 flex items-center justify-between group hover:bg-slate-50/30 transition-all cursor-default"
                      >
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                               {getActivityIcon(activity.type)}
                            </div>
                            <div className="min-w-0">
                               <h4 className="text-sm font-black text-navy-900 group-hover:text-accent transition-colors truncate mb-1">{activity.organization_name}</h4>
                               <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{activity.description}</span>
                                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(activity.reference_date).toLocaleDateString()}</span>
                               </div>
                            </div>
                         </div>
                         <div className="hidden sm:flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                              ['confirmed', 'paid', 'active'].includes(activity.status) ? 'bg-lime-50 text-accent border-accent/20' : 
                              activity.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                              'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                               {activity.status || activity.type}
                            </span>
                         </div>
                      </motion.div>
                   ))}
                </div>
                <button className="w-full py-5 bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-navy-900 hover:bg-white transition-all border-t border-slate-100">
                   Load Operational Archive
                </button>
             </div>
          </motion.section>

          {/* Pulse Check (Health Metrics) */}
          <motion.section variants={itemPop} initial="initial" animate="animate" className="lg:col-span-4 space-y-8">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center border border-slate-50">
                   <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-navy-900 tracking-tight">Pulse Check</h2>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Network Vitality Hub</p>
                </div>
             </div>

             <div className="space-y-6">
                <div className="glass-panel-dark bg-navy-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform">
                      <TrendingUp className="w-12 h-12 text-accent" />
                   </div>
                   <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] mb-3">Capital Collection</h4>
                   <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black text-accent tracking-tighter">
                        {Math.round((stats.monthlyRevenue / (stats.monthlyRevenue + stats.unpaidInvoicesValue || 1)) * 100)}%
                      </span>
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Efficiency</span>
                   </div>
                   <div className="w-full bg-white/5 rounded-full h-2 mt-6 overflow-hidden">
                      <motion.div initial={{ width: 0 }} 
                        animate={{ width: `${(stats.monthlyRevenue / (stats.monthlyRevenue + stats.unpaidInvoicesValue || 1)) * 100}%` }}
                        className="bg-accent h-full shadow-[0_0_15px_rgba(130,195,65,1)]"
                      />
                   </div>
                   <p className="text-[9px] font-bold text-white/30 mt-6 leading-relaxed uppercase tracking-widest">System stabilized on settled capital.</p>
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-100 hover:border-accent/20 transition-colors group">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-3">B2B Scalability</h4>
                   <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black text-navy-900 tracking-tighter">{stats.totalPatients}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Records</span>
                   </div>
                   <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-accent/5 transition-colors text-center">
                         <p className="text-xl font-black text-navy-900">{Math.round(stats.totalPatients / (stats.totalOrganizations || 1))}</p>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Avg Patient/Client</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-accent/5 transition-colors text-center">
                         <p className="text-xl font-black text-navy-900">{stats.activeSubscriptions}</p>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Managed Nodes</p>
                      </div>
                   </div>
                </div>
             </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
