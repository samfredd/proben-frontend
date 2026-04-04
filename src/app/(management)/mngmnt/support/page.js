'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  AlertCircle,
  Activity,
  History,
  LayoutGrid
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';

export default function AdminSupportSessionsPage() {
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'availability'
  const [loading, setLoading] = useState(true);
  
  // Sessions State
  const [sessions, setSessions] = useState([]);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionModalConfig, setSessionModalConfig] = useState({ title: '', type: 'status' }); // 'status' | 'link'

  // Availability State
  const [slots, setSlots] = useState([]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, slotsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/time-slots/all')
      ]);
      setSessions(bookingsRes.data.bookings || []);
      setSlots(slotsRes.data.slots || []);
    } catch (error) {
      console.error('Error fetching support data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Session Handlers ---
  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchData();
      setIsSessionModalOpen(false);
    } catch (error) {
      alert(`Error updating status: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleAssignLink = async (e) => {
    e.preventDefault();
    const link = new FormData(e.target).get('meetingLink');
    try {
      await api.put(`/bookings/${selectedSession.id}/link`, { meetingLink: link });
      fetchData();
      setIsSessionModalOpen(false);
    } catch (error) {
      alert(`Error assigning link: ${error.response?.data?.error || error.message}`);
    }
  };

  const openStatusModal = (session, status) => {
    setSelectedSession({ ...session, targetStatus: status });
    setSessionModalConfig({ title: 'Confirm Status Change', type: 'status' });
    setIsSessionModalOpen(true);
  };

  const openLinkModal = (session) => {
    setSelectedSession(session);
    setSessionModalConfig({ title: 'Assign Meeting Link', type: 'link' });
    setIsSessionModalOpen(true);
  };

  // --- Availability Handlers ---
  const handleCreateSlot = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/time-slots', { 
        slot_date: formData.get('date'), 
        slot_time: formData.get('time') 
      });
      setIsSlotModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating slot:', error);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!confirm('Delete this time slot?')) return;
    try {
      await api.delete(`/time-slots/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader 
        title="Support Sessions" 
        subtitle="Manage client bookings, meeting links, and expert availability" 
      />

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-gray-100/50 rounded-2xl w-fit">
          {[
            { id: 'sessions', label: 'Booking Sessions', icon: Activity },
            { id: 'availability', label: 'Availability Manager', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-navy-900 shadow-sm' 
                : 'text-gray-400 hover:text-navy-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'sessions' ? (
            <motion.div
              key="sessions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Organization</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Request Details</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <tr><td colSpan="5" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading sessions...</td></tr>
                      ) : sessions.length === 0 ? (
                        <tr><td colSpan="5" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No support sessions found</td></tr>
                      ) : sessions.map(session => (
                        <tr key={session.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-8 py-6">
                            <p className="font-black text-navy-900 tracking-tight">{session.organization_name}</p>
                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">{session.contact_person}</p>
                          </td>
                          <td className="px-8 py-6 max-w-md">
                            <p className="text-xs font-bold text-navy-900 line-clamp-2">{session.support_message || 'No direct message provided'}</p>
                            {session.service_name && <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Type: {session.service_name}</p>}
                          </td>
                          <td className="px-8 py-6">
                            <p className="font-bold text-navy-900">{new Date(session.booking_date).toLocaleDateString()}</p>
                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">{session.booking_time} ({session.timezone})</p>
                            {session.meeting_link && (
                              <a href={session.meeting_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-[10px] uppercase mt-1 tracking-widest">
                                <Video className="w-3.5 h-3.5" /> Join Link
                              </a>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              session.status === 'confirmed' ? 'bg-lime-50 text-lime-600 border-lime-100' : 
                              session.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              session.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                              'bg-orange-50 text-orange-600 border-orange-100'
                            }`}>
                              {session.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              {session.status === 'pending' && (
                                <>
                                  <button onClick={() => openStatusModal(session, 'confirmed')} className="p-2.5 bg-lime-50 text-lime-600 rounded-xl hover:bg-lime-100 transition-colors" title="Confirm Booking"><CheckCircle className="w-4.5 h-4.5" /></button>
                                  <button onClick={() => openStatusModal(session, 'cancelled')} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors" title="Cancel Booking"><XCircle className="w-4.5 h-4.5" /></button>
                                </>
                              )}
                              {session.status === 'confirmed' && (
                                <>
                                  <button onClick={() => openLinkModal(session)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors" title="Assign Link"><Video className="w-4.5 h-4.5" /></button>
                                  <button onClick={() => openStatusModal(session, 'completed')} className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors" title="Mark Completed"><CheckCircle className="w-4.5 h-4.5" /></button>
                                </>
                              )}
                              {(session.status === 'completed' || session.status === 'cancelled') && (
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Archived</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="availability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
                <div>
                  <h3 className="text-lg font-black text-navy-900">Expert Availability</h3>
                  <p className="text-gray-400 text-sm font-medium">Set your open windows for client support sessions</p>
                </div>
                <button
                  onClick={() => setIsSlotModalOpen(true)}
                  className="px-6 py-3 bg-[#82C341] text-[#0a1128] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#76b13b] transition-all flex items-center gap-2 shadow-lg shadow-[#82C341]/10"
                >
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time (UTC)</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <tr><td colSpan="4" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading slots...</td></tr>
                      ) : slots.length === 0 ? (
                        <tr><td colSpan="4" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No slots available</td></tr>
                      ) : slots.map(slot => {
                        const isPast = new Date(slot.slot_date) < new Date().setHours(0,0,0,0);
                        return (
                          <tr key={slot.id} className={`hover:bg-gray-50/30 transition-colors ${isPast ? 'opacity-50' : ''}`}>
                            <td className="px-8 py-6 font-bold text-navy-900">
                              {new Date(slot.slot_date).toLocaleDateString()}
                              {isPast && <span className="ml-2 text-[8px] font-black bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-widest">Past</span>}
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2 font-bold text-navy-900">
                                <Clock className="w-4 h-4 text-gray-300" /> {slot.slot_time}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              {slot.is_booked ? (
                                <span className="px-3 py-1 rounded-full text-[9px] font-black bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-widest">Booked</span>
                              ) : (
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isPast ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-lime-50 text-lime-600 border-lime-100'}`}>
                                  {isPast ? 'Expired' : 'Open'}
                                </span>
                              )}
                            </td>
                            <td className="px-8 py-6 text-right">
                              {!slot.is_booked && (
                                <button onClick={() => handleDeleteSlot(slot.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Session Action Modal */}
      <Modal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} title={sessionModalConfig.title}>
        <div className="space-y-6">
          {sessionModalConfig.type === 'status' ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><AlertCircle className="w-6 h-6" /></div>
                <div>
                  <p className="text-navy-900 font-bold">Update session to {selectedSession?.targetStatus}?</p>
                  <p className="text-gray-400 text-sm mt-1">This will change the session status for {selectedSession?.organization_name}.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsSessionModalOpen(false)} className="flex-1 py-4 rounded-2xl border border-gray-100 font-black text-xs uppercase tracking-widest text-gray-400">Cancel</button>
                <button 
                  onClick={() => handleUpdateStatus(selectedSession.id, selectedSession.targetStatus)}
                  className="flex-1 py-4 rounded-2xl bg-[#82C341] text-[#0a1128] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#82C341]/20"
                >
                  Confirm Update
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAssignLink} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-navy-900 tracking-widest ml-1">Video Meeting Link (Zoom/Meet)</label>
                <input name="meetingLink" type="url" required defaultValue={selectedSession?.meeting_link || ''} placeholder="https://zoom.us/j/..." className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all text-sm" />
              </div>
              <button type="submit" className="w-full bg-[#0a1128] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-navy-900/10 active:scale-[0.98]">
                Assign Meeting Link
              </button>
            </form>
          )}
        </div>
      </Modal>

      {/* Availability Modal */}
      <Modal isOpen={isSlotModalOpen} onClose={() => setIsSlotModalOpen(false)} title="Create Support Slot">
        <form onSubmit={handleCreateSlot} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-navy-900 tracking-widest ml-1">Date</label>
              <input name="date" type="date" required className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-navy-900 tracking-widest ml-1">Time (UTC)</label>
              <input name="time" type="time" required className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#82C341] text-[#0a1128] py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#82C341]/10 mt-6 active:scale-[0.98]">
            Publish Availability
          </button>
        </form>
      </Modal>
    </div>
  );
}
