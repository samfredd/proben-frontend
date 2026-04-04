'use client';
import { useState } from 'react';
import { 
  UserSquare2, 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone, 
  Star,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Clock
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { motion, AnimatePresence } from 'framer-motion';

export default function StaffManagementPage() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'all-staff';
  
  const [staff] = useState([
    { id: 1, name: 'Dr. Sarah Smith', role: 'Senior Consultant', department: 'Cardiology', rating: 4.9, status: 'Active', image: 'https://i.pravatar.cc/150?u=sarah', contact: 'sarah.s@proben.com', shifts: 'Mon-Fri' },
    { id: 2, name: 'Dr. James Wilson', role: 'Associate Doctor', department: 'Neurology', rating: 4.7, status: 'On Leave', image: 'https://i.pravatar.cc/150?u=james', contact: 'james.w@proben.com', shifts: 'Tues-Sat' },
    { id: 3, name: 'Dr. Emily Brown', role: 'Staff Physician', department: 'Pediatrics', rating: 4.8, status: 'Active', image: 'https://i.pravatar.cc/150?u=emily', contact: 'emily.b@proben.com', shifts: 'Mon-Thurs' },
    { id: 4, name: 'Dr. Michael Scott', role: 'Consultant', department: 'General Medicine', rating: 4.5, status: 'Active', image: 'https://i.pravatar.cc/150?u=michael', contact: 'michael.s@proben.com', shifts: 'Fri-Sun' },
    { id: 5, name: 'Nursing Lead Anna', role: 'Head Nurse', department: 'Operations', rating: 5.0, status: 'Shift End', image: 'https://i.pravatar.cc/150?u=anna', contact: 'anna.l@proben.com', shifts: 'Night Shift' },
  ]);

  const StaffGrid = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search staff by name, department..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-white focus:ring-2 focus:ring-navy-900 outline-none transition-all font-medium text-sm shadow-sm"
          />
        </div>
        <button className="w-full md:w-auto px-6 py-3 rounded-2xl bg-navy-900 text-white hover:bg-navy-800 flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg shadow-navy-900/10">
          <Plus className="w-4 h-4" />
          Onboard New Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white rounded-[2rem] border border-gray-50 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-gray-50 relative">
                <img src={member.image} alt={member.name} className="object-cover w-full h-full" />
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                  member.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-xl transition-all">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-black text-navy-900 tracking-tight">{member.name}</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Stethoscope className="w-3 h-3" />
                {member.department}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Role</div>
                <div className="text-xs font-black text-navy-800">{member.role}</div>
              </div>
              <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Rating</div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-navy-800">{member.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-3 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-all flex items-center justify-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email
              </button>
              <button className="flex-1 py-3 rounded-xl border border-gray-100 bg-white text-xs font-bold text-navy-900 hover:bg-gray-50 transition-all">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfilesView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      {staff.map(member => (
        <div key={member.id} className="bg-white rounded-[2.5rem] border border-gray-50 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start group hover:border-blue-100 transition-all">
          <div className="w-32 h-32 rounded-[2rem] overflow-hidden shrink-0 border-4 border-gray-50 shadow-sm">
            <img src={member.image} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-black text-navy-900 tracking-tight">{member.name}</h3>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">{member.role} • {member.department}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase text-gray-500">
                <Mail className="w-3.5 h-3.5" /> {member.contact}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase text-gray-500">
                <Clock className="w-3.5 h-3.5" /> {member.shifts}
              </div>
              <div className="flex items-center gap-1 px-4 py-2 bg-amber-50 rounded-xl text-[10px] font-black uppercase text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {member.rating} Verified
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
              Specialized in advanced {member.department.toLowerCase()} procedures with over 12 years of clinical experience. 
              Consistently rated as top-tier in patient satisfaction and clinical efficiency.
            </p>
          </div>
          <button className="px-8 py-4 bg-navy-900 text-white rounded-2xl font-black text-sm hover:bg-navy-800 transition-all self-center shadow-lg shadow-navy-900/10">Manage Access</button>
        </div>
      ))}
    </div>
  );

  const DepartmentsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-700">
      {['Cardiology', 'Neurology', 'Pediatrics', 'General Medicine', 'Operations', 'Radiology', 'Oncology', 'Emergency'].map((dept, i) => (
        <div key={dept} className="bg-white rounded-[2rem] border border-gray-50 p-8 shadow-sm hover:translate-y-[-4px] transition-all cursor-pointer group">
          <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${i % 3 === 0 ? 'bg-blue-50 text-blue-500' : i % 3 === 1 ? 'bg-purple-50 text-purple-500' : 'bg-rose-50 text-rose-500'}`}>
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-black text-navy-900 mb-2 truncate">{dept}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{(Math.random() * 20 + 5).toFixed(0)} Practitioners</p>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(j => (
              <div key={j} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                <img src={`https://i.pravatar.cc/100?u=${dept}${j}`} />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-400">+5</div>
          </div>
        </div>
      ))}
    </div>
  );

  const ShiftView = () => (
    <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-xl font-bold text-navy-900 tracking-tight">Active Shift Roster</h3>
        <button className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl">Generate Schedule</button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
            <th className="px-8 py-5">Practitioner</th>
            <th className="px-8 py-5">Role</th>
            <th className="px-8 py-5">Shift Pattern</th>
            <th className="px-8 py-5">Assigned Area</th>
            <th className="px-8 py-5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {staff.map(member => (
            <tr key={member.id} className="hover:bg-gray-50/30 transition-all group">
              <td className="px-8 py-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100">
                  <img src={member.image} className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-black text-navy-900">{member.name}</div>
              </td>
              <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase">{member.role}</td>
              <td className="px-8 py-6 text-xs font-black text-navy-800 tracking-tighter">{member.shifts}</td>
              <td className="px-8 py-6 text-xs font-bold text-blue-600">{member.department}</td>
              <td className="px-8 py-6">
                 <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {member.status}
                 </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="Staff Management" subtitle="Manage medical practitioners and hospital staff" />
      
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto text-navy-900">
        <AnimatePresence mode="wait">
          {currentView === 'doctor-profiles' && (
            <motion.div key="profiles" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ProfilesView />
            </motion.div>
          )}
          {currentView === 'departments' && (
            <motion.div key="departments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <DepartmentsView />
            </motion.div>
          )}
          {currentView === 'shift-management' && (
            <motion.div key="shifts" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <ShiftView />
            </motion.div>
          )}
          {(currentView === 'all-staff' || !['doctor-profiles', 'departments', 'shift-management'].includes(currentView)) && (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StaffGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
