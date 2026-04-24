'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';
import { useSubscription } from '@/context/SubscriptionContext';
import DatePicker from '@/components/ui/DatePicker';

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isTrialing } = useSubscription();
  const TRIAL_PATIENT_LIMIT = 5;
  const trialLimitReached = isTrialing && patients.length >= TRIAL_PATIENT_LIMIT;
  
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Patient Management" subtitle="Manage your patients and upload new bulk records" />
      
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto text-navy-900">
        
        {/* Top Actions Banner */}
        <section className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl hover:shadow-lime-500/5 transition-all duration-500 group">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-lime-500/10 rounded-[2rem] flex items-center justify-center text-lime-600 shadow-inner border border-lime-500/20 shrink-0 group-hover:scale-105 transition-transform duration-500">
                 <Users className="w-10 h-10" />
              </div>
               <div>
                  <h3 className="text-2xl font-black text-navy-900 tracking-tight">Patient Directory</h3>
                  <p className="text-sm text-navy-900/50 mt-1 font-medium max-w-md">Access your complete patient database and manage clinical records.</p>
               </div>
           </div>
            <div className="flex gap-4 w-full md:w-auto">
              {trialLimitReached ? (
                <Link
                  href="/dashboard/payments"
                  className="px-10 py-5 bg-amber-400 text-navy-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Upgrade to Add More
                </Link>
              ) : (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-10 py-5 bg-navy-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add Patient
                </button>
              )}
            </div>
        </section>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-[450px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-lime-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-5 rounded-[1.5rem] glass-panel focus:bg-white focus:ring-8 focus:ring-navy-900/5 outline-none font-bold text-sm text-navy-900 transition-all shadow-sm placeholder:text-gray-400 placeholder:font-medium"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-white border border-gray-100 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-navy-900 hover:bg-gray-50 transition-all shadow-sm">
              <Filter className="w-4 h-4 text-gray-400" />
              Filter Records
            </button>
          </div>
        </div>

        {/* Patient Grid */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">No patients found</h3>
            <p className="text-gray-500">Add a patient record manually to get started.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient, index) => (
              <Link href={`/dashboard/patients/${patient.id}`} key={patient.id}>
                <motion.div 
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="glass-panel p-8 flex flex-col justify-between h-full hover:bg-white/60 transition-all duration-300 animate-breathe relative overflow-hidden group"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-lime-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      {patient.profile_picture_url ? (
                        <img 
                          src={patient.profile_picture_url} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-[1.25rem] object-cover shadow-sm border-2 border-white"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-[1.25rem] bg-navy-900 text-lime-500 flex items-center justify-center font-black text-xl shadow-inner">
                          {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                      )}
                      {patient.blood_type && (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                          {patient.blood_type}
                        </span>
                      )}
                    </div>
                    <h4 className="text-2xl font-black text-navy-900 tracking-tight leading-tight group-hover:text-lime-600 transition-colors">
                      {patient.first_name} {patient.last_name}
                    </h4>
                    <div className="mt-6 space-y-3 text-sm text-navy-900/60 font-bold">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                         <span className="truncate">{patient.email || 'No email provided'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-navy-900/20"></div>
                         <span>{patient.phone || 'No phone provided'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between relative z-10">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-navy-900 transition-colors">Patient Record</span>
                     <ChevronRight className="w-5 h-5 text-lime-600 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

      </main>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddPatientModal 
            onClose={() => setIsAddModalOpen(false)} 
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchPatients();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddPatientModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      return setError('First and last name are required.');
    }

    try {
      setLoading(true);
      setError('');
      
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => formPayload.append(key, formData[key]));
      
      await api.post('/patients', formPayload);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="glass-panel w-full max-w-2xl rounded-[3rem] shadow-[0_32px_120px_-20px_rgba(10,17,40,0.5)] overflow-y-auto max-h-[90vh] relative scrollbar-hide bg-white/90 p-1"
      >
        <div className="bg-white rounded-[2.8rem] h-full">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
           <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
             <Plus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-navy-900">Add New Patient</h2>
          <p className="text-gray-500 font-medium mt-2 mb-8">
            Enter the details to add a new patient record to your database.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-1">First Name *</label>
                <input 
                  type="text" 
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-1">Last Name *</label>
                <input 
                  type="text" 
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Doe"
                  required
                />
              </div>
             
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-1">Date of Birth</label>
                <DatePicker
                  value={formData.age}
                  onChange={(val) => setFormData({ ...formData, age: val })}
                />
              </div>
            
             
            </div>
            
            
            

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <div className="mt-8 flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-4 flex-1 rounded-2xl font-bold bg-gray-50 text-navy-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-4 flex-1 rounded-2xl font-bold bg-navy-900 text-white hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/10 disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Save Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
      </motion.div>
    </div>
  );
}

