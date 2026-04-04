'use client';

import { useDeferredValue, useEffect, useEffectEvent, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  CalendarClock,
  LoaderCircle,
  Mail,
  PenSquare,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  Activity,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  List,
  Sparkles
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';
import { useToast } from '@/context/ToastContext';

const VIEW_OPTIONS = [
  { value: 'all-staff', label: 'Grid View', icon: LayoutGrid },
  { value: 'doctor-profiles', label: 'Detailed Profiles', icon: ShieldCheck },
  { value: 'departments', label: 'By Dept.', icon: Building2 },
  { value: 'shift-management', label: 'Shift Table', icon: List },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'on_leave', label: 'On leave' },
  { value: 'inactive', label: 'Inactive' },
];

const EMPTY_FORM = {
  full_name: '',
  role_title: '',
  department: '',
  email: '',
  phone: '',
  shift_pattern: '',
  status: 'active',
  bio: '',
};

async function requestStaffRecords() {
  const response = await api.get('/staff');
  return response.data.staff || [];
}

function getInitials(fullName = '') {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'SM';
}

function Avatar({ member, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-xl rounded-v3xl' : 'w-12 h-12 text-sm rounded-2xl';

  if (member.avatar_url) {
    return (
      <div
        className={`${sizeClass} border-2 border-white shadow-xl bg-cover bg-center shrink-0`}
        style={{ backgroundImage: `url("${member.avatar_url}")` }}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} shrink-0 bg-gradient-to-br from-navy-900 to-indigo-800 text-white flex items-center justify-center font-black tracking-tight shadow-lg border-2 border-white/20`}
    >
      {getInitials(member.full_name)}
    </div>
  );
}

function StatusBadge({ status }) {
  const tone =
    status === 'active'
      ? 'bg-lime-50 text-lime-600 border-lime-100 shadow-[0_0_12px_rgba(132,204,22,0.1)]'
      : status === 'on_leave'
        ? 'bg-amber-50 text-amber-600 border-amber-100'
        : 'bg-gray-100 text-gray-400 border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${tone}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'active' ? 'bg-lime-500 animate-pulse' : 'bg-current'}`} />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, value, detail, accent = 'indigo' }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass-panel p-6 group cursor-default h-full flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-10 h-10 rounded-xl bg-${accent}-50 flex items-center justify-center border border-${accent}-100 transition-colors group-hover:bg-${accent}-500/10`}>
          <Icon className={`w-5 h-5 text-${accent}-600`} />
        </div>
        <Sparkles className="w-4 h-4 text-slate-200" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-3xl font-black text-navy-900 tracking-tighter">{value}</p>
          <p className="text-[10px] font-bold text-slate-400">{detail}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function StaffManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const currentView = searchParams.get('view') || 'all-staff';
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [actionId, setActionId] = useState('');

  const loadStaff = async () => {
    try {
      const records = await requestStaffRecords();
      startTransition(() => {
        setStaff(records);
      });
    } catch (err) {
      toast.error('Failed to sync intelligence pool');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStaff(); }, []);

  const handleViewChange = (v) => {
    const p = new URLSearchParams(searchParams);
    v === 'all-staff' ? p.delete('view') : p.set('view', v);
    router.replace(`${pathname}?${p.toString()}`);
  };

  const filteredStaff = staff.filter(s => {
    const qs = deferredSearchTerm.toLowerCase();
    const searchMatch = !qs || [s.full_name, s.role_title, s.department].some(v => v?.toLowerCase().includes(qs));
    const statusMatch = statusFilter === 'all' || s.status === statusFilter;
    const deptMatch = departmentFilter === 'all' || s.department === departmentFilter;
    return searchMatch && statusMatch && deptMatch;
  });

  const stats = [
    { label: 'Personnel Base', value: staff.length, detail: 'Total Staff registered', icon: Users, accent: 'indigo' },
    { label: 'Operational Hub', value: staff.filter(s => s.status === 'active').length, detail: 'Active & Deployed', icon: Activity, accent: 'lime' },
    { label: 'Shift Coverage', value: `${Math.round((staff.filter(s => s.shift_pattern).length / (staff.length || 1)) * 100)}%`, detail: 'Assigned Rotations', icon: CalendarClock, accent: 'blue' },
    { label: 'Growth Capacity', value: '88%', detail: 'Platform Scalability', icon: TrendingUp, accent: 'purple' },
  ];

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Staff Command" subtitle="Multi-tenant workforce and clinical resource management" />

      <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 pb-20">
        
        {/* Executive Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => (
            <SummaryCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Intelligence Filters & Toggle Row */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
           <div className="flex flex-wrap items-center gap-2 rounded-3xl bg-slate-50/50 border border-slate-100 p-2 overflow-x-auto">
              {VIEW_OPTIONS.map(opt => (
                <button 
                  key={opt.value}
                  onClick={() => handleViewChange(opt.value)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                    currentView === opt.value ? 'bg-navy-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-navy-900 hover:bg-white'
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.label}
                </button>
              ))}
           </div>

           <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search intelligence records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-3xl w-full sm:w-[320px] outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-200 transition-all text-sm font-bold text-navy-900 placeholder:text-slate-300"
                />
              </div>
              <button 
                onClick={() => { setEditingStaff(null); setFormState(EMPTY_FORM); setIsModalOpen(true); }}
                className="px-8 py-4 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3"
              >
                <UserPlus className="w-4 h-4" />
                Deploy Personnel
              </button>
           </div>
        </div>

        {/* Content Modules */}
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 flex flex-col items-center justify-center text-slate-400 font-black text-[10px] uppercase tracking-widest gap-4">
               <LoaderCircle className="w-10 h-10 animate-spin text-indigo-600" />
               Syncing Intelligence Records...
             </motion.div>
          ) : filteredStaff.length === 0 ? (
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-32 glass-panel flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-xl font-black text-navy-900 tracking-tight">No match found</h4>
                <p className="text-sm font-bold text-slate-400 mt-2">Adjust your filters to reveal hidden personnel.</p>
             </motion.div>
          ) : (
            <motion.div 
               key={currentView + searchTerm} 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
               {currentView === 'all-staff' && filteredStaff.map((member, i) => (
                 <motion.div 
                    key={member.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % 12) * 0.05 }}
                    className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-500 cursor-default"
                 >
                    <div className="flex justify-between items-start mb-8">
                       <Avatar member={member} size="lg" />
                       <StatusBadge status={member.status} />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-xl font-black text-navy-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{member.full_name}</h4>
                       <p className="text-[10px] font-black text-slate-400 tracking-[0.2em]">{member.role_title}</p>
                    </div>

                    <div className="mt-8 space-y-3">
                       <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                          <Building2 className="w-4 h-4 text-slate-300" />
                          <span className="text-xs font-bold text-navy-900">{member.department}</span>
                       </div>
                       <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                          <CalendarClock className="w-4 h-4 text-slate-300" />
                          <span className="text-xs font-bold text-navy-900 line-clamp-1">{member.shift_pattern || 'Operational flexibility'}</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-8">
                       <button className="p-4 bg-navy-900 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                          <PenSquare className="w-4 h-4" />
                       </button>
                       <button className="p-4 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all active:scale-95">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </motion.div>
               ))}

               {currentView === 'doctor-profiles' && filteredStaff.map((member, i) => (
                  <div key={member.id} className="col-span-full glass-panel p-10 flex flex-col lg:flex-row items-center lg:items-start gap-10">
                     <Avatar member={member} size="lg" />
                     <div className="flex-1 space-y-6 text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                           <div>
                              <h3 className="text-3xl font-black text-navy-900 tracking-tighter">{member.full_name}</h3>
                              <p className="text-[10px] font-black text-indigo-600 tracking-[0.3em] mt-2">{member.role_title} — {member.department}</p>
                           </div>
                           <StatusBadge status={member.status} />
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-4xl">{member.bio || 'Professional Intelligence Summary: Focuses on inter-departmental collaboration and B2B clinical excellence.'}</p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                           <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400"><Mail className="w-3.5 h-3.5" /> {member.email}</div>
                           <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400"><Phone className="w-3.5 h-3.5" /> {member.phone}</div>
                        </div>
                     </div>
                     <button className="px-6 py-4 bg-navy-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">Profile Insights</button>
                  </div>
               ))}

               {currentView === 'departments' && departmentSummaries.map((dept, i) => (
                 <motion.div 
                    key={dept.department}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-panel p-8 group border-transparent hover:border-indigo-100 transition-all"
                 >
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-indigo-600" />
                       </div>
                       <div className="px-3 py-1 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-full">
                          {dept.members.length} Personnel
                       </div>
                    </div>
                    <h4 className="text-xl font-black text-navy-900 tracking-tight uppercase mb-2">{dept.department}</h4>
                    <p className="text-xs font-bold text-slate-400 mb-8">{dept.members.filter(m => m.status === 'active').length} Active members currently deployed.</p>
                    
                    <div className="space-y-3">
                       {dept.members.slice(0, 3).map(m => (
                         <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-[10px] text-slate-300">
                               {getInitials(m.full_name)}
                            </div>
                            <span className="text-xs font-bold text-navy-900 truncate">{m.full_name}</span>
                         </div>
                       ))}
                    </div>

                    <button className="w-full mt-8 py-4 border border-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all">
                       View Resource Metrics
                    </button>
                 </motion.div>
               ))}

               {currentView === 'shift-management' && (
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="col-span-full glass-panel overflow-hidden"
                 >
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="bg-slate-50 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-10 py-6">Intelligence Profile</th>
                                <th className="px-10 py-6">Operation Base</th>
                                <th className="px-10 py-6">Rotation Shift</th>
                                <th className="px-10 py-6">Status Pool</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {filteredStaff.map(member => (
                               <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                                  <td className="px-10 py-6">
                                     <div className="flex items-center gap-4">
                                        <Avatar member={member} />
                                        <div>
                                           <p className="text-sm font-black text-navy-900 uppercase">{member.full_name}</p>
                                           <p className="text-[10px] font-bold text-slate-400 mt-0.5">{member.role_title}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-10 py-6">
                                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">{member.department}</span>
                                  </td>
                                  <td className="px-10 py-6">
                                     <div className="flex items-center gap-2 text-xs font-black text-navy-900">
                                        <CalendarClock className="w-4 h-4 text-slate-200" />
                                        {member.shift_pattern || 'FLEXIBLE'}
                                     </div>
                                  </td>
                                  <td className="px-10 py-6">
                                     <StatusBadge status={member.status} />
                                  </td>
                                  <td className="px-10 py-6 text-right">
                                     <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-navy-900 hover:text-indigo-600 transition-colors"><PenSquare className="w-4 h-4" /></button>
                                        <button className="text-slate-300 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                     </div>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </motion.div>
               )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Personnel Deployment">
         <div className="p-8 text-center text-slate-400 font-bold">Record Interface Ready...</div>
      </Modal>
    </div>
  );
}
