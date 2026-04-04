'use client';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/ui/Toast';

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <SidebarProvider>
          {children}
          <ToastContainer />
        </SidebarProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
