'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Search,
  ArrowLeft,
  User,
  FileText,
  Calendar,
  Activity,
  ChevronRight
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

export default function AdminClientPatientDetailsPage() {
  const { id: clientId } = useParams();
  const [patients, setPatients] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patients for this client
        const patientsRes = await api.get(`/patients/mngmnt/client/${clientId}`);
        setPatients(patientsRes.data);

        // Fetch client name from organizations endpoint
        const orgsRes = await api.get('/organizations');
        const found = orgsRes.data.find(o => o.id === clientId);
        setClientInfo(found);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  const filtered = patients.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clientName = clientInfo?.organization_name || clientInfo?.name || 'Client';

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader
        title={`${clientName} — Patients`}
        subtitle={`Viewing all ${patients.length} patient record(s) uploaded by this organization`}
      />

      <main className="p-8 max-w-[1600px] mx-auto text-navy-900 space-y-8">

        <Link
          href="/mngmnt/patients"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-navy-900 font-bold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Records Hub
        </Link>

        {/* Client Summary */}
        {clientInfo && (
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm p-6 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-2xl shrink-0">
              {(clientName)[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-navy-900">{clientName}</h2>
              <p className="text-gray-400 text-sm font-medium">{clientInfo.email}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-navy-900">{patients.length}</p>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Patients</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-navy-900/5 outline-none font-medium text-navy-900 transition-all shadow-sm"
          />
        </div>

        {/* Patient List */}
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">No patients found</h3>
            <p className="text-gray-400 font-medium">This client has not uploaded any patient records yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                    <th className="px-8 py-5">Patient</th>
                    <th className="px-8 py-5">Blood Type</th>
                    <th className="px-8 py-5">Date of Birth</th>
                    <th className="px-8 py-5">Documents</th>
                    <th className="px-8 py-5">Added On</th>
                    <th className="px-8 py-5 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((patient) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50/40 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          {patient.profile_picture_url ? (
                            <img
                              src={patient.profile_picture_url}
                              alt="Profile"
                              className="w-11 h-11 rounded-xl object-cover border border-gray-100 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                              {patient.first_name[0]}{patient.last_name[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-navy-900">
                              {patient.first_name} {patient.last_name}
                            </div>
                            <div className="text-xs text-gray-400 font-medium">{patient.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {patient.blood_type ? (
                          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                            {patient.blood_type}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-navy-900">
                        {patient.dob ? new Date(patient.dob).toLocaleDateString() : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                          <FileText className="w-4 h-4" />
                          {patient.doc_count || 0}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                        {new Date(patient.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link
                          href={`/mngmnt/clients/${clientId}/patients/${patient.id}`}
                          className="inline-flex p-3 hover:bg-gray-100 rounded-xl transition-all"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
