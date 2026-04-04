'use client';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { BarChart3, PieChart, Activity, Zap } from 'lucide-react';

export default function AnalyticsShell() {
  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="Analytics" subtitle="Real-time system health and performance monitoring" />
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto text-navy-900">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm space-y-8 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-navy-900">Patient Demographics</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Live Feed Analysis</p>
              </div>
              <PieChart className="w-6 h-6 text-navy-900" />
            </div>
            <div className="h-64 bg-gray-50/50 rounded-[2rem] border border-gray-50 flex items-center justify-center text-gray-200">
              <BarChart3 className="w-16 h-16 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm space-y-8 hover:shadow-md transition-all">
             <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-navy-900">Clinical Throughput</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">System Load Analysis</p>
              </div>
              <Zap className="w-6 h-6 text-lime-600" />
            </div>
            <div className="h-64 bg-gray-50/50 rounded-[2rem] border border-gray-50 flex items-center justify-center text-gray-200">
              <Activity className="w-16 h-16 opacity-20" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
