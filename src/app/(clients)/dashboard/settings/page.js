'use client';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, Building2, Bell, Shield } from 'lucide-react';

export default function ClientSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Organization Settings" subtitle="Manage your company profile and preferences" />
      
      <main className="p-4 md:p-8 max-w-[1000px] mx-auto space-y-8">
        <div className="glass-panel overflow-hidden animate-breathe" style={{ animationDelay: '0.2s' }}>
          <div className="p-6 md:p-8 border-b border-gray-50">
             <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
               <Building2 className="w-6 h-6 text-gray-400" /> Organization Profile
             </h3>
          </div>
          <div className="p-6 md:p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Organization Name</label>
                  <input readOnly value={user?.organization_name || 'My Organization'} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-navy-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Country</label>
                  <input readOnly value={user?.country || 'United States'} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-navy-900" />
                </div>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Contact Email</label>
               <input readOnly value={user?.email || 'contact@example.com'} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-navy-900" />
             </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden animate-breathe" style={{ animationDelay: '0.6s' }}>
          <div className="p-6 md:p-8 border-b border-gray-50">
             <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
               <Shield className="w-6 h-6 text-gray-400" /> Security
             </h3>
          </div>
          <div className="p-6 md:p-8 space-y-6">
             <button className="px-6 py-4 bg-navy-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-colors">
               Change Password
             </button>
             <p className="text-xs font-medium text-gray-400 max-w-lg mt-2">
               For additional security changes or to update your accepted Terms of Service and legal agreements, please contact your account manager.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
