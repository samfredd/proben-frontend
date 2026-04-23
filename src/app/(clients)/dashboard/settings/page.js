'use client';
import { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import {
  Building2, Shield, Save, User as UserIcon, Phone, Globe,
  Camera, Bell, BellOff, Loader2, CheckCircle2, ClipboardList,
  Calendar, CreditCard, Mail
} from 'lucide-react';
import api from '@/api/api';
import { useToast } from '@/components/ui/Toast';
import ChangePasswordModal from '@/components/ui/ChangePasswordModal';

const COUNTRIES = [
  'United States', 'Nigeria', 'United Kingdom', 'Canada', 'Australia',
  'South Africa', 'Ghana', 'Kenya', 'India', 'Other',
];

// ITU E.164-based patterns. Accepts optional leading + and local dial variants.
const PHONE_CONFIG = {
  'United States': { dialCode: '+1',   pattern: /^\+?1?\s*\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}$/, hint: '+1 (555) 000-0000' },
  'Canada':        { dialCode: '+1',   pattern: /^\+?1?\s*\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}$/, hint: '+1 (416) 000-0000' },
  'Nigeria':       { dialCode: '+234', pattern: /^\+?234[\s\-]?[789]\d{9}$|^0[789]\d{9}$/,          hint: '+234 801 000 0000' },
  'United Kingdom':{ dialCode: '+44',  pattern: /^\+?44[\s\-]?\d{10}$|^0\d{10}$/,                   hint: '+44 7700 900000' },
  'Australia':     { dialCode: '+61',  pattern: /^\+?61[\s\-]?\d{9}$|^0\d{9}$/,                     hint: '+61 412 000 000' },
  'South Africa':  { dialCode: '+27',  pattern: /^\+?27[\s\-]?\d{9}$|^0\d{9}$/,                     hint: '+27 71 000 0000' },
  'Ghana':         { dialCode: '+233', pattern: /^\+?233[\s\-]?\d{9}$|^0\d{9}$/,                    hint: '+233 24 000 0000' },
  'Kenya':         { dialCode: '+254', pattern: /^\+?254[\s\-]?\d{9}$|^0\d{9}$/,                    hint: '+254 712 000000' },
  'India':         { dialCode: '+91',  pattern: /^\+?91[\s\-]?[6-9]\d{9}$|^[6-9]\d{9}$/,            hint: '+91 98765 43210' },
  'Other':         { dialCode: '',     pattern: /^\+?[\d\s\-().]{7,20}$/,                            hint: 'International format' },
};

function validatePhone(phone, country) {
  if (!phone.trim()) return 'Phone number is required';
  const cfg = PHONE_CONFIG[country] || PHONE_CONFIG['Other'];
  return cfg.pattern.test(phone.trim()) ? null : `Invalid format for ${country}. Example: ${cfg.hint}`;
}

function Section({ title, icon: Icon, delay = 0, action, children }) {
  return (
    <div className="glass-panel overflow-hidden animate-breathe" style={{ animationDelay: `${delay}s` }}>
      <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-white/50">
        <h3 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-400" /> {title}
        </h3>
        {action}
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{label}</label>
      {children}
    </div>
  );
}

function Input({ icon: Icon, readOnly, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input
        readOnly={readOnly}
        className={`w-full ${Icon ? 'pl-12' : 'px-5'} pr-5 py-4 rounded-2xl border font-bold text-navy-900 transition-all outline-none ${
          readOnly
            ? 'border-gray-100 bg-gray-100/50 text-gray-400 cursor-not-allowed'
            : 'border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-navy-900/10'
        }`}
        {...props}
      />
    </div>
  );
}

function SaveButton({ loading, onClick, label = 'Save Changes', variant = 'accent' }) {
  const styles = {
    accent: 'bg-lime-500 text-navy-900 hover:bg-lime-400 shadow-lime-500/20',
    navy: 'bg-navy-900 text-white hover:bg-navy-800 shadow-navy-900/10',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 ${styles[variant]}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {label}
    </button>
  );
}

export default function ClientSettingsPage() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const avatarInputRef = useRef(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const [orgData, setOrgData] = useState({ organization_name: '', service_needs: '' });
  const [profileData, setProfileData] = useState({ contact_person: '', phone: '', country: 'United States' });
  const [notifPrefs, setNotifPrefs] = useState({
    billing_alerts: true,
    subscription_reminders: true,
    patient_updates: false,
    weekly_digest: true,
  });

  // Load fresh user data on mount
  useEffect(() => {
    api.get('/auth/me').then(res => {
      const u = res.data.user;
      updateUser(u);
      setOrgData({
        organization_name: u.organization_name || '',
        service_needs: u.service_needs || '',
      });
      setProfileData({
        contact_person: u.contact_person || '',
        phone: u.phone || '',
        country: u.country || 'United States',
      });
      if (u.notification_prefs) setNotifPrefs(u.notification_prefs);
    }).catch(() => {
      if (user) {
        setOrgData({ organization_name: user.organization_name || '', service_needs: user.service_needs || '' });
        setProfileData({ contact_person: user.contact_person || '', phone: user.phone || '', country: user.country || 'United States' });
        if (user.notification_prefs) setNotifPrefs(user.notification_prefs);
      }
    });
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/organizations/upload-avatar', form, { headers: { 'Content-Type': null } });
      updateUser({ avatar_url: res.data.imageUrl });
      addToast('Profile photo updated', 'success');
    } catch {
      addToast('Failed to upload photo', 'error');
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleOrgSave = async () => {
    setSavingOrg(true);
    try {
      const res = await api.patch('/organizations/me', {
        organizationName: orgData.organization_name,
        serviceNeeds: orgData.service_needs,
      });
      updateUser({ organization_name: res.data.organization_name, service_needs: res.data.service_needs });
      addToast('Organization details saved', 'success');
    } catch {
      addToast('Failed to save organization details', 'error');
    } finally {
      setSavingOrg(false);
    }
  };

  const handleProfileSave = async () => {
    const err = validatePhone(profileData.phone, profileData.country);
    if (err) { setPhoneError(err); return; }
    setPhoneError(null);
    setSavingProfile(true);
    try {
      const res = await api.patch('/auth/profile', {
        contactPerson: profileData.contact_person,
        phone: profileData.phone,
        country: profileData.country,
      });
      updateUser(res.data.user);
      addToast('Profile updated', 'success');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleNotifSave = async () => {
    setSavingNotifs(true);
    try {
      const res = await api.patch('/auth/profile', { notificationPrefs: notifPrefs });
      updateUser(res.data.user);
      addToast('Notification preferences saved', 'success');
    } catch {
      addToast('Failed to save notification preferences', 'error');
    } finally {
      setSavingNotifs(false);
    }
  };

  const avatarSrc = avatarPreview || user?.avatar_url;
  const initials = user
    ? (user.organization_name || user.contact_person || 'P').slice(0, 2).toUpperCase()
    : 'PR';

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Settings" subtitle="Manage your organization profile, account, and preferences" />

      <main className="p-4 md:p-8 max-w-[1000px] mx-auto space-y-8">

        {/* Avatar + quick info */}
        <div className="glass-panel p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-[1.5rem] bg-navy-900 text-lime-400 flex items-center justify-center text-2xl font-black overflow-hidden shadow-xl shadow-navy-900/20">
              {avatarSrc
                ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                : initials
              }
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-lime-500 text-navy-900 rounded-xl flex items-center justify-center shadow-lg hover:bg-lime-400 transition-colors disabled:opacity-50"
            >
              {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black text-navy-900 tracking-tight">{user?.organization_name || '—'}</h2>
            <p className="text-gray-400 font-medium text-sm mt-1">{user?.email}</p>
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {user?.role || 'client'}
              </span>
              {user?.created_at && (
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Member since {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Organization */}
        <Section
          title="Organization Profile"
          icon={Building2}
          delay={0.1}
          action={<SaveButton loading={savingOrg} onClick={handleOrgSave} />}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Organization Name">
                <Input
                  value={orgData.organization_name}
                  onChange={e => setOrgData({ ...orgData, organization_name: e.target.value })}
                  placeholder="ACME Healthcare"
                />
              </Field>
              <Field label="Contact Email (read-only)">
                <Input icon={Mail} value={user?.email || ''} readOnly />
              </Field>
            </div>
            <Field label="Service Needs Description">
              <textarea
                value={orgData.service_needs}
                onChange={e => setOrgData({ ...orgData, service_needs: e.target.value })}
                rows={3}
                placeholder="Describe the healthcare services your organization requires..."
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-navy-900/10 transition-all font-bold text-navy-900 outline-none resize-none placeholder:font-medium placeholder:text-gray-400"
              />
            </Field>
          </div>
        </Section>

        {/* Personal Account */}
        <Section
          title="Personal Account"
          icon={UserIcon}
          delay={0.2}
          action={<SaveButton loading={savingProfile} onClick={handleProfileSave} variant="navy" label="Update Profile" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Account Holder Name">
              <Input
                icon={UserIcon}
                value={profileData.contact_person}
                onChange={e => setProfileData({ ...profileData, contact_person: e.target.value })}
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Country / Region">
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={profileData.country}
                  onChange={e => {
                    setProfileData({ ...profileData, country: e.target.value, phone: '' });
                    setPhoneError(null);
                  }}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-navy-900/10 transition-all font-bold text-navy-900 outline-none appearance-none"
                >
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </Field>
            <Field label="Primary Phone">
              <div className="space-y-1.5">
                <div className={`flex items-center rounded-2xl border transition-all bg-gray-50/50 focus-within:bg-white focus-within:ring-2 ${phoneError ? 'border-red-300 focus-within:ring-red-200' : 'border-gray-100 focus-within:ring-navy-900/10'}`}>
                  {PHONE_CONFIG[profileData.country]?.dialCode && (
                    <span className="pl-4 pr-2 py-4 text-sm font-black text-navy-900/40 shrink-0 border-r border-gray-100 select-none">
                      {PHONE_CONFIG[profileData.country].dialCode}
                    </span>
                  )}
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={e => {
                        setProfileData({ ...profileData, phone: e.target.value });
                        if (phoneError) setPhoneError(validatePhone(e.target.value, profileData.country));
                      }}
                      onBlur={e => setPhoneError(validatePhone(e.target.value, profileData.country))}
                      placeholder={(PHONE_CONFIG[profileData.country] || PHONE_CONFIG['Other']).hint}
                      className="w-full pl-11 pr-4 py-4 bg-transparent font-bold text-navy-900 outline-none placeholder:font-medium placeholder:text-gray-400"
                    />
                  </div>
                </div>
                {phoneError && (
                  <p className="text-[11px] font-bold text-red-500 pl-1">{phoneError}</p>
                )}
              </div>
            </Field>
          </div>
        </Section>

        {/* Notification Preferences */}
        <Section
          title="Notification Preferences"
          icon={Bell}
          delay={0.3}
          action={<SaveButton loading={savingNotifs} onClick={handleNotifSave} label="Save Preferences" />}
        >
          <div className="space-y-4">
            {[
              { key: 'billing_alerts', label: 'Billing Alerts', desc: 'Payment confirmations and failed charge notices' },
              { key: 'subscription_reminders', label: 'Subscription Reminders', desc: 'Renewal reminders 7 days before billing' },
              { key: 'patient_updates', label: 'Patient Updates', desc: 'Notifications when patient records are modified' },
              { key: 'weekly_digest', label: 'Weekly Digest', desc: 'Summary of activity across your organization' },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {notifPrefs[key]
                    ? <Bell className="w-4 h-4 text-lime-500" />
                    : <BellOff className="w-4 h-4 text-gray-300" />
                  }
                  <div>
                    <p className="font-bold text-navy-900 text-sm">{label}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{desc}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${notifPrefs[key] ? 'bg-lime-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${notifPrefs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Security */}
        <Section title="Security & Privacy" icon={Shield} delay={0.4}>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-navy-900 text-sm">Account Password</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Last changed: unknown — update regularly for security.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-6 py-3 bg-navy-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-colors shrink-0"
              >
                Change Password
              </button>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Legal Agreements</p>
              <div className="space-y-2">
                {['Terms of Service', 'Telemedicine Consent', 'Medical Liability Disclaimer'].map(doc => (
                  <div key={doc} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-500 shrink-0" />
                    {doc} — accepted at registration
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

      </main>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  );
}
