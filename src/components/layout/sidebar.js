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
  Building2
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
      group: 'Main',
      items: [
        { name: 'Overview', href: '/mngmnt/dashboard', icon: LayoutDashboard },
        { name: 'Reports', href: '/mngmnt/reports', icon: BarChart3 },
      ]
    },
    {
      group: 'Management',
      items: [
        { name: 'Organization Clients', href: '/mngmnt/clients', icon: Building2 },
        { name: 'Patient Records', href: '/mngmnt/patients', icon: Activity },
        { name: 'Expert Staff', href: '/mngmnt/staff', icon: Users },
        { name: 'Subscription Packages', href: '/mngmnt/subscription-packages', icon: Box },
      ]
    },
    {
      group: 'Operations',
      items: [
        { name: 'Support Sessions', href: '/mngmnt/support', icon: Activity },
      ]
    },
    {
      group: 'Financial',
      items: [
        { name: 'Invoices', href: '/mngmnt/invoices', icon: FileText },
        { name: 'Payments', href: '/mngmnt/payments', icon: CreditCard },
        { name: 'Active Subscriptions', href: '/mngmnt/subscriptions', icon: Activity },
      ]
    },
    {
      group: 'System',
      items: [
        { name: 'Settings', href: '/mngmnt/settings', icon: Settings },
      ]
    }
  ];

  const clientLinks = [
    {
      group: 'Main',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      group: 'Healthcare',
      items: [
        { name: 'Patients', href: '/dashboard/patients', icon: Users },
        { name: 'Support', href: '/dashboard/support', icon: Activity },
      ]
    },
    {
      group: 'Finance',
      items: [
        { name: 'Billing Hub', href: '/dashboard/payments', icon: CreditCard },
      ]
    },
    {
      group: 'Account',
      items: [
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  const activeLinkGroups = role === 'admin' ? adminLinks : clientLinks;

  const brandName = role === 'admin' ? 'Proben Admin' : 'Proben Client';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ 
          width: isCollapsed ? 88 : 288,
          x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -288 : 0)
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`glass-sidebar flex flex-col h-screen fixed inset-y-0 left-0 z-40 lg:fixed lg:top-0 shrink-0 shadow-sm overflow-hidden self-start ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="relative w-10 h-10 shrink-0">
          <Image 
            src="/logo.png" 
            alt="Proben Logo" 
            fill 
            sizes="40px"
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
            >
              <h1 className="text-sm font-bold text-white leading-none truncate w-32">{brandName}</h1>
              <p className="text-[10px] text-white/40 mt-1 font-medium italic">Healthcare Management</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto overflow-x-hidden">
        {activeLinkGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-4 text-[10px] font-black uppercase text-lime-500/50 tracking-[0.2em] mb-3">
                {group.group}
              </h3>
            )}
            {group.items.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-3 transition-all group relative ${isCollapsed ? 'justify-center' : 'justify-between'} ${
                      isActive 
                        ? 'clay-card-accent bg-accent text-primary z-10' 
                        : 'text-white/60 hover:text-white'
                    }`}
                    style={{ borderRadius: '1rem' }}
                  >
                    <div className="flex items-center min-w-0">
                      <link.icon className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive ? 'text-primary' : 'group-hover:text-lime-600'
                      } ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            className="text-sm font-bold tracking-tight truncate"
                          >
                            {link.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {!isCollapsed && isActive && (
                      <motion.div layoutId="activeArrow" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <ChevronDown className="w-4 h-4 -rotate-90 text-primary/40" />
                      </motion.div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50 space-y-2">
        <button
          onClick={toggleCollapse}
          className={`flex items-center w-full px-4 py-3 text-white/40 hover:text-white transition-colors group ${isCollapsed ? 'justify-center' : ''
            }`}
        >
          <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
            <ChevronLeft className="h-5 w-5 shrink-0" />
          </div>
          {!isCollapsed && <span className="text-sm font-bold tracking-tight ml-3 text-white/60 hover:text-white">Collapse</span>}
        </button>
        <button
          onClick={logout}
          className={`flex items-center w-full px-4 py-3 text-red-400 hover:text-red-600 transition-colors group ${isCollapsed ? 'justify-center' : ''
            }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-bold tracking-tight ml-3">Logout</span>}
        </button>
      </div>
    </motion.div>
    </>
  );
}

