'use client';
import { useState, useEffect } from 'react';
import api from '@/api/api';
import { motion } from 'framer-motion';
import { User, Building2, Mail, MapPin, Save, Shield, Lock, Bell, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password state
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [formData, setFormData] = useState({
    organization: { organizationName: '', email: '', address: '' },
    user: { notification_prefs: {} }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setData(res.data);
      setFormData({
        organization: res.data.organization,
        user: res.data.user
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
      setErrorMsg('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      organization: { ...prev.organization, [name]: value }
    }));
  };

  const handleNotifyToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        notification_prefs: {
          ...prev.user.notification_prefs,
          [key]: !prev.user.notification_prefs[key]
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.put('/profile', formData);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setErrorMsg('New passwords do not match');
    }
    setPasswordLoading(true);
    try {
      await api.put('/auth/change-password', passwordData);
      setSuccessMsg('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Organization Profile</h1>
        <p className="text-gray-500 mt-1">Manage your organization's details and contact information.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-navy-900 to-navy-800"></div>

        <div className="px-8 md:px-12 pb-12 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-10">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-lime-100 text-lime-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Building2 className="w-14 h-14" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-navy-900">{data?.organization?.organizationName || 'Your Organization'}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-gray-500 font-medium">
                <Shield className="w-4 h-4 text-lime-600" />
                <span>Verified {data?.user?.role} Account</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">

            {(successMsg || errorMsg) && (
              <div className={`p-4 rounded-xl border font-medium text-sm flex items-center gap-2 ${successMsg ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                <div className={`w-2 h-2 rounded-full ${successMsg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {successMsg || errorMsg}
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-xl font-black text-navy-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-lime-600" />
                Organization Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organization.organizationName}
                    onChange={handleOrgChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium text-navy-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Contact Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.organization.email}
                    onChange={handleOrgChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium text-navy-900"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Address</label>
                  <textarea
                    name="address"
                    value={formData.organization.address}
                    onChange={handleOrgChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none transition-all font-medium text-navy-900 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-gray-100">
              <h3 className="text-xl font-black text-navy-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-lime-600" />
                Notification Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'email_bookings', label: 'Booking Confirmations', desc: 'Receive emails when a consultation is scheduled' },
                  { key: 'email_invoices', label: 'Billing Alerts', desc: 'Get notified for new invoices and payments' },
                  { key: 'email_marketing', label: 'Proben Updates', desc: 'Occasional news and feature updates' }
                ].map((pref) => (
                  <div
                    key={pref.key}
                    onClick={() => handleNotifyToggle(pref.key)}
                    className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:border-lime-200 hover:bg-lime-50/30 transition-all"
                  >
                    <div>
                      <div className="font-bold text-navy-900">{pref.label}</div>
                      <div className="text-xs text-gray-500">{pref.desc}</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.user.notification_prefs[pref.key] ? 'bg-lime-500' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.user.notification_prefs[pref.key] ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-navy-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile & Prefs'}
              </button>
            </div>
          </form>

          <form onSubmit={handleChangePassword} className="mt-16 pt-16 border-t border-gray-100 space-y-6">
            <h3 className="text-xl font-black text-navy-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-lime-600" />
              Security & Password
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-navy-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-navy-800 transition-all shadow-lg"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
