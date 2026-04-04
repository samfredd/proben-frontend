'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, Activity, Plus, CheckCircle, Clock, MoreVertical,
  CreditCard, ArrowUpRight, ChevronRight, Video, MapPin, Star,
  Check, ArrowRight, Zap, Shield, HelpCircle, TrendingUp, Sparkles,
  Award, Mail, Phone
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { getActiveSubscription, getSubscriptionDisplayName, getSubscriptionRenewalDate } from '@/utils/subscriptions';

/* ─── animation variants ─────────────────────────────────────── */
const containerFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemPop = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function ClientDashboard() {
  const router = useRouter();
  const plansPageHref = '/dashboard/subscriptions';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  
  const { user } = useAuth();
  const [myAppointments, setMyAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ─── derived values ──────────────────────────────────────── */
  const patientCount = patients?.length || 0;
  const activeSub = getActiveSubscription(subscriptions);
  const activePlan = getSubscriptionDisplayName(activeSub) || 'Trial Period';
  const activeRenewalDate = getSubscriptionRenewalDate(activeSub);
  const totalInvested = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount_due || 0), 0);
  const pendingBalance = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + Number(i.amount_due || 0), 0);
  const hasPending = pendingBalance > 0;
  const pendingInvoices = invoices.filter(i => i.status === 'pending');

  const stats = [
    {
      name: 'Care Lifecycle', value: patientCount.toString(), sub: 'In Coordination',
      icon: Users, 
      accent: 'indigo',
      description: 'Active Patient Management'
    },
    {
      name: 'Fiscal Health', value: `$${totalInvested.toLocaleString()}`, sub: 'Settled Capital',
      icon: TrendingUp, 
      accent: 'lime',
      description: 'Total Platform Investment'
    },
    {
      name: 'Account Flow', value: `$${pendingBalance.toLocaleString()}`, sub: hasPending ? 'Pending Review' : 'Healthy Balance',
      icon: Activity, 
      accent: hasPending ? 'orange' : 'blue',
      description: 'Current Outstanding Items'
    },
    {
      name: 'Tier Status', value: activePlan, sub: 'B2B Healthcare',
      icon: Award, 
      accent: 'purple',
      description: 'Package Grade'
    },
  ];

  /* ─── data fetching ──────────────────────────────────────── */
  const fetchAll = async () => {
    try {
      const [bRes, iRes, subRes, pRes] = await Promise.allSettled([
        api.get('/bookings'), 
        api.get('/invoices'), 
        api.get('/subscriptions'),
        api.get('/patients')
      ]);
      if (bRes.status === 'fulfilled') setMyAppointments(bRes.value.data.bookings || []);
      if (iRes.status === 'fulfilled') setInvoices(iRes.value.data.invoices || []);
      if (subRes.status === 'fulfilled') setSubscriptions(subRes.value.data || []);
      if (pRes.status === 'fulfilled') setPatients(pRes.value.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openModal = (qa) => { 
    if (qa.href) {
      router.push(qa.href);
      return;
    }
    setActiveModal(qa.id); 
    setIsModalOpen(true); 
  };
  
  const closeModal = () => { setIsModalOpen(false); setActiveModal(null); };

  const recentActivity = [...invoices.map(i => ({
    id: `inv-${i.id}`,
    title: `Invoice ${i.status === 'paid' ? 'Settled' : 'Received'}`,
    description: `$${i.amount_due} — ${i.title || 'Service Billing'}`,
    time: new Date(i.created_at || i.due_date).toLocaleDateString(),
    ts: new Date(i.created_at || i.due_date).getTime(),
    icon: CreditCard,
    type: 'invoice',
    status: i.status
  })), ...myAppointments.map(a => ({
    id: `appt-${a.id}`,
    title: `Clinical Review`,
    description: `Session Status: ${a.status}`,
    time: new Date(a.booking_date).toLocaleDateString(),
    ts: new Date(a.created_at || a.booking_date).getTime(),
    icon: Calendar,
    type: 'booking',
    status: a.status
  }))].sort((a, b) => b.ts - a.ts).slice(0, 5);

  const quickActions = [
    { id: 'register_patient', name: 'New Patient', icon: Plus, bg: 'bg-indigo-600', text: 'text-white', iconColor: 'text-white', href: '/dashboard/patients' },
    { id: 'plans', name: 'Upgrade Plan', icon: Zap, bg: 'bg-lime-500', text: 'text-white', iconColor: 'text-white', href: plansPageHref },
    { id: 'billing', name: 'Billing Portal', icon: CreditCard, bg: 'bg-white', text: 'text-navy-900', iconColor: 'text-navy-900' },
    { id: 'support', name: 'Operational Support', icon: HelpCircle, bg: 'bg-white', text: 'text-navy-900', iconColor: 'text-navy-900' },
  ];

  /* ─── Premium Modal Systems ─────────────────────────────────────── */
  const renderModal = () => {
    switch (activeModal) {
      case 'plans':
        return (
          <div className="space-y-6">
            <div className="glass-panel-dark bg-navy-900 p-8 text-white relative overflow-hidden rounded-[2.5rem]">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/20 animate-float-slow pointer-events-none" />
              <div className="relative z-10">
                <span className="px-3 py-1 bg-accent/20 text-accent text-[9px] font-black uppercase tracking-widest rounded-full border border-accent/30 inline-flex items-center gap-1.5 mb-6">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> TARGET TIER
                </span>
                <h4 className="text-3xl font-black tracking-tight">{activePlan}</h4>
                <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-black">B2B Health Intelligence Package</p>
                
                <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
                  <div className="flex-1">
                    <p className="text-2xl font-black text-accent tracking-tighter">${activeSub ? parseFloat(activeSub.amount_usd).toLocaleString() : 'N/A'}</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-black">Monthly Deployment</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-black tracking-tighter">
                      {activeRenewalDate ? new Date(activeRenewalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                    <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-black">Cycle Renewal</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {['Multi-tenant Coordination', 'Elite Service Level Support', 'Resource Scalability', 'Advanced Compliance Hub'].map(f => (
                <div key={f} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-bold text-navy-900">{f}</span>
                </div>
              ))}
            </div>

            <button onClick={() => router.push(plansPageHref)} className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] shadow-xl hover:bg-navy-900 transition-all">
              Manage Subscriptions
            </button>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {invoices.length === 0 ? (
                <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">No active invoices</div>
              ) : (
                invoices.slice(0, 4).map(inv => (
                  <div key={inv.id} className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between hover:border-indigo-100 group transition-all">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-slate-50 group-hover:bg-indigo-50 border border-slate-100 rounded-2xl flex items-center justify-center transition-colors">
                         <CreditCard className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                       </div>
                       <div>
                          <h4 className="font-black text-navy-900 text-sm">{inv.title || 'Service Invoice'}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Released: {new Date(inv.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-navy-900 tracking-tighter">${parseFloat(inv.amount_due || 0).toLocaleString()}</p>
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${inv.status === 'paid' ? 'bg-lime-50 text-lime-600' : 'bg-orange-50 text-orange-600'}`}>
                         {inv.status}
                       </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] shadow-xl hover:bg-navy-900 transition-all">
               Billing Archive Hub
            </button>
          </div>
        );
      case 'support':
        return (
          <div className="space-y-8">
            <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
               <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center shrink-0">
                  <Shield className="w-10 h-10 text-indigo-600" />
               </div>
               <div className="text-center md:text-left">
                  <h4 className="text-xl font-black text-navy-900">Elite Liaison Support</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">Dedicated coordination for your B2B account.</p>
                  <button className="mt-4 px-6 py-2 bg-navy-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700">Open Terminal</button>
               </div>
            </div>
            <div className="space-y-3">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">System Protocols & FAQ</p>
               {['Deployment Rescheduling', 'Invoicing Reciprocity', 'Team User Provisioning'].map(item => (
                 <button key={item} className="w-full p-5 bg-white border border-slate-50 rounded-2xl flex items-center justify-between hover:border-indigo-100 transition-all group">
                    <span className="text-sm font-bold text-navy-900">{item}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                 </button>
               ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Concierge Command" subtitle={`Welcome back, ${user?.organization_name || 'Partner'}`} />

      <main className="p-4 md:p-8 space-y-10 max-w-[1600px] mx-auto pb-16">

        {/* ── Premium Hero Section ── */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-dark bg-navy-900 p-8 sm:p-12 relative overflow-hidden group min-h-[300px] flex items-center"
        >
          {/* Advanced Multi-layered Mesh Gradient */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent mix-blend-screen filter blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lime-400 mix-blend-screen filter blur-[100px] animate-float-slow" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500 mix-blend-overlay filter blur-[80px] animate-bounce-soft" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center w-full gap-8">
            <div className="flex items-center gap-8 text-center lg:text-left flex-col lg:flex-row">
              <div className="w-28 h-28 flex-shrink-0 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-5xl text-accent shadow-2xl group-hover:scale-105 transition-transform">
                {user?.organization_name?.charAt(0) || 'H'}
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                   <span className="px-4 py-1.5 bg-accent/20 text-accent font-black text-[10px] uppercase tracking-widest rounded-full border border-accent/30 flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" /> PLATFORM PARTNER
                   </span>
                   <span className="px-4 py-1.5 bg-white/10 text-white/70 font-black text-[10px] uppercase tracking-widest rounded-full border border-white/20">
                    ID: {user?.id?.slice(0, 8).toUpperCase()}
                   </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">{user?.organization_name || 'Organization'}</h2>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-sm font-bold text-white/70 uppercase tracking-tight">{user?.country}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                    <Sparkles className="w-4 h-4 text-lime-400" />
                    <span className="text-sm font-bold text-white/70 uppercase tracking-tight">{activePlan}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 shrink-0">
               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push(plansPageHref)}
                 className="px-8 py-4 bg-accent text-navy-900 font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-white transition-all shadow-xl">
                 Upgrade Plan
               </motion.button>
               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openModal({id:'support'})}
                 className="px-8 py-4 bg-white/10 text-white font-black text-sm uppercase tracking-widest rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                 System Help
               </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Premium High-Saturation KPI Grid ── */}
        <motion.div variants={containerFade} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.name} variants={itemPop}
              className={`glass-panel p-8 group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden cursor-default`}
            >
              {/* Highlight dynamic orb */}
              <div className={`absolute -right-4 -bottom-4 w-20 h-20 opacity-10 group-hover:opacity-30 transition-opacity bg-${s.accent}-500 blur-2xl rounded-full`} />
              
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-${s.accent}-500 group-hover:text-white transition-colors border border-slate-100 shadow-sm`}>
                  <s.icon className={`w-6 h-6 transition-transform group-hover:rotate-12 duration-500`} />
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {s.sub}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{s.name}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-3xl font-black text-navy-900 tracking-tighter">{s.value}</h3>
                   {s.name === 'Fiscal Health' && <ArrowUpRight className="w-4 h-4 text-lime-600 mb-1" />}
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 italic">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Care Lifecycle Module */}
          <motion.section variants={itemPop} className="lg:col-span-2 glass-panel p-8 relative overflow-hidden">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center">
                     <Users className="w-6 h-6 text-indigo-600" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-navy-900 tracking-tight">Care Lifecycle</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patient Coordination HUB</p>
                   </div>
                </div>
                <Link href="/dashboard/patients" className="p-3 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 transition-all text-slate-400 hover:text-indigo-600 group">
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>

             <div className="space-y-4">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
                      <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                      Loading Records
                    </div>
                ) : patients.length === 0 ? (
                    <div className="py-16 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Active Records</p>
                      <button onClick={() => router.push('/dashboard/patients')} className="mt-6 px-8 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-indigo-700 transition-colors">
                        Add First Record
                      </button>
                    </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patients.slice(0, 4).map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="p-5 bg-white rounded-[2.5rem] border border-transparent hover:border-indigo-100 hover:shadow-xl transition-all group flex items-center gap-5 cursor-default relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-4 h-4 text-indigo-100" />
                         </div>
                         <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center shrink-0">
                            {p.profile_picture_url ? (
                                <img src={p.profile_picture_url} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl font-black text-indigo-200">{p.first_name[0]}{p.last_name[0]}</span>
                            )}
                         </div>
                         <div className="min-w-0">
                            <h4 className="font-bold text-navy-900 group-hover:text-indigo-600 transition-colors mb-1 truncate">{p.first_name} {p.last_name}</h4>
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                               <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">TYPE {p.blood_type || 'U'}</span>
                               <span>• {p.gender || 'B2B'}</span>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                )}
             </div>
          </motion.section>

          {/* Activity Timeline Stream */}
          <motion.section variants={itemPop} className="glass-panel p-8 h-full flex flex-col">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                   <Activity className="w-6 h-6 text-accent" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-navy-900 tracking-tight">Operations Stream</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Activity</p>
                </div>
             </div>

             <div className="flex-1 space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-slate-100">
                {recentActivity.map((activity, i) => (
                  <div key={activity.id} className="relative pl-14 group">
                     <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl border bg-white flex items-center justify-center z-10 transition-all ${
                       activity.type === 'invoice' ? 'border-lime-100' : 'border-indigo-100'
                     } group-hover:scale-110 shadow-sm`}>
                        <activity.icon className={`w-5 h-5 ${
                          activity.type === 'invoice' ? 'text-lime-600' : 'text-indigo-600'
                        }`} />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-sm font-black text-navy-900 group-hover:text-primary transition-colors">{activity.title}</h4>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 line-clamp-1">{activity.description}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">{activity.time}</p>
                     </div>
                  </div>
                ))}
             </div>
          </motion.section>
        </div>

        {/* ── Visual Quick Jump ── */}
        <section className="space-y-8 pt-4">
           <div className="flex items-center gap-3">
              <span className="w-12 h-[2px] bg-indigo-600 rounded-full" />
              <h3 className="text-xl font-black text-navy-900 tracking-tight uppercase tracking-widest">Direct Access Channels</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((qa, i) => (
                <motion.button key={qa.id}
                   whileHover={{ y: -8 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => openModal(qa)}
                   className={`p-10 rounded-[3rem] ${qa.bg} ${qa.text} flex flex-col items-center justify-center gap-6 text-center transition-all shadow-xl hover:shadow-2xl relative overflow-hidden`}
                >
                   <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="w-16 h-16 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center">
                     <qa.icon className={`w-8 h-8 ${qa.iconColor}`} />
                   </div>
                   <span className="font-black tracking-widest uppercase text-xs">{qa.name}</span>
                </motion.button>
              ))}
           </div>
        </section>

        {/* ── Modal Integration ── */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={quickActions.find(a => a.id === activeModal)?.name || 'System Module Interface'}>
           {renderModal()}
        </Modal>

      </main>
    </div>
  );
}
