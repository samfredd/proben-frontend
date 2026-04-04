'use client';
import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Bell, Search, Menu, LogOut, Settings, User, ChevronDown, CheckCircle, Activity, CreditCard, Building2, Users, Star, Sparkles, Shield } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function DashboardHeader({ title = 'Dashboard', subtitle = 'Welcome back' }) {
  const { toggle } = useSidebar();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    if (storedTheme === 'dark') document.documentElement.classList.add('dark');
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user?.role === 'admin';
  const settingsPath = isAdmin ? '/mngmnt/support' : '/dashboard/settings';
  const initials = (user?.organization_name || user?.email)?.substring(0, 2).toUpperCase() || 'US';

  const quickLinks = isAdmin ? [
    { label: 'Client Nodes', href: '/mngmnt/clients', icon: Building2 },
    { label: 'Record Hub', href: '/mngmnt/patients', icon: Users },
    { label: 'Fiscal View', href: '/mngmnt/payments', icon: CreditCard },
  ] : [
    { label: 'My Patients', href: '/dashboard/patients', icon: Users },
    { label: 'Support Flow', href: '/dashboard/support', icon: Activity },
    { label: 'Tier Status', href: '/dashboard/subscriptions', icon: Star },
  ];

  const mockNotifs = [
    { id: 1, title: 'Network Event', desc: 'Clinical Review Settled', time: '2m ago', icon: Sparkles, accent: 'accent' },
    { id: 2, title: 'Inbound Sync', desc: 'Member Record Updated', time: '1h ago', icon: Activity, accent: 'blue' },
    { id: 3, title: 'Fiscal Pulse', desc: 'Ledger Item Verified', time: '3h ago', icon: Shield, accent: 'lime' },
  ];

  return (
    <header className="glass-header flex items-center justify-between p-6 md:p-8 sticky top-0 z-40 border-b border-slate-200/50">
      <div className="flex items-center gap-6 min-w-0">
        <button 
          onClick={toggle}
          type="button"
          className="lg:hidden p-3 bg-white/50 backdrop-blur-md border border-slate-100 rounded-2xl text-navy-900 hover:bg-white transition-all shadow-sm"
        >
          <Menu className="w-6 h-6 text-accent" />
        </button>
        <div className="truncate">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
             <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Authorized Terminal</span>
          </div>
          <h1 className="text-xl md:text-3xl font-black text-navy-900 tracking-tighter truncate">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        {/* Search Trigger */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="hidden lg:flex items-center bg-gray-50/50 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200/50 hover:border-accent hover:ring-4 hover:ring-accent/5 transition-all w-64 text-left group shadow-sm"
        >
          <Search className="w-4 h-4 text-slate-400 mr-3 group-hover:text-accent transition-colors" />
          <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Search Intelligence...</span>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-slate-100 text-[10px] font-black text-slate-300">
            <span>⌘</span>
            <span>K</span>
          </div>
        </button>

        <div className="flex items-center gap-2 md:gap-5 md:border-l md:border-slate-100 md:pl-8">
          {/* Theme Toggle */}
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="p-3 bg-white/50 backdrop-blur-md border border-slate-100 rounded-2xl text-slate-400 hover:text-accent transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-accent" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              type="button" 
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              className={`p-3 border rounded-2xl transition-all relative shadow-sm ${isNotifOpen ? 'bg-navy-900 text-accent border-navy-900' : 'bg-white/50 text-slate-400 border-slate-100 hover:text-accent'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent border-2 border-white rounded-full shadow-[0_0_8px_rgba(130,195,65,0.8)]"></span>
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-5 w-80 glass-card-saturated bg-white/95 border border-slate-200/50 shadow-2xl overflow-hidden rounded-[2.5rem]"
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-900">Intelligence Stream</span>
                    <span className="text-[9px] bg-accent text-primary px-2.5 py-1 rounded-full font-black uppercase tracking-widest">3 Active</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {mockNotifs.map(n => (
                      <div key={n.id} className="p-5 hover:bg-slate-50/80 rounded-2xl transition-all flex items-center gap-4 cursor-pointer group">
                        <div className={`w-10 h-10 rounded-xl bg-${n.accent}/10 flex items-center justify-center text-${n.accent} group-hover:scale-110 transition-transform`}><n.icon className="w-5 h-5" /></div>
                        <div>
                          <p className="text-xs font-black text-navy-900 uppercase tracking-widest truncate">{n.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5 line-clamp-1">{n.desc}</p>
                          <p className="text-[9px] text-slate-300 font-black uppercase tracking-tighter mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 bg-navy-900 text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-white transition-colors">Operational Archive</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-white/50 transition-all border border-transparent hover:border-slate-200/50 hover:shadow-sm group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1.25rem] bg-navy-900 text-accent flex items-center justify-center font-black text-sm md:text-md shadow-xl ring-4 ring-accent/10 group-hover:ring-accent/20 transition-all">
                {initials}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-all duration-300 hidden sm:block ${isUserMenuOpen ? 'rotate-180 text-accent' : ''}`} />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-5 w-64 glass-card-saturated bg-white/95 border border-slate-200/50 shadow-2xl overflow-hidden rounded-[2.5rem]"
                >
                  <div className="p-6 bg-navy-900 border-b border-white/5">
                    <p className="text-sm font-black text-white truncate tracking-tight mb-1">{user?.organization_name || user?.email}</p>
                    <span className="inline-block px-2.5 py-1 bg-accent/20 text-accent text-[9px] font-black uppercase tracking-[0.2em] rounded-md border border-accent/20">
                      {user?.role === 'admin' ? 'Strategic Admin' : 'Concierge Partner'}
                    </span>
                  </div>
                  <div className="p-3 space-y-1">
                    <Link href={settingsPath} onClick={() => setIsUserMenuOpen(false)}>
                      <button className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-navy-900 rounded-2xl transition-all group text-left">
                        <Settings className="w-4 h-4 text-slate-300 group-hover:text-accent group-hover:rotate-45 transition-all" />
                        Control Hub
                      </button>
                    </Link>
                    <button onClick={() => setIsUserMenuOpen(false)} className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-navy-900 rounded-2xl transition-all group text-left">
                      <User className="w-4 h-4 text-slate-300 group-hover:text-accent transition-all" />
                      Profile Arch
                    </button>
                  </div>
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button 
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all group text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-all" />
                      End Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-navy-900/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              className="relative w-full max-w-2xl glass-card-saturated bg-white shadow-[0_0_100px_rgba(130,195,65,0.2)] overflow-hidden rounded-[3rem]"
            >
              <div className="p-8 flex items-center gap-5 border-b border-slate-100">
                <Search className="w-8 h-8 text-accent animate-pulse" />
                <input 
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query global records..."
                  className="bg-transparent border-none outline-none text-2xl font-black text-navy-900 placeholder:text-slate-300 w-full tracking-tighter"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm"
                >
                  Esc
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                <div className="mb-10">
                  <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] px-5 mb-5">Strategic Fast-Jump</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickLinks.map(link => (
                      <Link key={link.label} href={link.href} onClick={() => setIsSearchOpen(false)}>
                        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-accent/5 hover:border-accent hover:shadow-xl transition-all group">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-300 group-hover:bg-accent group-hover:text-primary group-hover:scale-110 shadow-sm transition-all">
                            <link.icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-black uppercase text-navy-900 tracking-widest">{link.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] px-5 mb-5">Operational Trace</h4>
                  <div className="space-y-2">
                    {['Quarterly Growth Audit', 'New Member Ingestion', 'Ledger Reconciliation'].map(item => (
                      <div key={item} className="p-5 rounded-2xl flex items-center justify-between text-slate-500 hover:text-navy-900 hover:bg-slate-50/80 transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-4">
                           <Activity className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all animate-float" />
                           <span className="text-sm font-bold tracking-tight">{item}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-navy-900 border-t border-white/5 flex justify-between items-center">
                <p className="text-[9px] font-black uppercase text-accent tracking-[0.4em]">Proben Tactical Search v2.0</p>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-black uppercase tracking-tighter text-white/20">Latency: 12ms</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
