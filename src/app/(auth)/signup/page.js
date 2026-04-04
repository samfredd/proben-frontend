'use client';
import { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

function SignupContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const initialEmail = searchParams.get('email') || '';

  const [formData, setFormData] = useState({ 
    organizationName: '', 
    contactPerson: '',
    email: initialEmail, 
    phone: '',
    country: 'United States',
    serviceNeeds: '',
    password: '',
    agreedTos: false,
    agreedTelemedicineConsent: false,
    agreedMedicalLiability: false
  });
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signup(token ? { ...formData, token } : formData);
    if (!res.success) setError(res.error);
    setLoading(false);
  };

  return (
    <AuthLayout 
      title={token ? "Join Your Elite Medical Team" : "Partner with the Best in Healthcare"} 
      subtitle={token ? "Complete your profile to start collaborating with your organization." : "Register your healthcare organization and gain access to a global network of top-tier medical professionals."}
      imageSrc="/auth_visual_premium.png"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-left">
          <h2 className="text-4xl font-black text-navy-900 tracking-tight mb-3">
             {token ? 'Complete Your Join' : 'Partner Registration'}
          </h2>
          <p className="text-gray-500 font-medium">Join our network of healthcare excellence.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Organization Details */}
          {!token && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AuthInput
                        label="Organization Name"
                        icon="user"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                        placeholder="ACME Healthcare"
                        required
                    />
                    <AuthInput
                        label="Contact Person"
                        icon="user"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        placeholder="Jane Doe"
                        required
                    />
                </div>
            </div>
          )}

          {/* Section 2: Contact Info */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AuthInput
                    label="Work Email"
                    icon="mail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!!token}
                    placeholder="admin@acme.com"
                    required
                />
                {!token && (
                    <AuthInput
                        label="Phone Number"
                        icon="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 000-0000"
                        required
                    />
                )}
            </div>
            
            {!token && (
                <AuthInput
                    label="Country"
                    type="select"
                    icon="globe"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    options={[
                        { label: 'United States', value: 'United States' },
                        { label: 'Canada', value: 'Canada' },
                        { label: 'United Kingdom', value: 'United Kingdom' },
                        { label: 'Australia', value: 'Australia' },
                        { label: 'Other', value: 'Other' }
                    ]}
                    required
                />
            )}
          </div>

          {/* Section 3: Service Needs & Security */}
          <div className="space-y-6 pt-4 border-t border-gray-100">
            {!token && (
                <AuthInput
                    label="Service Needs Description"
                    type="textarea"
                    value={formData.serviceNeeds}
                    onChange={(e) => setFormData({...formData, serviceNeeds: e.target.value})}
                    placeholder="Briefly describe what services or roles your organization is looking to fill..."
                    required
                />
            )}
            
            <AuthInput
                label="Create Password"
                icon="lock"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Minimum 8 characters"
                required
            />
          </div>

          {/* Section 4: Agreements */}
          {!token && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
                <p className="text-[11px] font-black text-navy-900 uppercase tracking-widest opacity-70">Required Agreements</p>
                
                <div className="space-y-3">
                    {[
                        { id: 'agreedTos', label: 'I accept the Terms of Service', link: '#' },
                        { id: 'agreedTelemedicineConsent', label: 'I acknowledge the Telemedicine Consent', link: '#' },
                        { id: 'agreedMedicalLiability', label: 'I accept the Medical Liability Disclaimer', link: '#' }
                    ].map((agreement) => (
                        <label key={agreement.id} className="flex items-start gap-3 cursor-pointer group">
                             <div className="relative flex items-center mt-0.5">
                                <input 
                                    type="checkbox" 
                                    required 
                                    checked={formData[agreement.id]} 
                                    onChange={(e) => setFormData({...formData, [agreement.id]: e.target.checked})} 
                                    className="w-5 h-5 rounded border-gray-300 text-navy-900 focus:ring-navy-900/10 cursor-pointer" 
                                />
                             </div>
                            <span className="text-sm text-gray-500 group-hover:text-navy-900 transition-colors">
                                {agreement.label} <Link href={agreement.link} className="text-navy-900 font-bold hover:underline">Read Policy</Link>
                            </span>
                        </label>
                    ))}
                </div>
            </div>
          )}
          
          <AuthButton loading={loading}>
            {token ? 'Join Organization' : 'Register Organization'}
          </AuthButton>
        </form>
        
        <div className="text-center pt-4">
          <p className="text-sm font-medium text-gray-500">
            Already have an account? <Link href="/login" className="text-navy-900 font-bold hover:underline underline-offset-4 decoration-2">Sign In</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-500 border-t-transparent shadow-xl shadow-lime-500/20"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
