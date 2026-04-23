'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { Building2, Shield, Save, User as UserIcon, Phone, Globe } from 'lucide-react';
import api from '@/api/api';
import { useToast } from '@/components/ui/Toast';
import ChangePasswordModal from '@/components/ui/ChangePasswordModal';

export default function ClientSettingsPage() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    organization_name: '',
    country: '',
    contact_person: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        organization_name: user.organization_name || '',
        country: user.country || 'United States',
        contact_person: user.contact_person || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleOrgSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await api.patch('/organizations/me', {
        organizationName: formData.organization_name
      });
      updateUser({ organization_name: response.data.organization_name });
      addToast('Organization settings updated', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update organization', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await api.patch('/auth/profile', {
        contactPerson: formData.contact_person,
        phone: formData.phone,
        country: formData.country
      });
      updateUser(response.data.user);
      addToast('Profile settings updated', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Organization Settings" subtitle="Manage your company profile and preferences" />
      
      <main className="p-4 md:p-8 max-w-[1000px] mx-auto space-y-8">
        {/* Organization Profile */}
        <div className="glass-panel overflow-hidden animate-breathe" style={{ animationDelay: '0.2s' }}>
          <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-white/50">
             <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
               <Building2 className="w-6 h-6 text-gray-400" /> Organization Profile
             </h3>
             <button 
              onClick={handleOrgSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-light transition-all shadow-sm shadow-accent/20 disabled:opacity-50"
             >
               <Save className="w-4 h-4" /> Save Changes
             </button>
          </div>
          <div className="p-6 md:p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Organization Name</label>
                  <input 
                    value={formData.organization_name} 
                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900" 
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Contact Email (Read-only)</label>
                   <input readOnly value={user?.email || ''} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-100/50 font-bold text-gray-400 cursor-not-allowed" />
                </div>
             </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="glass-panel overflow-hidden animate-breathe" style={{ animationDelay: '0.4s' }}>
          <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-white/50">
             <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
               <UserIcon className="w-6 h-6 text-gray-400" /> Personal Account
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
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Account Holder Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      value={formData.contact_person} 
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Primary Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900" 
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Country / Region</label>
                  <div className="relative">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      value={formData.country} 
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900 appearance-none"
                    >
                      <option value="United States">United States</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-panel overflow-hidden animate-breathe" style={{ animationDelay: '0.6s' }}>
          <div className="p-6 md:p-8 border-b border-gray-50 bg-white/50">
             <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
               <Shield className="w-6 h-6 text-gray-400" /> Security & Privacy
             </h3>
          </div>
          <div className="p-6 md:p-8 space-y-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="space-y-1">
                 <p className="font-bold text-navy-900 text-sm">Account Password</p>
                 <p className="text-xs text-gray-400 font-medium">Reset your account password for enhanced security.</p>
               </div>
               <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-6 py-4 bg-navy-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-colors"
               >
                 Change Password
               </button>
             </div>
             
             <div className="pt-6 border-t border-gray-50">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Legal Agreements</p>
               <p className="text-xs font-medium text-gray-400 max-w-lg mt-2 leading-relaxed">
                 You have accepted Proben's Terms of Service and Medical Liability Consent. 
                 To view or update your accepted legal documents, please contact your account manager.
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
