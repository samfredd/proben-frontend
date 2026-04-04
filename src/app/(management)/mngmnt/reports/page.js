'use client';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { BarChart3, TrendingUp, Users, ShieldCheck } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="System Reports" subtitle="High-level analytics and business metrics" />
      
      <main className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-8 flex flex-col items-center justify-center text-center min-h-[300px] animate-breathe" style={{ animationDelay: '0.2s' }}>
             <div className="w-16 h-16 rounded-full bg-lime-50 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-lime-600" />
             </div>
             <h3 className="text-xl font-black text-navy-900 tracking-tight">Revenue by Month</h3>
             <p className="text-gray-500 text-sm mt-3 font-medium max-w-sm">Detailed revenue charting will be available as more payment data is captured. (MVP Placeholder)</p>
          </div>
          
          <div className="glass-panel p-8 flex flex-col items-center justify-center text-center min-h-[300px] animate-breathe" style={{ animationDelay: '0.6s' }}>
             <div className="w-16 h-16 rounded-full bg-lime-50 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-lime-600" />
             </div>
             <h3 className="text-xl font-black text-navy-900 tracking-tight">Client Acquisition</h3>
             <p className="text-gray-500 text-sm mt-3 font-medium max-w-sm">Client growth trends and active onboarding metrics will populate here.</p>
          </div>
          
          <div className="glass-panel p-8 flex flex-col items-center justify-center text-center min-h-[300px] md:col-span-2 animate-breathe" style={{ animationDelay: '1s' }}>
             <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-purple-500" />
             </div>
             <h3 className="text-xl font-black text-navy-900 tracking-tight">Plan Performance</h3>
             <p className="text-gray-500 text-sm mt-3 font-medium max-w-md">Breakdown of the top performing subscription plans (e.g. Telehealth Strategy vs Compliance Retainer).</p>
          </div>
        </div>
      </main>
    </div>
  );
}
