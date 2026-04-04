'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  UserSquare2,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
  ChevronLeft,
  Box,
  Video,
  Clock,
  Activity,
  Building2,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

import { useSidebar } from '@/context/SidebarContext';

export default function Sidebar({ role }) {
  const { isOpen, close, isCollapsed, toggleCollapse } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  
  const currentView = searchParams.get('view');

  const adminLinks = [
    {
      group: 'Intelligence',
      items: [
        { name: 'Command Center', href: '/mngmnt/dashboard', icon: LayoutDashboard },
        { name: 'Reports Hub', href: '/mngmnt/reports', icon: BarChart3 },
      ]
    },
    {
      group: 'Management',
      items: [
        { name: 'Client Nodes', href: '/mngmnt/clients', icon: Building2 },
        { name: 'Patient Records', href: '/mngmnt/patients', icon: Activity },
        { name: 'Expert Logistics', href: '/mngmnt/staff', icon: Users },
        { name: 'Service Packages', href: '/mngmnt/subscription-packages', icon: Box },
      ]
    },
    {
      group: 'Operations',
      items: [
        { name: 'Clinical Flows', href: '/mngmnt/support', icon: Activity },
      ]
    },
    {
      group: 'Fiscal Health',
      items: [
        { name: 'Ledger Arch', href: '/mngmnt/invoices', icon: FileText },
        { name: 'Settlements', href: '/mngmnt/payments', icon: CreditCard },
        { name: 'Term Subs', href: '/mngmnt/subscriptions', icon: Activity },
      ]
    },
    {
      group: 'System',
      items: [
        { name: 'Control Plane', href: '/mngmnt/settings', icon: Settings },
      ]
    }
  ];

  const clientLinks = [
    {
      group: 'Main Hub',
      items: [
        { name: 'Concierge Portal', href: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      group: 'Healthcare',
      items: [
        { name: 'Member Coordination', href: '/dashboard/patients', icon: Users },
        { name: 'Expert Support', href: '/dashboard/support', icon: Activity },
      ]
    },
    {
      group: 'Finance',
      items: [
        { name: 'Fiscal Terminal', href: '/dashboard/payments', icon: CreditCard },
      ]
    },
    {
      group: 'Account',
      items: [
        { name: 'Local Config', href: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  const activeLinkGroups = role === 'admin' ? adminLinks : clientLinks;
  const brandName = role === 'admin' ? 'Proben Elite' : 'Proben Concierge';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-navy-900/60 backdrop-blur-md z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ 
          width: isCollapsed ? 100 : 300,
          x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0)
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 180 }}
        className={`glass-card-saturated-dark flex flex-col h-screen fixed inset-y-0 left-0 z-40 lg:fixed lg:top-0 shrink-0 shadow-2xl overflow-hidden self-start border-r border-white/5`}
      >
        <div className={`p-8 pb-4 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
          <div className="relative w-12 h-12 shrink-0 glass-panel-dark bg-white/10 rounded-[1.25rem] border border-white/20 flex items-center justify-center p-2.5">
            <Image 
              src="/logo.png" 
              alt="Proben Logo" 
              width={40}
              height={40}
              className="object-contain" 
              priority 
            />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <h1 className="text-sm font-black text-white tracking-widest uppercase leading-none truncate w-32">{brandName}</h1>
                <div className="flex items-center gap-1.5 mt-1.5">
                   <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                   <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Authorized Access</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-5 py-8 space-y-10 overflow-y-auto scrollbar-hide">
          {activeLinkGroups.map((group) => (
            <div key={group.group} className="space-y-2">
              {!isCollapsed && (
                <h3 className="px-5 text-[9px] font-black uppercase text-accent/40 tracking-[0.3em] mb-4">
                  {group.group}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <div key={link.name}>
                      <Link
                        href={link.href}
                        className={`flex items-center px-5 py-4 transition-all group relative ${isCollapsed ? 'justify-center' : 'justify-between'} ${
                          isActive 
                            ? 'glass-card-saturated bg-white/10 text-white z-10 shadow-xl' 
                            : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                        }`}
                        style={{ borderRadius: '1.25rem' }}
                      >
                        <div className="flex items-center min-w-0">
                          <link.icon className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                            isActive ? 'text-accent scale-110 drop-shadow-[0_0_8px_rgba(130,195,65,0.6)]' : 'group-hover:text-accent group-hover:scale-105'
                          } ${isCollapsed ? 'mr-0' : 'mr-4'}`} />
                          <AnimatePresence mode="wait">
                            {!isCollapsed && (
                              <motion.span
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -5 }}
                                className="text-xs font-black tracking-widest uppercase truncate"
                              >
                                {link.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        {!isCollapsed && isActive && (
                          <motion.div layoutId="activeArrow" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                             <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                          </motion.div>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 space-y-3 bg-black/20 border-t border-white/5">
          <button
            onClick={toggleCollapse}
            className={`flex items-center w-full px-5 py-4 text-white/30 hover:text-white transition-all group ${isCollapsed ? 'justify-center' : ''
              } bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5`}
          >
            <div className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`}>
              <ChevronLeft className="h-5 w-5 shrink-0" />
            </div>
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest ml-4">Consolidate View</span>}
          </button>
          
          <button
            onClick={logout}
            className={`flex items-center w-full px-5 py-4 text-red-400/60 hover:text-red-400 transition-all group ${isCollapsed ? 'justify-center' : ''
              } bg-red-500/5 hover:bg-red-500/10 rounded-2xl border border-red-500/10`}
          >
            <LogOut className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest ml-4">Terminal Session Exit</span>}
          </button>
        </div>
      </motion.div>
    </>
  );
}
