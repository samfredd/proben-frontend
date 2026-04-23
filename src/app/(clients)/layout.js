'use client';
import { Suspense, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import Sidebar from '@/components/layout/sidebar';
import { useSidebar } from '@/context/SidebarContext';

import { useRouter } from 'next/navigation';

export default function ClientLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'admin' || user.role === 'consultant') {
        const redirectPath = user.role === 'admin' ? '/mngmnt/dashboard' : '/consultant/dashboard';
        router.push(redirectPath);
      }
    }
  }, [user, loading, router]);


  return (
    <SubscriptionProvider>
    <div className="flex h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[-10%] w-[45%] h-[45%] rounded-full bg-accent/5 blur-[120px] animate-blob" />
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[35%] h-[35%] rounded-full bg-lime-400/5 blur-[110px] animate-blob" style={{ animationDelay: '5s' }} />
      </div>

      <Suspense fallback={<div className="w-72 bg-navy-900" />}>
        <Sidebar role="client" />
      </Suspense>
      <div className={`flex-1 min-w-0 relative z-10 transition-all duration-300 h-screen overflow-y-auto ${isCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[288px]'}`}>
        <main className="p-0">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-navy-900 font-bold">Loading dashboard...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
    </SubscriptionProvider>
  );
}
