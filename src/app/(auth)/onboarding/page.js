'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, ShieldCheck, Loader2, Users,
  Activity, FileText, Zap, ChevronRight, Sparkles,
  CreditCard, Lock, Eye, EyeOff, Mail, Phone, Globe,
  Building2, User as UserIcon, KeyRound,
} from 'lucide-react';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { getSubscriptionServices } from '@/utils/subscriptions';
import { getApiUrl } from '@/config/env';

// ─── Step definitions ─────────────────────────────────────────────────────────

const GUEST_STEPS  = ['account', 'legal', 'welcome', 'plan'];
const AUTH_STEPS   = ['welcome', 'plan'];

const STEP_LABELS = {
  account: 'Create Account',
  legal:   'Agreements',
  welcome: 'Welcome',
  plan:    'Choose a Plan',
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

const COUNTRIES = [
  'United States', 'Nigeria', 'United Kingdom', 'Canada',
  'Australia', 'South Africa', 'Ghana', 'Kenya', 'India', 'Other',
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, text: 'HIPAA-compliant infrastructure' },
  { icon: Lock,        text: 'End-to-end encrypted data' },
  { icon: Users,       text: 'Trusted by 500+ organisations' },
];

const PLATFORM_FEATURES = [
  { icon: Users,    title: 'Patient Management',   desc: 'Centralise records, history, and appointments.' },
  { icon: Activity, title: 'Care Coordination',    desc: 'Connect specialists, staff and patients in one flow.' },
  { icon: FileText, title: 'Billing & Compliance', desc: 'Automated invoicing and government-ready reports.' },
];

// ─── Slide animation ──────────────────────────────────────────────────────────

const slideVariants = {
  enter:  dir => ({ x: dir > 0 ?  40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   dir => ({ x: dir > 0 ? -40 :  40, opacity: 0 }),
};

// ─── Left panel ──────────────────────────────────────────────────────────────

function LeftPanel({ steps, currentStep }) {
  const idx = steps.indexOf(currentStep);
  return (
    <div
      className="hidden lg:flex flex-col justify-between h-full p-10 xl:p-14 bg-[#0a1128] text-white relative overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    >
      {/* Lime top accent rule */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#82C341]" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-14 pt-3">
          <div className="w-9 h-9 rounded-lg bg-[#82C341] flex items-center justify-center">
            <Image src="/logo.png" alt="Proben" width={20} height={20} className="object-contain brightness-0" />
          </div>
          <span className="font-black text-white text-lg tracking-tight">Proben</span>
        </div>

        {/* Step tracker */}
        <div className="space-y-1 mb-14">
          {steps.map((s, i) => {
            const done    = i < idx;
            const current = i === idx;
            return (
              <div key={s}>
                <div className="flex items-center gap-4 py-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-all duration-300 ${
                    done    ? 'bg-[#82C341] text-[#0a1128]' :
                    current ? 'bg-white text-[#0a1128]' :
                               'bg-white/10 text-white/30'
                  }`}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-bold transition-colors duration-300 ${
                    current ? 'text-white' : done ? 'text-[#82C341]' : 'text-white/30'
                  }`}>
                    {STEP_LABELS[s]}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`ml-4 w-px h-4 transition-colors duration-300 ${i < idx ? 'bg-[#82C341]/40' : 'bg-white/10'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {TRUST_ITEMS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-white/50 font-medium">
              <Icon className="w-4 h-4 text-[#82C341] shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2">
        {[
          { value: '500+',  label: 'Organisations' },
          { value: '98.9%', label: 'Uptime SLA' },
          { value: '24/7',  label: 'Support' },
          { value: '100%',  label: 'HIPAA Compliant' },
        ].map(({ value, label }) => (
          <div key={label} className="border border-white/10 rounded-lg p-4">
            <p className="text-lg font-black text-[#82C341] tracking-tight">{value}</p>
            <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step: Account ────────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ icon: Icon, type = 'text', error, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className={`flex items-center rounded-2xl border transition-all bg-gray-50/80 focus-within:bg-white focus-within:ring-2 ${error ? 'border-red-300 focus-within:ring-red-200' : 'border-gray-200 focus-within:border-[#0a1128] focus-within:ring-[#0a1128]/8'}`}>
      {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0 ml-4" />}
      <input
        type={isPassword && show ? 'text' : type}
        className="flex-1 px-3 py-3.5 bg-transparent font-bold text-[#0a1128] text-sm outline-none placeholder:font-medium placeholder:text-gray-400"
        {...props}
      />
      {isPassword && (
        <button type="button" onClick={() => setShow(v => !v)} className="mr-3 text-gray-400 hover:text-[#0a1128] transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

function AccountStep({ initialEmail, onNext }) {
  const [form, setForm] = useState({
    organizationName: '', contactPerson: '',
    email: initialEmail || '', phone: '',
    country: 'United States', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.organizationName.trim()) e.organizationName = 'Required';
    if (!form.contactPerson.trim())    e.contactPerson    = 'Required';
    if (!form.email.trim())            e.email            = 'Required';
    if (!form.phone.trim())            e.phone            = 'Required';
    if (!form.password || form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    const { confirmPassword, ...payload } = form;
    onNext(payload);
  };

  return (
    <div className="max-w-lg mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#0a1128] tracking-tight mb-2">Create your account</h2>
        <p className="text-gray-500 font-medium text-sm">Set up your organisation profile to get started.</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Organization Name">
            <TextInput icon={Building2} value={form.organizationName} onChange={e => set('organizationName', e.target.value)} placeholder="ACME Healthcare" error={errors.organizationName} />
            {errors.organizationName && <p className="text-[11px] text-red-500 font-bold pl-1">{errors.organizationName}</p>}
          </Field>
          <Field label="Contact Person">
            <TextInput icon={UserIcon} value={form.contactPerson} onChange={e => set('contactPerson', e.target.value)} placeholder="Jane Doe" error={errors.contactPerson} />
            {errors.contactPerson && <p className="text-[11px] text-red-500 font-bold pl-1">{errors.contactPerson}</p>}
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Work Email">
            <TextInput icon={Mail} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin@acme.com" error={errors.email} />
            {errors.email && <p className="text-[11px] text-red-500 font-bold pl-1">{errors.email}</p>}
          </Field>
          <Field label="Phone Number">
            <TextInput icon={Phone} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" error={errors.phone} />
            {errors.phone && <p className="text-[11px] text-red-500 font-bold pl-1">{errors.phone}</p>}
          </Field>
        </div>

        <Field label="Country">
          <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0a1128]/8 focus-within:border-[#0a1128] transition-all">
            <Globe className="w-4 h-4 text-gray-400 shrink-0 ml-4" />
            <select
              value={form.country}
              onChange={e => set('country', e.target.value)}
              className="flex-1 px-3 py-3.5 bg-transparent font-bold text-[#0a1128] text-sm outline-none appearance-none"
            >
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Password">
            <TextInput icon={KeyRound} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 characters" error={errors.password} />
            {errors.password && <p className="text-[11px] text-red-500 font-bold pl-1">{errors.password}</p>}
          </Field>
          <Field label="Confirm Password">
            <TextInput icon={KeyRound} type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat your password" error={errors.confirmPassword} />
            {errors.confirmPassword && <p className="text-[11px] text-red-500 font-bold pl-1">{errors.confirmPassword}</p>}
          </Field>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="mt-8 w-full py-4 bg-[#0a1128] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#82C341] hover:text-[#0a1128] transition-all shadow-sm group"
      >
        Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="mt-5 text-center text-sm font-medium text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-[#0a1128] font-bold hover:underline underline-offset-4">Sign In</Link>
      </p>
    </div>
  );
}

// ─── Step: Legal ──────────────────────────────────────────────────────────────

const AGREEMENTS = [
  { id: 'agreedTos',                   label: 'I accept the Terms of Service' },
  { id: 'agreedTelemedicineConsent',    label: 'I acknowledge the Telemedicine Consent' },
  { id: 'agreedMedicalLiability',       label: 'I accept the Medical Liability Disclaimer' },
];

function LegalStep({ accountData, onSuccess }) {
  const { loginWithData } = useAuth();
  const [agreed, setAgreed] = useState({ agreedTos: false, agreedTelemedicineConsent: false, agreedMedicalLiability: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allAgreed = Object.values(agreed).every(Boolean);

  const handleSubmit = async () => {
    if (!allAgreed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...accountData, ...agreed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      loginWithData(data.user, data.token);
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#0a1128] tracking-tight mb-2">Required agreements</h2>
        <p className="text-gray-500 font-medium text-sm">Please review and accept the following before creating your account.</p>
      </div>

      {error && (
        <div className="mb-6 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-3 mb-8">
        {AGREEMENTS.map(({ id, label }) => (
          <label key={id} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${agreed[id] ? 'border-[#82C341] bg-[#82C341]/5' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreed[id] ? 'bg-[#82C341] border-[#82C341]' : 'border-gray-300'}`}>
              {agreed[id] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={agreed[id]} onChange={e => setAgreed(a => ({ ...a, [id]: e.target.checked }))} />
            <span className="text-sm font-bold text-[#0a1128]/70">{label}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allAgreed || loading}
        className="w-full py-4 bg-[#0a1128] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#82C341] hover:text-[#0a1128] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0a1128] disabled:hover:text-white group"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account…</> : <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
      </button>
    </div>
  );
}

// ─── Step: Welcome ────────────────────────────────────────────────────────────

function WelcomeStep({ user, onNext }) {
  return (
    <div className="max-w-lg mx-auto w-full">
      <div className="inline-flex items-center gap-2 bg-[#82C341]/10 text-[#4a7a1e] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
        <Sparkles className="w-3.5 h-3.5" />
        Account created successfully
      </div>

      <h2 className="text-3xl font-black text-[#0a1128] tracking-tight leading-tight mb-3">
        Welcome{user?.organization_name ? `, ${user.organization_name}` : ' to Proben'}!
      </h2>
      <p className="text-gray-500 font-medium leading-relaxed mb-10 text-sm">
        Your workspace is ready. Activate a plan to unlock full access to everything below.
      </p>

      <div className="space-y-3 mb-10">
        {PLATFORM_FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-[#0a1128] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[#82C341]" />
            </div>
            <div>
              <p className="font-black text-[#0a1128] text-sm">{title}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 bg-[#0a1128] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#82C341] hover:text-[#0a1128] transition-all shadow-sm group"
      >
        View Plans & Pricing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

// ─── Step: Plan ───────────────────────────────────────────────────────────────

function PlanCard({ service, isPopular, isSelected, isLoading, onSelect }) {
  return (
    <div className={`relative flex flex-col rounded-2xl border transition-all duration-200 p-7 ${
      isPopular
        ? 'border-[#82C341] bg-[#0a1128] text-white'
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {isPopular && (
        <div className="absolute -top-3.5 left-6 bg-[#82C341] text-[#0a1128] px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
          Most Popular
        </div>
      )}

      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-5 ${isPopular ? 'bg-[#82C341]' : 'bg-gray-100'}`}>
        <Zap className={`w-4 h-4 ${isPopular ? 'text-[#0a1128]' : 'text-gray-500'}`} />
      </div>

      <h3 className={`text-lg font-black tracking-tight mb-1 ${isPopular ? 'text-white' : 'text-[#0a1128]'}`}>{service.name}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className={`text-2xl font-black ${isPopular ? 'text-white' : 'text-[#0a1128]'}`}>${parseFloat(service.price_usd).toFixed(0)}</span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${isPopular ? 'text-white/40' : 'text-gray-400'}`}>/mo</span>
      </div>

      {service.description && (
        <p className={`text-xs font-medium leading-relaxed mb-4 border-l-2 pl-3 ${isPopular ? 'text-white/50 border-white/20' : 'text-gray-400 border-gray-200'}`}>{service.description}</p>
      )}

      {service.benefits?.length > 0 && (
        <ul className="space-y-2 mb-6 flex-1">
          {service.benefits.slice(0, 4).map((b, i) => (
            <li key={i} className={`flex gap-2 text-xs font-bold ${isPopular ? 'text-white/70' : 'text-[#0a1128]/70'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#82C341] shrink-0 mt-0.5" />{b}
            </li>
          ))}
          {service.benefits.length > 4 && (
            <li className={`text-[9px] font-black uppercase tracking-widest pl-5 ${isPopular ? 'text-white/30' : 'text-gray-400'}`}>+{service.benefits.length - 4} more</li>
          )}
        </ul>
      )}

      <button
        onClick={() => onSelect(service.id)}
        disabled={isLoading}
        className={`w-full py-3.5 rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isPopular
            ? 'bg-[#82C341] text-[#0a1128] hover:bg-[#6fb032]'
            : 'bg-[#0a1128] text-white hover:bg-[#152040]'
        }`}
      >
        {isSelected && isLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Preparing…</> : <>Get Started <ChevronRight className="w-3.5 h-3.5" /></>}
      </button>
    </div>
  );
}

function PlanStep() {
  const [services, setServices]           = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedId, setSelectedId]       = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError]                 = useState(null);

  useEffect(() => {
    api.get('/services')
      .then(res => setServices(
        getSubscriptionServices(res.data || [])
          .sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd))
      ))
      .catch(() => setError('Could not load plans. Please refresh.'))
      .finally(() => setServicesLoading(false));
  }, []);

  const handleSelect = async (serviceId) => {
    setSelectedId(serviceId);
    setCheckoutLoading(true);
    setError(null);
    try {
      const res = await api.post('/subscriptions/checkout', { serviceId });
      if (res.data.checkoutUrl) window.location.href = res.data.checkoutUrl;
    } catch (err) {
      setError('Checkout failed: ' + (err.response?.data?.error || err.message));
      setSelectedId(null);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#0a1128] tracking-tight mb-1">Choose your plan</h2>
        <p className="text-gray-500 font-medium text-sm">Upgrade or cancel anytime. No long-term commitment.</p>
      </div>

      {error && <div className="mb-6 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">{error}</div>}

      {servicesLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#82C341] border-t-transparent" />
        </div>
      ) : (
        <div className={`grid gap-5 ${services.length === 1 ? 'grid-cols-1 max-w-xs' : services.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {services.map((service, i) => (
            <PlanCard
              key={service.id}
              service={service}
              isPopular={services.length > 1 && i === 1}
              isSelected={selectedId === service.id}
              isLoading={checkoutLoading}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-5 text-xs text-gray-400 font-medium">
        <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Secured by Paystack</div>
        <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Cancel anytime</div>
        <div className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> No hidden fees</div>
      </div>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

function OnboardingContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const steps     = user ? AUTH_STEPS : GUEST_STEPS;
  const [step, setStep]         = useState(null);
  const [dir, setDir]           = useState(1);
  const [accountData, setAccountData] = useState(null);

  // Resolve initial step once auth loads
  useEffect(() => {
    if (authLoading) return;
    setStep(user ? 'welcome' : 'account');
  }, [authLoading]);

  const goTo = (next) => {
    const cur = steps.indexOf(step);
    const nxt = steps.indexOf(next);
    setDir(nxt > cur ? 1 : -1);
    setStep(next);
  };

  if (!step) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#82C341] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] bg-white">
      <LeftPanel steps={steps} currentStep={step} />

      <div className="flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0a1128] flex items-center justify-center">
              <Image src="/logo.png" alt="Proben" width={18} height={18} className="object-contain brightness-0 invert" />
            </div>
            <span className="font-black text-[#0a1128] text-base">Proben</span>
          </div>
          {step !== 'account' && (
            <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#0a1128] transition-colors flex items-center gap-1">
              Skip <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </header>

        {/* Desktop skip */}
        <div className="hidden lg:flex justify-end px-10 pt-8">
          {step !== 'account' && (
            <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#0a1128] transition-colors flex items-center gap-1.5">
              Skip onboarding <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Step content */}
        <div className="flex-1 flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="w-full"
            >
              {step === 'account' && (
                <AccountStep
                  initialEmail={initialEmail}
                  onNext={(data) => { setAccountData(data); goTo('legal'); }}
                />
              )}
              {step === 'legal' && (
                <LegalStep
                  accountData={accountData}
                  onSuccess={() => goTo('welcome')}
                />
              )}
              {step === 'welcome' && (
                <WelcomeStep user={user} onNext={() => goTo('plan')} />
              )}
              {step === 'plan' && (
                <PlanStep />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer progress */}
        <div className="px-6 md:px-12 lg:px-16 py-5 border-t border-gray-100 flex items-center justify-between">
          {/* Back navigation */}
          {(() => {
            const idx = steps.indexOf(step);
            if (idx === 0) return (
              <Link href="/login" className="text-xs font-bold text-gray-400 hover:text-[#0a1128] transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Login
              </Link>
            );
            if (step === 'welcome' && !user) return <div />;
            return (
              <button
                type="button"
                onClick={() => goTo(steps[idx - 1])}
                className="text-xs font-bold text-gray-400 hover:text-[#0a1128] transition-colors flex items-center gap-1.5"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back
              </button>
            );
          })()}

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {steps.map((s, i) => {
              const cur = steps.indexOf(step);
              return (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    s === step ? 'w-8 bg-[#82C341]' : i < cur ? 'w-4 bg-[#82C341]/40' : 'w-4 bg-gray-200'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#82C341] border-t-transparent" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
