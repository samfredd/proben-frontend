'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Search,
  ChevronRight,
  Building2,
  Activity
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

export default function AdminClientPatientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/patients/mngmnt/by-client');
        setClients(res.data);
      } catch (err) {
        console.error('Failed to fetch clients with patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filtered = clients.filter(c =>
    (c.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader
        title="Patient Records by Client"
        subtitle="Browse uploaded patient records for each organization"
      />

      <main className="p-8 max-w-[1600px] mx-auto text-navy-900 space-y-8">

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-navy-900/5 outline-none font-medium text-navy-900 transition-all shadow-sm"
            />
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {filtered.length} Organization{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">No organizations found</h3>
            <p className="text-gray-400 font-medium">No client organizations have been registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((client) => (
                <motion.div
                  key={client.client_id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/mngmnt/clients/${client.client_id}/patients`}>
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-navy-900/5 hover:border-blue-100 transition-all group h-full flex flex-col justify-between cursor-pointer">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                            {(client.client_name || 'O')[0].toUpperCase()}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                            client.status === 'active'
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : 'bg-gray-100 text-gray-400 border-gray-200'
                          }`}>
                            {client.status || 'active'}
                          </span>
                        </div>

                        <h3 className="text-xl font-black text-navy-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                          {client.client_name || 'Unnamed Organization'}
                        </h3>
                        {client.contact_person && (
                          <p className="text-sm text-gray-400 font-medium mt-1">{client.contact_person}</p>
                        )}
                        <p className="text-xs text-gray-400 font-medium mt-1 truncate">{client.email}</p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-bold">
                            {client.patient_count} Patient{client.patient_count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center text-blue-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
                          View Records <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </main>
    </div>
  );
}
