'use client';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { Settings, Shield, User as UserIcon } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="System Settings" subtitle="Admin profile and platform configurations" />
      
      <main className="p-4 md:p-8 max-w-[1000px] mx-auto space-y-8">
        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-50">
             <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
               <UserIcon className="w-6 h-6 text-gray-400" /> Admin Profile
             </h3>
          </div>
          <div className="p-6 md:p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Name</label>
                  <input readOnly value={user?.contact_person || 'Admin'} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-navy-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email</label>
                  <input readOnly value={user?.email || 'admin@probenn.com'} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-navy-900" />
                </div>
             </div>
             <button className="px-6 py-4 bg-accent text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent-light transition-colors shadow-sm shadow-accent/10">
               Change Password
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-50">
             <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
               <Settings className="w-6 h-6 text-gray-400" /> Platform Configuration
             </h3>
          </div>
          <div className="p-6 md:p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Default Platform Currency</label>
                  <select disabled className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-navy-900 opacity-70">
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Default Timezone</label>
                  <select disabled className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-navy-900 opacity-70">
                    <option value="EST">EST (Eastern Standard Time)</option>
                  </select>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
