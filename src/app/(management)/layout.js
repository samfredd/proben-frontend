'use client';
import { Suspense, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/sidebar';
import { useSidebar } from '@/context/SidebarContext';

import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const isAuthPage = pathname === '/mngmnt/login';

  useEffect(() => {
    if (!loading) {
      if (!user && !isAuthPage) {
        router.push('/mngmnt/login');
      } else if (user && user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, isAuthPage]);


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-navy-900 font-bold">Loading...</div>;
  }
  return (
    <div className="flex h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-primary/5 blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] rounded-full bg-lime-400/5 blur-[80px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {!isAuthPage && (
        <Suspense fallback={<div className="w-72 bg-navy-900" />}>
          <Sidebar role="admin" />
        </Suspense>
      )}
      <div className={`flex-1 min-w-0 relative z-10 transition-all duration-300 h-screen overflow-y-auto ${!isAuthPage ? (isCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[288px]') : ''}`}>
        <main className="p-0">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-navy-900 font-bold">Loading dashboard...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
