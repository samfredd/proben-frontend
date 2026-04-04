'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Activity,
  FileText,
  Download,
  User,
  AlertCircle,
  Building2
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

export default function AdminPatientDetailPage() {
  const { id: clientId, patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, orgsRes] = await Promise.all([
          api.get(`/patients/mngmnt/client/${clientId}/patient/${patientId}`),
          api.get('/organizations'),
        ]);
        setPatient(patientRes.data);
        const found = orgsRes.data.find(o => o.id === clientId);
        setClientInfo(found);
      } catch (err) {
        setError(err.message || 'Failed to load patient details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId, patientId]);

  const clientName = clientInfo?.organization_name || clientInfo?.name || 'Client';

  if (loading) {
    return (
      <div className="flex-1 bg-[#fcfdfe] min-h-screen flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex-1 bg-[#fcfdfe] min-h-screen">
        <DashboardHeader title="Error" subtitle="Could not load patient" />
        <div className="p-8 max-w-[900px] mx-auto">
          <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] flex items-center gap-4">
            <AlertCircle className="w-8 h-8 shrink-0" />
            <div>
              <p className="font-bold">Patient not found</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
          <Link href={`/mngmnt/clients/${clientId}/patients`} className="mt-6 inline-flex items-center gap-2 font-bold text-sm text-gray-400 hover:text-navy-900 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader
        title={`${patient.first_name} ${patient.last_name}`}
        subtitle="Admin read-only view of patient record"
      />

      <main className="p-8 max-w-[1200px] mx-auto text-navy-900 space-y-8">

        <Link
          href={`/mngmnt/clients/${clientId}/patients`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-navy-900 font-bold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to {clientName}
        </Link>

        {/* Client Banner */}
        {clientInfo && (
          <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 text-sm font-bold w-fit">
            <Building2 className="w-4 h-4" />
            Uploaded by: {clientName}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Patient Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white border border-gray-50 shadow-sm rounded-[2.5rem] p-8">
              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8">
                {patient.profile_picture_url ? (
                  <img
                    src={patient.profile_picture_url}
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-3xl shrink-0">
                    {patient.first_name[0]}{patient.last_name[0]}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-black text-navy-900 leading-tight">
                    {patient.first_name} {patient.last_name}
                  </h2>
                  {patient.blood_type && (
                    <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                      {patient.blood_type}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="font-medium text-navy-900">{patient.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="font-medium text-navy-900">{patient.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Birth</p>
                    <p className="font-medium text-navy-900">
                      {patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Added On</p>
                    <p className="font-medium text-navy-900">{new Date(patient.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </section>

            {patient.medical_history && (
              <section className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-4 text-amber-700">
                  <Activity className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Medical History</h3>
                </div>
                <p className="text-amber-900/80 leading-relaxed font-medium whitespace-pre-wrap">
                  {patient.medical_history}
                </p>
              </section>
            )}
          </div>

          {/* Documents Section */}
          <div className="lg:col-span-2">
            <section className="bg-white border border-gray-50 shadow-sm rounded-[2.5rem] p-8 h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-navy-900">Clinical Documents</h3>
                <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-sm font-bold">
                  {patient.documents?.length || 0} Files
                </span>
              </div>

              {(!patient.documents || patient.documents.length === 0) ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem]">
                  <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="font-bold text-navy-900">No documents uploaded</p>
                  <p className="text-sm text-gray-400 mt-1">This patient has no clinical records attached yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patient.documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-navy-900">{doc.file_name}</p>
                          <p className="text-xs text-gray-400 font-medium">
                            Uploaded on {new Date(doc.uploaded_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-navy-900 hover:border-navy-900 transition-all shadow-sm"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
