'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  FileText,
  Clock,
  Edit2,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';

const SPECIALISTS = [
  { name: 'Dr. Sarah Smith', department: 'Cardiology' },
  { name: 'Dr. James Wilson', department: 'Neurology' },
  { name: 'Dr. Emily Brown', department: 'Pediatrics' },
  { name: 'Dr. Michael Scott', department: 'General Medicine' },
  { name: 'Dr. Robert Chen', department: 'Radiology' },
  { name: 'Dr. Lisa Wong', department: 'Oncology' },
  { name: 'Dr. Kevin Adams', department: 'Emergency' }
];

const SERVICE_TO_DEPARTMENTS = {
  'Primary Care': ['General Medicine', 'Pediatrics'],
  'Specialist Consult': ['Cardiology', 'Neurology', 'Radiology', 'Oncology'],
  'Emergency': ['Emergency'],
  'Routine Checkup': ['General Medicine', 'Pediatrics'],
  'Follow-up': ['General Medicine', 'Pediatrics', 'Cardiology', 'Neurology']
};


export default function PatientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [bookingForm, setBookingForm] = useState({
    serviceType: 'Routine Checkup',
    preferredConsultant: '',
    bookingDate: '',
    bookingTime: '',
  });


  const [editForm, setEditForm] = useState({
    contact_person: '',
    organization_name: '',
    email: '',
    phone: '',
    country: '',
    status: 'active',
    blood_type: '',
    allergies: '',
    visit_type: '',
    image_url: ''
  });

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get('/organizations');
      const foundUser = res.data.find(u => u.id === id);

      if (!foundUser) {
        throw new Error('Patient not found');
      }

      const formattedPatient = {
        id: foundUser.id,
        name: foundUser.contact_person || 'Unknown Contact',
        organization: foundUser.name || 'Unknown Organization',
        email: foundUser.email,
        phone: foundUser.phone || 'N/A',
        country: foundUser.country || 'N/A',
        lastActivity: new Date(foundUser.last_activity).toLocaleDateString(),
        status: foundUser.status || 'active',
        image: foundUser.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.contact_person || 'U')}&background=0D1B2A&color=fff`,
        blood_type: foundUser.blood_type || 'Unknown',
        allergies: foundUser.allergies || 'None recorded',
        visit_type: foundUser.visit_type || 'Primary Care'
      };

      setPatient(formattedPatient);

      setEditForm({
        contact_person: foundUser.contact_person || '',
        organization_name: foundUser.name || '',
        email: foundUser.email || '',
        phone: foundUser.phone || '',
        country: foundUser.country || '',
        status: foundUser.status || 'active',
        blood_type: foundUser.blood_type || '',
        allergies: foundUser.allergies || '',
        visit_type: foundUser.visit_type || 'Primary Care',
        image_url: foundUser.image_url || ''
      });
      setAvatarPreview(foundUser.image_url || null);
    } catch (err) {
      console.error('Failed to fetch patient details', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = editForm.image_url;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        const uploadRes = await api.post('/organizations/upload-avatar', formData);

        finalImageUrl = uploadRes.data.imageUrl;
      }

      await api.put(`/organizations/${id}`, {
        ...editForm,
        image_url: finalImageUrl
      });

      setIsEditModalOpen(false);
      setAvatarFile(null);
      await fetchPatientDetails();
    } catch (err) {
      console.error('Failed to update patient', err);
      alert('Failed to update patient');
    } finally {
      setSaving(false);
    }
  };
  const handleSchedule = async (e) => {
    e.preventDefault();
    setScheduling(true);
    try {
      await api.post('/bookings', {
        ...bookingForm,
        clientId: id,
        agreementsSigned: true // Admins bypass this or pre-confirm
      });

      setIsBookingModalOpen(false);
      // Refresh patient details to show new history if needed
      await fetchPatientDetails();
      alert('Visit scheduled successfully');
    } catch (err) {
      console.error('Failed to schedule visit', err);
      alert('Failed to schedule visit: ' + err.message);
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#fcfdfe] min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-navy-900 font-bold uppercase tracking-widest text-sm">Loading Patient Record...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex-1 bg-[#fcfdfe] min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="text-red-500 font-bold text-lg">{error || 'Patient not found'}</div>
        <button onClick={() => router.back()} className="px-6 py-3 bg-navy-900 text-white rounded-xl font-bold text-sm">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="Patient Record" subtitle={`Detailed view for ${patient.name}`} />

      <main className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1200px] mx-auto text-navy-900">

        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-navy-900 transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-6 py-3 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 flex items-center gap-2 font-bold text-sm transition-all shadow-sm"
            >
              <Edit2 className="w-4 h-4 text-gray-400" />
              Edit Profile
            </button>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-navy-900 text-white hover:bg-navy-800 flex items-center gap-2 font-bold text-sm transition-all shadow-lg shadow-navy-900/10"
            >
              <Calendar className="w-4 h-4" />
              Schedule Visit
            </button>

          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
          {/* Status Badge */}
          <div className="absolute top-8 right-8">
            <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${patient.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                patient.status === 'inactive' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                  'bg-orange-50 text-orange-600 border-orange-100'
              }`}>
              {patient.status}
            </span>
          </div>

          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-gray-50 shadow-sm shrink-0">
            <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-6 pt-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-navy-900">{patient.name}</h1>
              <p className="text-lg text-gray-400 font-medium mt-1">{patient.organization}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="font-bold text-sm mt-0.5">{patient.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                  <p className="font-bold text-sm mt-0.5">{patient.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                  <p className="font-bold text-sm mt-0.5">{patient.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

          {/* Medical Summary */}
          <section className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-6 h-6 text-navy-900" />
              <h3 className="text-xl font-black text-navy-900 tracking-tight">Clinical Overview</h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Standard Visit Type</p>
                <p className="font-bold text-navy-900">{patient.visit_type}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Blood Type</p>
                  <p className="font-bold text-navy-900 text-lg">{patient.blood_type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Allergies</p>
                  <p className="font-bold text-navy-900">{patient.allergies}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Activity History */}
          <section className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-6 h-6 text-navy-900" />
              <h3 className="text-xl font-black text-navy-900 tracking-tight">Recent History</h3>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-navy-900 text-sm">Consultation</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">Upcoming</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Follow-up appointment with Dr. Sarah Smith.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-200 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                  <User className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-navy-900 text-sm">Registration</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{patient.lastActivity}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Account created in the Proben system.</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Patient Details">
          <form onSubmit={handleUpdate} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 pb-4">

            <div className="space-y-4">
              <h4 className="font-bold text-navy-900 border-b border-gray-100 pb-2">Core Profile</h4>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-navy-900 transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm font-bold text-navy-900 hover:text-blue-600 transition-colors"
                  >
                    Change Avatar
                  </button>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">JPG, PNG or WEBP. Max 5MB.</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Contact Person</label>
                  <input
                    type="text"
                    value={editForm.contact_person}
                    onChange={(e) => setEditForm({ ...editForm, contact_person: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Organization</label>
                  <input
                    type="text"
                    value={editForm.organization_name}
                    onChange={(e) => setEditForm({ ...editForm, organization_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Country</label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Account Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm appearance-none cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="font-bold text-navy-900 border-b border-gray-100 pb-2">Medical Context</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Blood Type</label>
                  <select
                    value={editForm.blood_type}
                    onChange={(e) => setEditForm({ ...editForm, blood_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm appearance-none"
                  >
                    <option value="">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Visit Type</label>
                  <select
                    value={editForm.visit_type}
                    onChange={(e) => setEditForm({ ...editForm, visit_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm appearance-none"
                  >
                    <option value="Primary Care">Primary Care</option>
                    <option value="Specialist Consult">Specialist Consult</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Routine Checkup">Routine Checkup</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Known Allergies</label>
                <textarea
                  value={editForm.allergies}
                  onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm min-h-[80px]"
                  placeholder="E.g. Penicillin, Peanuts (leave blank if none)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-4 bg-navy-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-navy-800 disabled:opacity-50 transition-all shadow-lg"
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </Modal>

        <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Schedule New Visit">
          <form onSubmit={handleSchedule} className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Patient</p>
                  <p className="font-bold text-navy-900 text-sm">{patient.name}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Visit Type</label>
                <select
                  value={bookingForm.serviceType}
                  onChange={(e) => {
                    const newServiceType = e.target.value;
                    const validSpecialists = SPECIALISTS.filter(s =>
                      SERVICE_TO_DEPARTMENTS[newServiceType]?.includes(s.department)
                    ).map(s => s.name);

                    setBookingForm({
                      ...bookingForm,
                      serviceType: newServiceType,
                      preferredConsultant: validSpecialists.includes(bookingForm.preferredConsultant)
                        ? bookingForm.preferredConsultant
                        : ''
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm appearance-none cursor-pointer"
                  required
                >

                  <option value="Primary Care">Primary Care</option>
                  <option value="Specialist Consult">Specialist Consult</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Preferred Consultant</label>
                <select
                  value={bookingForm.preferredConsultant}
                  onChange={(e) => setBookingForm({ ...bookingForm, preferredConsultant: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select a Specialist</option>
                  {SPECIALISTS.filter(s =>
                    SERVICE_TO_DEPARTMENTS[bookingForm.serviceType]?.includes(s.department)
                  ).map(s => (
                    <option key={s.name} value={s.name}>{s.name} ({s.department})</option>
                  ))}
                </select>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Date</label>
                  <input
                    type="date"
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-navy-900 ml-1">Time</label>
                  <input
                    type="time"
                    value={bookingForm.bookingTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={scheduling}
              className="w-full bg-navy-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-navy-800 disabled:opacity-50 transition-all shadow-lg shadow-navy-900/10"
            >
              {scheduling ? 'Scheduling...' : 'Confirm Visit'}
            </button>
          </form>
        </Modal>


      </main>
    </div>
  );
}
