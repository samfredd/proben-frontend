'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Search,
  ChevronRight,
  Building2,
  Activity,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

export default function AdminPatientHub() {
  const [clients, setClients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients/mngmnt/by-client');
      setClients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (val) => {
    setSearchTerm(val);
    if (val.length < 2) {
      setSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const res = await api.get(`/patients/mngmnt/search?q=${encodeURIComponent(val)}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  // Stats
  const totalPatients = clients.reduce((acc, curr) => acc + parseInt(curr.patient_count || 0), 0);

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader
        title="Patient Records Hub"
        subtitle="Manage and discover clinical records across all registered organizations"
      />

      <main className="p-8 max-w-[1600px] mx-auto text-navy-900 space-y-12">
        
        {/* Search & High Level Stats */}
        <section className="relative z-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-navy-900">Search System Database</h2>
              <p className="text-gray-400 font-medium">Find any patient record across the entire platform instantly</p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-lime-500 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-25 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-navy-900/5 p-2">
                <div className="pl-6 pr-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by patient name, email, or organization..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full py-5 pr-6 outline-none font-bold text-lg text-navy-900 placeholder:text-gray-300"
                />
                {searching && (
                  <div className="pr-6">
                    <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-12 pt-4">
              <div className="text-center">
                <p className="text-3xl font-black text-navy-900">{clients.length}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Organizations</p>
              </div>
              <div className="h-10 w-px bg-gray-100 italic" />
              <div className="text-center">
                <p className="text-3xl font-black text-navy-900">{totalPatients}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Patients</p>
              </div>
            </div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {searchTerm.length >= 2 ? (
            <motion.section
              key="search-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-xl font-black text-navy-900">Search Results</h3>
                <span className="text-sm font-bold text-gray-400">{searchResults.length} Match{searchResults.length !== 1 ? 'es' : ''}</span>
              </div>

              {searchResults.length === 0 && !searching ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm">
                  <Activity className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                  <p className="text-lg font-black text-navy-900">No records found for "{searchTerm}"</p>
                  <p className="text-gray-400 font-medium">Try searching with a different keyword or organization name</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((patient) => (
                    <Link 
                      key={patient.id} 
                      href={`/mngmnt/clients/${patient.client_id}/patients/${patient.id}`}
                      className="group"
                    >
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-navy-900/5 hover:border-blue-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl shrink-0">
                            {patient.first_name[0]}{patient.last_name[0]}
                          </div>
                          <div>
                            <h4 className="font-black text-navy-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                              {patient.first_name} {patient.last_name}
                            </h4>
                            <p className="text-xs text-blue-500 font-bold flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" />
                              {patient.client_name}
                            </p>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-4">
                           <span>{patient.blood_type || 'N/A'}</span>
                           <span className="flex items-center gap-1 text-navy-900">
                             Open File <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                           </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.section>
          ) : (
            <motion.section
              key="client-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-navy-900 tracking-tight">Organizations with Records</h3>
                  <p className="text-gray-400 text-sm font-medium">Drill down into patients by their parent organization</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-navy-900">Live Database</span>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-50 h-64 rounded-[2rem] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clients.map((client) => (
                    <Link key={client.client_id} href={`/mngmnt/clients/${client.client_id}/patients`}>
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-navy-900/5 hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden">
                        {/* Decorative Background Icon */}
                        <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-navy-900/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 bg-navy-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-navy-900/20 group-hover:bg-blue-600 transition-colors">
                              {(client.client_name || 'O')[0].toUpperCase()}
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-black text-navy-900 block group-hover:text-blue-600 transition-colors">{client.patient_count}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Patient Records</span>
                            </div>
                          </div>

                          <h4 className="text-xl font-black text-navy-900 tracking-tight leading-tight mb-2 group-hover:translate-x-1 transition-transform">
                            {client.client_name || 'Unnamed Organization'}
                          </h4>
                          <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 uppercase tracking-widest text-[10px] font-black text-gray-400">
                             <div className="flex items-center gap-4">
                               <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {client.contact_person || 'N/A'}</span>
                             </div>
                             <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
