'use client';
import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Download,
  Filter,
  User,
  Activity,
  ChevronRight,
  ShieldCheck,
  History
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';

export default function AdminRecordsPage() {
  const [records] = useState([
    { id: 'REC-901', patient: 'Emma Wilson', doctor: 'Dr. Sarah Smith', date: '2023-10-15', status: 'finalized', type: 'Clinical Note' },
    { id: 'REC-902', patient: 'Michael Brown', doctor: 'Dr. James Wilson', date: '2023-10-18', status: 'pending', type: 'Lab Result' },
    { id: 'REC-903', patient: 'Sarah Davis', doctor: 'Dr. Emily Brown', date: '2023-10-12', status: 'finalized', type: 'Imaging' },
    { id: 'REC-904', patient: 'James Johnson', doctor: 'Dr. Michael Scott', date: '2023-10-20', status: 'finalized', type: 'Prescription' },
  ]);

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="System Health Records" subtitle="Audit and monitor global EHR data across all practitioners" />
      
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto text-navy-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search global records repository..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-white focus:ring-2 focus:ring-navy-900 outline-none transition-all font-medium text-sm shadow-sm"
            />
          </div>
          <button className="w-full md:w-auto px-6 py-3 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-sm">
            <ShieldCheck className="w-4 h-4 text-navy-900" />
            Audit Logs
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                  <th className="px-8 py-5">Record ID & Title</th>
                  <th className="px-8 py-5">Patient & Practitioner</th>
                  <th className="px-8 py-5">Created Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-navy-900">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-navy-900">{rec.id}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{rec.type}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-navy-900">{rec.patient}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">By {rec.doctor}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-medium">{new Date(rec.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        rec.status === 'finalized' ? 'bg-navy-900 text-white border-navy-900' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-3 hover:bg-gray-100 rounded-xl transition-all">
                         <History className="w-5 h-5 text-gray-400" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
