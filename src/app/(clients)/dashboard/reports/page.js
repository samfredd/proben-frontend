'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  ChevronRight,
  Activity,
  Calendar,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';

export default function ClientReports() {
  const [searchTerm, setSearchTerm] = useState('');

  const myReports = [
    { id: 1, title: 'October Health Summary', category: 'Monthly Review', date: 'Oct 20, 2026', size: '1.4 MB', status: 'final' },
    { id: 2, title: 'Annual Wellness Report', category: 'Annual Checkup', date: 'Jan 15, 2026', size: '3.2 MB', status: 'final' },
    { id: 3, title: 'Genetic Screening Results', category: 'Specialized Lab', date: 'Dec 10, 2025', size: '4.5 MB', status: 'final' },
    { id: 4, title: 'Physical Therapy Progress', category: 'Rehabilitation', date: 'Oct 05, 2026', size: '890 KB', status: 'draft' },
  ];

  return (
    <div className="flex-1 bg-transparent min-h-screen text-navy-900">
      <DashboardHeader title="My Health Reports" subtitle="Access your personalized medical summaries and clinical findings" />
      
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Banner */}
        <section className="glass-panel-dark bg-navy-900/40 p-12 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                 <h3 className="text-3xl font-black tracking-tight leading-tight uppercase">Your Health, Summarized.</h3>
                 <p className="text-white/60 font-medium mt-4">Download comprehensive PDF summaries of your clinical data to share with other providers or for your personal records.</p>
              </div>
              <button className="px-10 py-5 bg-white text-navy-900 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl shadow-white/10 flex items-center gap-3 shrink-0">
                 Request Master Report
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </section>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-navy-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl glass-panel focus:bg-white focus:ring-4 focus:ring-navy-900/5 outline-none font-medium text-navy-900 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-navy-900 hover:bg-gray-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Category
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-navy-900 text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10">
              <Calendar className="w-4 h-4" />
              2026 Reports
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <section className="glass-panel overflow-hidden animate-breathe" style={{ animationDelay: '0.4s' }}>
           <div className="p-8 border-b border-gray-50 bg-gray-50/20">
              <h3 className="text-xl font-bold text-navy-900 tracking-tight">Available Reports</h3>
           </div>
           <div className="overflow-x-auto text-navy-900">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Document</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Generated On</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myReports.map((report) => (
                    <tr key={report.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-gray-50">
                              <ClipboardList className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="font-bold text-navy-900 tracking-tight">{report.title}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{report.size}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-gray-200">
                           {report.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-navy-900 opacity-80">{report.date}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                           <ShieldCheck className="w-3 h-3 text-green-500" />
                           <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Verified</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-navy-900 border border-gray-100 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 ml-auto shadow-sm">
                           <Download className="w-4 h-4" />
                           <span className="text-xs font-bold uppercase tracking-widest pr-1">Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </section>
      </main>
    </div>
  );
}
