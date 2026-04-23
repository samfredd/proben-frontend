'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  ChevronRight,
  Eye,
  Calendar,
  Clock,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';

export default function ClientRecords() {
  const [searchTerm, setSearchTerm] = useState('');

  const myRecords = [
    { id: 'REC-2201', title: 'Operational Consulting Summary', date: 'Oct 15, 2026', type: 'Clinical Summary', doctor: 'Dr. Sarah Smith', status: 'verified' },
    { id: 'REC-2202', title: 'Internal Systems Audit Report', date: 'Oct 12, 2026', type: 'Audit Report', doctor: 'Admin Team', status: 'verified' },
    { id: 'REC-2203', title: 'Telehealth Setup Blueprint', date: 'Oct 08, 2026', type: 'Blueprint', doctor: 'Dr. James Wilson', status: 'verified' },
    { id: 'REC-2204', title: 'Compliance Milestone Alpha', date: 'Oct 05, 2026', type: 'Compliance', doctor: 'Dr. Emily Brown', status: 'pending' },
  ];

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="My Medical Records" subtitle="Secure access to your clinical history and health documents" />
      
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto text-navy-900">
        {/* Security Banner */}
        <section className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100 shrink-0">
                 <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-navy-900 tracking-tight">Your Data is Encrypted & Secure</h3>
                 <p className="text-sm text-navy-900/60 mt-1 font-medium">Only you and your authorized consultants can access these records. We use world-class AES-256 encryption.</p>
              </div>
           </div>
           <button className="px-8 py-4 bg-navy-900 text-white rounded-2xl font-bold text-sm hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10">
              Privacy Settings
           </button>
        </section>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-navy-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search your records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-navy-900/5 outline-none font-medium text-navy-900 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-navy-900 hover:bg-gray-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Type
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-navy-900 hover:bg-gray-50 transition-all shadow-sm">
              <Calendar className="w-4 h-4" />
              Date Range
            </button>
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myRecords.map((record) => (
            <motion.div 
              key={record.id}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm group hover:shadow-xl hover:shadow-navy-900/5 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 transition-all">
                   <FileText className="w-7 h-7" />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  record.status === 'verified' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                   <ShieldCheck className="w-3 h-3" />
                   {record.status}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-black text-navy-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors uppercase">{record.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2 italic">{record.type}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-[10px] font-black text-navy-900">
                      {record.doctor[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-900">{record.doctor}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{record.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-navy-900 border border-gray-100 transition-all shadow-sm">
                       <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-navy-900 rounded-xl text-white hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10">
                       <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Request Records Call to Action */}
        <section className="bg-navy-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-navy-900/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.03] rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h3 className="text-3xl font-black tracking-tight leading-tight uppercase">Need a Transfer of Records?</h3>
              <p className="text-white/60 font-medium mt-4">We can securely transfer your clinical data to other verified healthcare institutions or specialists within 24 hours.</p>
            </div>
            <button className="px-10 py-5 bg-white text-navy-900 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl shadow-white/10 group flex items-center gap-3 shrink-0">
              Request Transfer
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
