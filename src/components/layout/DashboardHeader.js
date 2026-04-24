'use client';
import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Bell, Search, Menu, LogOut, Settings, User, ChevronDown, CheckCircle, Activity, CreditCard, Building2, Users, Star } from 'lucide-react';
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
    { label: 'Organizations', href: '/mngmnt/clients', icon: Building2 },
    { label: 'Patient Directory', href: '/mngmnt/patients', icon: Users },
    { label: 'Financials', href: '/mngmnt/payments', icon: CreditCard },
  ] : [
    { label: 'My Patients', href: '/dashboard/patients', icon: Users },
    { label: 'Support Center', href: '/dashboard/support', icon: Activity },
    { label: 'Billing Hub', href: '/dashboard/payments', icon: Star },
  ];

  const mockNotifs = [
    { id: 1, title: 'Session Confirmed', time: '2m ago', icon: CheckCircle, color: 'text-green-500' },
    { id: 2, title: 'New Message', time: '1h ago', icon: Activity, color: 'text-blue-500' },
    { id: 3, title: 'Invoice Pending', time: '3h ago', icon: CreditCard, color: 'text-orange-500' },
  ];

  return (
    <header className="glass-header flex items-center justify-between p-4 md:p-8 sticky top-0 z-40">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button 
          onClick={toggle}
          type="button"
          className="lg:hidden p-2 bg-gray-50 border border-gray-100 rounded-xl text-navy-900 hover:bg-gray-100 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="truncate">
          <h1 className="text-lg md:text-2xl font-bold text-navy-900 tracking-tight truncate">{title}</h1>
          <p className="text-gray-400 text-[10px] md:text-sm font-medium mt-0.5 truncate hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Search Trigger */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="hidden lg:flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 hover:border-accent hover:ring-2 hover:ring-accent/10 transition-all w-48 text-left group"
        >
          <Search className="w-4 h-4 text-gray-400 mr-2 group-hover:text-accent transition-colors" />
          <span className="text-sm font-medium text-gray-400">Search hub...</span>
          <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-gray-100 text-[9px] font-black text-gray-400">
            <span>⌘</span>
            <span>K</span>
          </div>
        </button>

        <div className="flex items-center gap-2 md:gap-4 md:border-l md:border-gray-100 md:pl-6">
          {/* Status */}
          <div className="hidden xs:flex items-center gap-2 bg-green-50 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-green-100">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="text-[8px] md:text-[10px] font-bold text-green-700 uppercase tracking-widest leading-none">Live</span>
          </div>

          {/* Theme */}
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="p-2 md:p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:text-navy-900 transition-colors"
          >
            {theme === 'light' ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5 text-accent" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              type="button" 
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              className={`p-2 md:p-2.5 border rounded-xl transition-all relative ${isNotifOpen ? 'bg-navy-900 text-accent border-navy-900' : 'bg-gray-50 text-gray-500 border-gray-100 hover:text-navy-900'}`}
            >
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-72 clay-card bg-white border border-gray-100 shadow-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-navy-900">Notifications</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">3 New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {mockNotifs.map(n => (
                      <div key={n.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer">
                        <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center ${n.color}`}><n.icon className="w-4 h-4" /></div>
                        <div>
                          <p className="text-sm font-bold text-navy-900">{n.title}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-navy-400 hover:text-navy-900 transition-colors">View All Activity</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 md:gap-3 p-1 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary text-accent flex items-center justify-center font-black text-xs md:text-sm shadow-sm ring-2 ring-accent/5">
                {initials}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 clay-card bg-white border border-gray-100 shadow-xl overflow-hidden"
                >
                  <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                    <p className="text-sm font-black text-navy-900 truncate tracking-tight">{user?.organization_name || user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-accent/20 text-accent text-[9px] font-black uppercase tracking-widest rounded-md border border-accent/20">
                      {user?.role === 'admin' ? 'Administrator' : 'Partner Account'}
                    </span>
                  </div>
                  <div className="p-2">
                    <Link href={settingsPath} onClick={() => setIsUserMenuOpen(false)}>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-navy-900 rounded-lg transition-colors group text-left">
                        <Settings className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
                        Management
                      </button>
                    </Link>
                    <button onClick={() => setIsUserMenuOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-navy-900 rounded-lg transition-colors group text-left">
                      <User className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
                      Account Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-100 bg-gray-50/30">
                    <button 
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-black text-red-500 hover:bg-red-50 rounded-lg transition-colors group text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400 group-hover:rotate-12 transition-transform" />
                      Sign Out
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
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative w-full max-w-2xl clay-card bg-white shadow-2xl overflow-hidden"
            >
              <div className="p-6 flex items-center gap-4 border-b border-gray-100">
                <Search className="w-6 h-6 text-accent" />
                <input 
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick jump to..."
                  className="bg-transparent border-none outline-none text-xl font-medium text-navy-900 placeholder:text-gray-300 w-full"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2 py-1 rounded bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                  Esc
                </button>
              </div>
              
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="mb-6">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 mb-3">Quick Navigation</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickLinks.map(link => (
                      <Link key={link.label} href={link.href} onClick={() => setIsSearchOpen(false)}>
                        <div className="flex items-center gap-3 p-4 rounded-2xl hover:bg-accent/5 hover:ring-1 hover:ring-accent/20 transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-accent group-hover:text-primary transition-all">
                            <link.icon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-navy-900">{link.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 mb-3">Recent Searches</h4>
                  <div className="space-y-1">
                    {['Quarterly Report', 'New Medical Patient', 'Billing Summary Feb'].map(item => (
                      <div key={item} className="p-4 rounded-xl flex items-center gap-3 text-gray-500 hover:text-navy-900 hover:bg-gray-50 transition-colors cursor-pointer group">
                        <Activity className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                <p className="text-[10px] font-bold text-gray-400 italic">Proben Universal Search v1.0</p>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-black uppercase tracking-tighter text-gray-300">Shortcut: ⌘K</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
