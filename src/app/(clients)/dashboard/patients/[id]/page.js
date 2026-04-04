'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, 
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  Activity,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Download,
  Edit,
  X,
  Plus
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';
import Link from 'next/link';

export default function PatientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef(null);

  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/patients/${id}`);
      setPatient(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch patient details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const startEditing = (section) => {
    setEditFormData({
      first_name: patient.first_name || '',
      last_name: patient.last_name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      dob: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '',
      blood_type: patient.blood_type || '',
      medical_history: patient.medical_history || ''
    });
    if (section === 'identity') setIsEditingIdentity(true);
    if (section === 'contact') setIsEditingContact(true);
    if (section === 'medical') setIsEditingMedical(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSave = async (section) => {
    try {
      setLoading(true);
      const formPayload = new FormData();
      Object.keys(editFormData).forEach(key => formPayload.append(key, editFormData[key]));
      if (profilePic && section === 'identity') {
        formPayload.append('profile_picture', profilePic);
      }
      
      await api.put(`/patients/${id}`, formPayload);

      setIsEditingIdentity(false);      setIsEditingContact(false);
      setIsEditingMedical(false);
      setProfilePic(null);
      fetchPatient();
    } catch (err) {
      setError(err.message || 'Failed to update patient.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadError('');
    setUploadSuccess('');
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    
    const formData = new FormData();
    formData.append('document', file);

    try {
      await api.post(`/patients/${id}/documents`, formData);
      setUploadSuccess('Document uploaded successfully!');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchPatient(); // refresh documents list
    } catch (err) {
      setUploadError(err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#fcfdfe] min-h-screen">
        <DashboardHeader title="Patient Details" subtitle="Loading patient information..." />
        <div className="flex justify-center p-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex-1 bg-[#fcfdfe] min-h-screen">
        <DashboardHeader title="Error" subtitle="Failed to retrieve patient" />
        <div className="p-8 max-w-[1600px] mx-auto">
          <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] flex items-center gap-4">
            <AlertCircle className="w-8 h-8" />
            <div>
               <h3 className="font-bold text-lg">Patient Not Found</h3>
               <p>{error}</p>
            </div>
          </div>
          <button 
            onClick={() => router.back()} 
            className="mt-6 px-6 py-3 bg-white border border-gray-100 rounded-xl font-bold text-navy-900 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title={`Patient: ${patient.first_name} ${patient.last_name}`} subtitle="View details and manage clinical documents" />
      
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto text-navy-900">
        
        <Link href="/dashboard/patients" className="inline-flex items-center text-navy-900/40 hover:text-navy-900 font-black text-[10px] uppercase tracking-[0.2em] transition-all group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Patient Identity Section */}
          <div className="lg:col-span-1 space-y-8">
            <section className="glass-panel p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              
              <AnimatePresence mode="wait">
                {!isEditingIdentity ? (
                  <motion.div 
                    key="view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex items-start justify-between mb-8 relative z-10">
                       <div className="flex items-center gap-6">
                         <div className="relative">
                            {patient.profile_picture_url ? (
                              <img 
                                src={patient.profile_picture_url} 
                                alt="Profile" 
                                className="w-20 h-20 rounded-[2rem] object-cover shadow-xl border-4 border-white"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-[2rem] bg-navy-900 text-lime-500 flex items-center justify-center font-black text-3xl shadow-inner">
                                {patient.first_name[0]}{patient.last_name[0]}
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-lime-500 rounded-full border-2 border-white" />
                         </div>
                         <div>
                           <h2 className="text-3xl font-black text-navy-900 leading-none tracking-tight">
                             {patient.first_name} <span className="text-lime-600 block">{patient.last_name}</span>
                           </h2>
                         </div>
                       </div>
                       <button 
                         onClick={() => startEditing('identity')}
                         className="p-3 bg-white hover:bg-lime-50 text-gray-400 hover:text-lime-600 rounded-xl transition-all shadow-sm border border-gray-100"
                       >
                          <Edit className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-50">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Blood Type</span>
                          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                             {patient.blood_type || 'Unknown'}
                          </span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date of Birth</span>
                          <span className="text-xs font-bold text-navy-900">{patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : 'N/A'}</span>
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="edit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 relative z-10"
                  >
                    <div className="flex items-center justify-between">
                       <h3 className="text-lg font-black text-navy-900 tracking-tight">Edit Identity</h3>
                       <button onClick={() => setIsEditingIdentity(false)} className="text-gray-400 hover:text-navy-900"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">First Name</label>
                             <input 
                                name="first_name" 
                                value={editFormData.first_name} 
                                onChange={handleEditChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-lime-500 outline-none text-xs font-bold"
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Name</label>
                             <input 
                                name="last_name" 
                                value={editFormData.last_name} 
                                onChange={handleEditChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-lime-500 outline-none text-xs font-bold"
                             />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Birth Date</label>
                          <input 
                             name="dob" 
                             type="date"
                             value={editFormData.dob} 
                             onChange={handleEditChange}
                             className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-lime-500 outline-none text-xs font-bold"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Profile Pic</label>
                          <input 
                             type="file" 
                             accept="image/*"
                             onChange={(e) => setProfilePic(e.target.files[0])}
                             className="w-full text-[10px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-lime-50 file:text-lime-600 hover:file:bg-lime-100"
                          />
                       </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                       <button onClick={() => setIsEditingIdentity(false)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                       <button onClick={() => handleSave('identity')} className="flex-2 px-6 py-3 bg-navy-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-navy-900/20 active:scale-95 transition-all">Save Changes</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Contact Information Section */}
            <section className="glass-panel p-8 relative group">
              <AnimatePresence mode="wait">
                {!isEditingContact ? (
                  <motion.div 
                    key="view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Details</h3>
                       <button onClick={() => startEditing('contact')} className="text-gray-400 hover:text-lime-600 transition-colors"><Edit className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-lime-50 group-hover:border-lime-100 transition-all">
                          <Mail className="w-5 h-5 text-gray-400 group-hover:text-lime-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</p>
                          <p className="text-sm font-bold text-navy-900 mt-0.5">{patient.email || 'No email provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-lime-50 group-hover:border-lime-100 transition-all">
                          <Phone className="w-5 h-5 text-gray-400 group-hover:text-lime-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</p>
                          <p className="text-sm font-bold text-navy-900 mt-0.5">{patient.phone || 'No phone provided'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="edit"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-navy-900">Edit Contact</h3>
                       <button onClick={() => setIsEditingContact(false)} className="text-gray-400 hover:text-navy-900"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                          <input 
                             name="email" 
                             value={editFormData.email} 
                             onChange={handleEditChange}
                             className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-lime-500 outline-none text-sm font-bold"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                          <input 
                             name="phone" 
                             value={editFormData.phone} 
                             onChange={handleEditChange}
                             className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-lime-500 outline-none text-sm font-bold"
                          />
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setIsEditingContact(false)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                       <button onClick={() => handleSave('contact')} className="flex-2 px-6 py-3 bg-navy-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-navy-900/20 active:scale-95 transition-all">Save</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Medical History Section */}
            <section className={`glass-panel p-8 relative group transition-all duration-500 ${isEditingMedical ? 'ring-2 ring-lime-500/20' : ''}`}>
               <AnimatePresence mode="wait">
                {!isEditingMedical ? (
                  <motion.div 
                    key="view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           <Activity className="w-4 h-4 text-lime-600" />
                           <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Clinical History</h3>
                        </div>
                        <button onClick={() => startEditing('medical')} className="text-gray-400 hover:text-lime-600 transition-colors"><Edit className="w-4 h-4" /></button>
                     </div>
                     <div className="p-5 bg-navy-900/5 rounded-2xl border border-navy-900/5">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-navy-900/5">
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Blood Type</span>
                           <span className="text-xs font-black text-navy-900 uppercase">{patient.blood_type || 'N/A'}</span>
                        </div>
                        <p className="text-sm font-medium text-navy-900/70 leading-relaxed whitespace-pre-wrap italic">
                          "{patient.medical_history || 'No medical history recorded for this patient.'}"
                        </p>
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="edit"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-navy-900">Edit Clinical Records</h3>
                       <button onClick={() => setIsEditingMedical(false)} className="text-gray-400 hover:text-navy-900"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Blood Type</label>
                          <select
                            name="blood_type"
                            value={editFormData.blood_type}
                            onChange={handleEditChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-lime-500 outline-none text-xs font-bold"
                          >
                            <option value="">Unknown</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Medical Notes</label>
                          <textarea 
                             name="medical_history" 
                             value={editFormData.medical_history} 
                             onChange={handleEditChange}
                             rows="5"
                             className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-lime-500 outline-none text-sm font-medium leading-relaxed"
                          />
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setIsEditingMedical(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                       <button onClick={() => handleSave('medical')} className="flex-2 px-8 py-4 bg-navy-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-navy-900/20 active:scale-95 transition-all">Save Records</button>
                    </div>
                  </motion.div>
                )}
               </AnimatePresence>
            </section>
          </div>

          {/* Documents Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upload Area */}
            <section className="glass-panel p-8 relative overflow-hidden group">
               <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-navy-900/5 rounded-full group-hover:scale-110 transition-transform duration-1000" />
               <div className="flex items-center gap-6 mb-8 relative z-10">
                 <div className="w-16 h-16 bg-lime-500/10 text-lime-600 rounded-3xl flex items-center justify-center shadow-inner border border-lime-500/20">
                   <Upload className="w-8 h-8" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-navy-900 tracking-tight">Clinical Archive</h3>
                   <p className="text-sm text-navy-900/40 font-medium">Attach digital records, lab results, and reports.</p>
                 </div>
               </div>

               <div className="flex flex-col md:flex-row gap-4 items-center relative z-10">
                 <input 
                   type="file" 
                   ref={fileInputRef}
                   onChange={handleFileChange}
                   className="flex-1 w-full px-6 py-4 rounded-2xl glass-panel focus:bg-white focus:ring-8 focus:ring-navy-900/5 outline-none text-[10px] font-black uppercase text-gray-400 file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-navy-900 file:text-white hover:file:opacity-90 transition-all cursor-pointer"
                 />
                 <button 
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full md:w-auto px-10 py-5 bg-lime-500 text-navy-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-lime-600 transition-all shadow-xl shadow-lime-500/10 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                 >
                   {uploading ? (
                     <div className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                     <>
                       <Plus className="w-4 h-4" />
                       Add to Archive
                     </>
                   )}
                 </button>
               </div>
               
               {uploadError && (
                  <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-red-100">
                    <AlertCircle className="w-4 h-4" /> {uploadError}
                  </div>
                )}
                {uploadSuccess && (
                  <div className="mt-6 p-4 bg-lime-50 text-lime-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-lime-100">
                    <CheckCircle2 className="w-4 h-4" /> {uploadSuccess}
                  </div>
                )}
            </section>

            {/* Documents List */}
            <section className="glass-panel p-8">
              <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-3">
                   <FileText className="w-5 h-5 text-gray-400" />
                   <h3 className="text-xl font-black text-navy-900 tracking-tight">Historical Records</h3>
                </div>
                <span className="px-5 py-2 bg-navy-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-navy-900/20">
                  {patient.documents?.length || 0} Records Found
                </span>
              </div>

              {(!patient.documents || patient.documents.length === 0) ? (
                <div className="text-center py-24 glass-panel border-dashed bg-transparent">
                  <FileText className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                  <p className="font-black text-navy-900/20 uppercase tracking-[0.2em] text-xs">No Records on File</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {patient.documents.map((doc, idx) => (
                    <motion.div 
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 8 }}
                      className="flex items-center justify-between p-6 rounded-3xl glass-panel hover:bg-white/80 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-navy-900 text-lime-500 flex items-center justify-center group-hover:scale-105 transition-all duration-500 shadow-xl">
                          <FileText className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-black text-navy-900 tracking-tight text-lg mb-1">{doc.file_name}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                             <Calendar className="w-3 h-3" />
                             <span>{new Date(doc.uploaded_at).toLocaleDateString()} at {new Date(doc.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 bg-white hover:bg-lime-500 border border-gray-100 rounded-2xl text-gray-400 hover:text-navy-900 hover:border-lime-500 transition-all shadow-sm group/btn"
                        title="Download Document"
                      >
                        <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
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
