'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, Activity, Plus, CheckCircle, Clock, MoreVertical,
  CreditCard, ArrowUpRight, ChevronRight, Video, MapPin, Star,
  Check, ArrowRight, Zap, Shield, HelpCircle, TrendingUp, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { getActiveSubscription, getSubscriptionDisplayName, getSubscriptionRenewalDate } from '@/utils/subscriptions';

/* ─── animation variants ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } }
});

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.08 } }
};

export default function ClientDashboard() {
  const router = useRouter();
  const plansPageHref = '/dashboard/payments';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [agreements, setAgreements] = useState({ tos: false, telemedicine: false, liability: false });

  const { user } = useAuth();
  const [myAppointments, setMyAppointments] = useState([]);
  const [services, setServices] = useState([]);
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
      name: 'Patients Managed', value: patientCount.toString(), sub: 'In Coordination',
      icon: Users, clay: 'clay-card-accent',
      bg: 'bg-accent', iconBg: 'bg-white/20', iconColor: 'text-white',
      textValue: 'text-white', textSub: 'text-white/70', textName: 'text-white/80',
    },
    {
      name: 'Total Invested', value: `$${totalInvested.toLocaleString()}`, sub: 'Settled',
      icon: TrendingUp, clay: 'clay-card',
      bg: 'bg-white', iconBg: 'bg-lime-100', iconColor: 'text-lime-700',
      textValue: 'text-navy-900', textSub: 'text-navy-600', textName: 'text-navy-400',
    },
    {
      name: 'Pending Balance', value: `$${pendingBalance.toLocaleString()}`, sub: hasPending ? 'Action Needed' : 'All Clear',
      icon: Activity, clay: 'clay-card',
      bg: hasPending ? 'bg-orange-50' : 'bg-white', iconBg: hasPending ? 'bg-orange-200' : 'bg-slate-100', iconColor: hasPending ? 'text-orange-700' : 'text-slate-500',
      textValue: hasPending ? 'text-orange-700' : 'text-navy-900', textSub: hasPending ? 'text-orange-500' : 'text-navy-600', textName: 'text-navy-400',
    },
    {
      name: 'Active Plan', value: activePlan, sub: 'B2B Healthcare',
      icon: Shield, clay: 'clay-card',
      bg: 'bg-white', iconBg: 'bg-lime-100', iconColor: 'text-lime-700',
      textValue: 'text-navy-900', textSub: 'text-lime-600', textName: 'text-navy-400',
    },
  ];

  /* ─── data fetching ──────────────────────────────────────── */
  const fetchAll = async () => {
    try {
      const [bRes, iRes, sRes, subRes, pRes] = await Promise.allSettled([
        api.get('/bookings'), 
        api.get('/invoices'), 
        api.get('/services'), 
        api.get('/subscriptions'),
        api.get('/patients')
      ]);
      if (bRes.status === 'fulfilled') setMyAppointments(bRes.value.data.bookings || []);
      if (iRes.status === 'fulfilled') setInvoices(iRes.value.data.invoices || []);
      if (sRes.status === 'fulfilled') setServices(sRes.value.data);
      if (subRes.status === 'fulfilled') setSubscriptions(subRes.value.data || []);
      if (pRes.status === 'fulfilled') setPatients(pRes.value.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openModal = (qa) => { 
    if (qa.href) {
      window.location.href = qa.href;
      return;
    }
    setActiveModal(qa.id); 
    setIsModalOpen(true); 
  };
  const closeModal = () => { setIsModalOpen(false); setActiveModal(null); };

  /* ─── recent activity ────────────────────────────────────── */
  const recentActivity = [...invoices.map(i => ({
    id: `inv-${i.id}`,
    title: `Invoice ${i.status === 'paid' ? 'Settled' : 'Received'}`,
    detail: `$${i.amount_due} — ${i.service_name || 'Consultation'}`,
    time: new Date(i.created_at || i.due_date).toLocaleDateString(),
    ts: new Date(i.created_at || i.due_date).getTime(),
    icon: CreditCard,
    accent: i.status === 'paid',
  })), ...myAppointments.map(a => ({
    id: `appt-${a.id}`,
    title: `Support Session`,
    detail: a.status.charAt(0).toUpperCase() + a.status.slice(1),
    time: new Date(a.booking_date).toLocaleDateString(),
    ts: new Date(a.created_at || a.booking_date).getTime(),
    icon: Calendar,
    accent: false,
  }))].sort((a, b) => b.ts - a.ts).slice(0, 5);

  /* ─── quick actions ──────────────────────────────────────── */
  const quickActions = [
    { id: 'register_patient', name: 'Add Patient',   icon: Plus,       bg: 'bg-primary', text: 'text-white',     iconBg: 'bg-white/15', href: '/dashboard/patients' },
    { id: 'plans',   name: 'Subscription',  icon: Star,       bg: 'bg-accent',  text: 'text-primary',   iconBg: 'bg-white/30', href: plansPageHref },
    { id: 'billing', name: 'Billing Hub',   icon: CreditCard, bg: 'bg-lime-100',text: 'text-lime-800',  iconBg: 'bg-lime-200', href: '/dashboard/payments?view=payments' },
    { id: 'support', name: 'Help Center',   icon: HelpCircle, bg: 'bg-white',   text: 'text-navy-900',  iconBg: 'bg-navy-900/5' },
  ];

  /* ─── modal content ─────────────────────────────────────── */
  const renderModal = () => {
    switch (activeModal) {
      case 'plans':
        return (
          <div className="space-y-5">
            {activeSub ? (
              <div className="clay-card-dark bg-primary p-8 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/20 animate-float-slow pointer-events-none" />
                <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest rounded-full border border-accent/30 inline-flex items-center gap-1.5 mb-4">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> Active Plan
                </span>
                <h4 className="text-2xl font-black">{getSubscriptionDisplayName(activeSub)}</h4>
                <p className="text-white/60 text-sm mt-1">{activeSub.service_desc || 'B2B Healthcare Coordination'}</p>
                <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-black text-accent">${parseFloat(activeSub.amount_usd).toFixed(0)}</p>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Monthly Cost</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-black">
                      {activeRenewalDate ? new Date(activeRenewalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Next Renewal</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="clay-card-dark bg-navy-800 p-8 text-white text-center">
                <Zap className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
                <h4 className="text-xl font-black">Trial Period</h4>
                <p className="text-white/40 text-sm mt-2">You are currently on a limited trial. Subscribe to a package to unlock premium healthcare coordination features.</p>
              </div>
            )}
            {activeSub ? (
              ['Continuous Care Coordination', 'Dedicated Support Line', 'Compliance Management'].map(f => (
                <div key={f} className="clay-card bg-white flex items-center gap-3 p-4">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-bold text-navy-900">{f}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-navy-400 font-medium">Browse our healthcare packages to get started.</p>
            )}
            <Link href="/dashboard/payments" className="block w-full">
              <button className="clay-card w-full py-4 bg-lime-50 text-navy-900 font-black text-sm border border-lime-200 hover:bg-lime-100 transition-colors active:scale-[0.98]">
                {activeSub ? 'Manage Subscriptions' : 'Browse Packages'}
              </button>
            </Link>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-4">
            {invoices.length === 0
              ? <div className="clay-card bg-slate-50 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No invoices found</div>
              : invoices.map(inv => (
                <div key={inv.id} className="clay-card bg-white p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-navy-900 text-base">{inv.service_name || 'Consultation'}</h4>
                    <p className="text-xs text-navy-400 mt-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl text-navy-900">${inv.amount_due}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${inv.status === 'paid' ? 'bg-lime-50 text-lime-700 border-lime-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>{inv.status}</span>
                    {inv.status === 'pending' && <button className="clay-card-accent px-5 py-2 bg-accent text-primary text-xs font-black uppercase tracking-widest hover:bg-accent-light transition-colors active:scale-95">Pay Now</button>}
                  </div>
                </div>
              ))}
          </div>
        );
      case 'support':
        return (
          <div className="space-y-5">
            <div className="clay-card-accent bg-lime-50 border border-lime-100 p-6 flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white clay-card flex items-center justify-center shrink-0"><Users className="w-6 h-6 text-lime-700" /></div>
              <div>
                <h4 className="font-black text-navy-900 text-lg">Your Account Manager</h4>
                <p className="text-sm text-navy-600 mt-1.5 leading-relaxed">Sarah Jenkins — Mon-Fri, 9AM-5PM EST for all operational queries.</p>
                <button className="mt-4 clay-card-dark px-5 py-2.5 bg-primary text-accent text-xs font-black uppercase tracking-widest hover:bg-navy-800 transition-colors active:scale-95">Message Sarah</button>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-black uppercase text-navy-400 tracking-widest px-1">FAQ</p>
              {['How do I reschedule a booked session?', 'Download my annual invoice report', 'Adding team members to my Organization'].map(faq => (
                <button key={faq} className="clay-card bg-white w-full flex justify-between items-center p-4 hover:bg-lime-50 hover:border-lime-200 transition-all group border border-transparent">
                  <span className="text-sm font-semibold text-navy-900 group-hover:text-primary text-left">{faq}</span>
                  <ChevronRight className="w-4 h-4 text-navy-400 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="My Dashboard" subtitle={`Good morning, ${user?.organization_name || 'Health Partners'}`} />

      <main className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-16">

        {/* ── Pending banner ── */}
        <AnimatePresence>
          {pendingInvoices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="clay-card bg-orange-50 border border-orange-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-200 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <h4 className="font-black text-orange-900 text-base">Action Required: Unpaid Invoices</h4>
                  <p className="text-sm text-orange-700/80 mt-0.5">{pendingInvoices.length} pending invoice(s) awaiting settlement.</p>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => openModal('billing')}
                className="clay-card-accent px-8 py-3 bg-accent text-primary font-black text-sm hover:bg-accent-light transition-colors whitespace-nowrap">
                Review & Pay
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero ── */}
        <motion.div {...fadeUp(0)} className="clay-card-dark bg-primary p-8 sm:p-10 text-white relative overflow-hidden">
          {/* Floating orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent/10 blur-3xl -mr-40 -mt-40 pointer-events-none animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-lime-500/10 blur-2xl -ml-28 -mb-28 pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />
          {/* Decorative pill blobs */}
          <div className="absolute top-8 right-32 w-20 h-9 rounded-full bg-accent/20 blur-sm animate-bounce-soft pointer-events-none hidden lg:block" />
          <div className="absolute bottom-10 right-16 w-12 h-12 rounded-full bg-lime-400/15 blur-sm animate-float pointer-events-none hidden lg:block" style={{ animationDelay: '2s' }} />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              {/* Avatar clay */}
              <div className="w-24 h-24 flex-shrink-0 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-black text-4xl text-accent shadow-[0_6px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]">
                {user?.organization_name?.charAt(0) || 'H'}
              </div>
              <div>
                <span className="px-3 py-1 bg-accent/20 text-accent border border-accent/30 font-black text-[10px] uppercase tracking-widest rounded-full inline-flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> Active Account
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{user?.organization_name || 'Organization'}</h2>
                <p className="text-white/50 text-sm mt-2.5 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl"><MapPin className="w-3.5 h-3.5 text-accent" /> {user?.country || 'United States'}</span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5 text-accent" /> 
                    {activePlan}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 xl:flex-col shrink-0">
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => router.push(plansPageHref)}
                className="clay-card-accent px-7 py-3.5 bg-accent text-primary font-black text-sm hover:bg-accent-light transition-colors flex items-center gap-2">
                <Zap className="w-4 h-4" /> Upgrade Plan
              </motion.button>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => openModal('support')}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/10 transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4" /> Support Hub
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div variants={staggerChildren} initial="initial" animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.name} variants={fadeUp(i * 0.08)}
              className={`${s.clay} ${s.bg} p-6 flex flex-col justify-between gap-6 group hover:-translate-y-1 transition-transform duration-300 cursor-default animate-breathe`}
              style={{ borderRadius: '2rem', animationDelay: `${i * 0.5}s` }}
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${s.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:rotate-3 transition-transform duration-300`}>
                  <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full bg-black/5 ${s.textSub}`}>{s.sub}</span>
              </div>
              <div>
                <p className={`text-sm font-bold tracking-tight mb-1 ${s.textName}`}>{s.name}</p>
                <h3 className={`text-4xl font-black tracking-tight ${s.textValue}`}>{s.value}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Patient Care Hub + Activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Patient Hub */}
          <motion.section {...fadeUp(0.1)} className="lg:col-span-2">
            <div className="glass-panel overflow-hidden animate-breathe" style={{ animationDelay: '1s' }}>
              <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-lime-400" />
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-navy-900 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  Care Overview
                </h3>
                <Link href="/dashboard/patients" className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-navy-400 hover:text-navy-900 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="px-6 sm:px-8 min-h-[320px]">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-navy-400">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-accent animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest">Loading patients…</p>
                  </div>
                ) : patients.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 text-navy-400 text-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-2">
                      <Users className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-black text-navy-900">No Patient Records</p>
                    <p className="text-xs font-medium text-gray-400 max-w-sm">Start by registering your first patient to begin the coordination cycle.</p>
                    <Link href="/dashboard/patients">
                      <button className="clay-card-accent mt-4 px-8 py-3 bg-accent text-primary text-xs font-black uppercase tracking-widest hover:bg-accent-light transition-colors">
                        Add My First Patient
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {patients.slice(0, 5).map((patient, i) => (
                      <motion.div key={patient.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-default hover:bg-slate-50/80 -mx-6 sm:-mx-8 px-6 sm:px-8 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white clay-card flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform overflow-hidden relative">
                            {patient.profile_picture_url ? (
                                <img src={patient.profile_picture_url} alt={patient.first_name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl font-black text-navy-900 opacity-20 uppercase">{patient.first_name.charAt(0)}{patient.last_name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-navy-900 text-base group-hover:text-primary transition-colors">{patient.first_name} {patient.last_name}</h4>
                            <p className="text-xs text-navy-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                              {patient.blood_type && <span className="text-accent">Type {patient.blood_type}</span>} 
                              {patient.dob && <span>· {new Date().getFullYear() - new Date(patient.dob).getFullYear()} years</span>}
                            </p>
                          </div>
                        </div>
                        <Link href={`/dashboard/patients/${patient.id}`}>
                            <motion.button whileTap={{ scale: 0.95 }}
                                className="clay-card bg-primary text-accent px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-navy-800 transition-colors flex items-center gap-2">
                                View Profile
                            </motion.button>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
                <Link href="/dashboard/patients" className="text-navy-600 font-bold text-sm hover:text-primary transition-colors flex items-center gap-2 group">
                  Manage Patient Directory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Recent Activity */}
          <motion.section {...fadeUp(0.2)} className="glass-panel p-6 sm:p-8 flex flex-col animate-breathe" style={{ animationDelay: '1.5s' }}>
            <h3 className="text-xl font-black text-navy-900 mb-8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"><Activity className="w-5 h-5 text-accent" /></div>
              Recent Activity
            </h3>
            <div className="space-y-0 flex-1">
              {recentActivity.length === 0
                ? <div className="py-16 text-center text-navy-400 font-bold text-xs uppercase tracking-widest">No recent activity</div>
                : recentActivity.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex gap-4 pb-6 group cursor-default">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${item.accent ? 'bg-accent' : 'bg-primary'} group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-4 h-4 ${item.accent ? 'text-primary' : 'text-accent'}`} />
                      </div>
                      {i < recentActivity.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 mt-2 min-h-[24px]" />}
                    </div>
                    <div className="pt-1 pb-4 flex-1 min-w-0">
                      <h4 className="font-bold text-navy-900 text-sm truncate">{item.title}</h4>
                      <p className="text-sm text-navy-400 font-medium mt-0.5 truncate">{item.detail}</p>
                      <p className="text-[10px] text-navy-400/70 font-bold uppercase tracking-widest mt-1.5">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
            <button className="clay-card py-3.5 w-full bg-slate-50 text-navy-600 font-bold text-xs hover:bg-lime-50 hover:text-navy-900 transition-colors border border-slate-100 mt-4">
              Notification Center
            </button>
          </motion.section>
        </div>

        {/* ── Quick Actions ── */}
        <motion.div {...fadeUp(0.15)} className="space-y-5">
          <div>
            <h3 className="text-xl font-black text-navy-900">Quick Jump</h3>
            <p className="text-navy-400 text-sm font-medium mt-1">Accelerate your workflow</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {quickActions.map((qa, i) => (
              <motion.button key={qa.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }} whileTap={{ scale: 0.95 }}
                onClick={() => openModal(qa)}
                className={`clay-card ${qa.bg} ${qa.text} p-6 flex flex-col items-start gap-5 group text-left relative overflow-hidden animate-breathe`}
                style={{ borderRadius: '2rem', minHeight: '9rem', animationDelay: `${i * 0.2}s` }}
              >
                {/* Blob decor */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-black/5 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
                <div className={`w-12 h-12 rounded-2xl ${qa.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                  <qa.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between w-full relative z-10">
                  <span className="font-black text-base tracking-tight">{qa.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Modal ── */}
        <Modal isOpen={isModalOpen} onClose={closeModal}
          title={quickActions.find(a => a.id === activeModal)?.name || 'Action'}>
          {renderModal()}
        </Modal>
      </main>
    </div>
  );
}
