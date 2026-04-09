'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { Settings, Shield, User as UserIcon, Save, DollarSign, Clock, Phone, Globe } from 'lucide-react';
import api from '@/api/api';
import { useToast } from '@/components/ui/Toast';
import ChangePasswordModal from '@/components/ui/ChangePasswordModal';

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile State
  const [profileData, setProfileData] = useState({
    contact_person: '',
    phone: '',
    country: ''
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    default_currency: 'USD',
    default_timezone: 'EST'
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        contact_person: user.contact_person || '',
        phone: user.phone || '',
        country: user.country || 'United States'
      });
    }

    // Fetch System Settings
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSystemSettings(prev => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await api.patch('/auth/profile', {
        contactPerson: profileData.contact_person,
        phone: profileData.phone,
        country: profileData.country
      });
      updateUser(response.data.user);
      addToast('Admin profile updated', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSystemSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.patch('/settings', systemSettings);
      addToast('Platform configurations updated', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update platform settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="System Settings" subtitle="Admin profile and platform configurations" />
      
      <main className="p-4 md:p-8 max-w-[1000px] mx-auto space-y-8">
        {/* Admin Profile */}
        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
             <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
               <UserIcon className="w-6 h-6 text-gray-400" /> Admin Profile
             </h3>
             <button 
              onClick={handleProfileSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10 disabled:opacity-50"
             >
               <Save className="w-4 h-4" /> Update Profile
             </button>
          </div>
          <div className="p-6 md:p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
                  <input 
                    value={profileData.contact_person} 
                    onChange={(e) => setProfileData({ ...profileData, contact_person: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email (Read-only)</label>
                  <input readOnly value={user?.email || ''} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-100 font-bold text-gray-400 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      value={profileData.country} 
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900 appearance-none"
                    >
                      <option value="United States">United States</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
             </div>
             
             <div className="pt-4 border-t border-gray-50">
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-6 py-4 bg-accent text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent-light transition-colors shadow-sm shadow-accent/10"
                >
                  Change Password
                </button>
             </div>
          </div>
        </div>

        {/* Platform Configuration */}
        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
             <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
               <Settings className="w-6 h-6 text-gray-400" /> Platform Configuration
             </h3>
             <button 
              onClick={handleSystemSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-light transition-all shadow-sm shadow-accent/20 disabled:opacity-50"
             >
               <Save className="w-4 h-4" /> Save Config
             </button>
          </div>
          <div className="p-6 md:p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Default Platform Currency</label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      value={systemSettings.default_currency}
                      onChange={(e) => setSystemSettings({ ...systemSettings, default_currency: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900 appearance-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Default Timezone</label>
                  <div className="relative">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      value={systemSettings.default_timezone}
                      onChange={(e) => setSystemSettings({ ...systemSettings, default_timezone: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900 appearance-none"
                    >
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="UTC">UTC (Universal Coordinated Time)</option>
                      <option value="WAT">WAT (West Africa Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                </div>
             </div>
             <div className="p-4 bg-gray-50 rounded-2xl flex gap-4 items-start border border-gray-100">
                <Shield className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                <p className="text-xs font-medium text-gray-500 leading-relaxed">
                  These settings affect platform-wide defaults for new users and billing calculations. 
                  Changes are applied immediately and logged in the system audit trail.
                </p>
             </div>
          </div>
        </div>
      </main>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}
