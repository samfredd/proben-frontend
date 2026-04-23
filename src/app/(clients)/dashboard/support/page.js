'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Calendar,
  Clock,
  Video,
  Plus,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  History,
  Info
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';
import Link from 'next/link';


export default function ClientSupportPage() {
  const [activeTab, setActiveTab] = useState('my-sessions'); // 'my-sessions' | 'book'
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [services, setServices] = useState([]);
  
  // Booking State
  const [supportMessage, setSupportMessage] = useState('');
  const [timeSlotId, setTimeSlotId] = useState('');
  const [agreements, setAgreements] = useState({ tos: false, telemedicine: false, liability: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, slotsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/time-slots')
      ]);
      setBookings(bookingsRes.data.bookings || []);
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

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!agreements.tos || !agreements.telemedicine || !agreements.liability) return;

    try {
      await api.post('/bookings', {
        supportMessage: supportMessage,
        timeSlotId: timeSlotId,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        agreementsSigned: true
      });
      alert('Support request sent successfully!');
      setActiveTab('my-sessions');
      fetchData();
      // Reset form
      setSupportMessage('');
      setTimeSlotId('');
      setAgreements({ tos: false, telemedicine: false, liability: false });
    } catch (error) {
      alert(`Error requesting support: ${error.response?.data?.error || error.message}`);
    }
  };

  const nextBooking = bookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date))[0];

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen text-navy-900">
      <DashboardHeader 
        title="Support Center" 
        subtitle="Access expert medical coordination and schedule support sessions" 
      />

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        
        {/* Quick Stats & Next Session */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-lime-50 text-lime-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Activity className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Sessions</p>
              <h4 className="text-2xl font-black text-navy-900 truncate">
                {bookings.filter(b => b.status === 'confirmed').length} Scheduled
              </h4>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm flex items-center gap-6 md:col-span-2 overflow-hidden relative group">
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Video className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Upcoming Coordination</p>
              <h4 className="text-xl font-black text-navy-900 truncate">
                {nextBooking ? (
                  `${new Date(nextBooking.booking_date).toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })} at ${nextBooking.booking_time}`
                ) : (
                  'No sessions scheduled'
                )}
              </h4>
            </div>
            {nextBooking?.meeting_link && (
              <button 
                onClick={() => window.open(nextBooking.meeting_link, '_blank')}
                className="px-6 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Join Now
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-gray-100/50 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('my-sessions')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'my-sessions' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-400 hover:text-navy-900'
            }`}
          >
            <History className="w-4 h-4" /> My Sessions
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'book' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-400 hover:text-navy-900'
            }`}
          >
            <Plus className="w-4 h-4" /> Book Session
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'my-sessions' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden p-8">
                {loading ? (
                  <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading sessions...</div>
                ) : bookings.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <Calendar className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-navy-900">No support sessions requested</h4>
                      <p className="text-gray-400 text-sm font-medium mt-1">Our experts are ready to help. Schedule a session to get started.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('book')}
                      className="bg-[#82C341] text-[#0a1128] px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#76b13b] transition-all shadow-xl shadow-[#82C341]/10"
                    >
                      Schedule Support
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(session => (
                      <div key={session.id} className="group p-6 rounded-3xl border border-gray-50 hover:border-lime-100 hover:bg-lime-50/10 transition-all flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                          <div className="text-center font-black">
                            <p className="text-[10px] text-lime-600 uppercase leading-none mb-1">{new Date(session.booking_date).toLocaleDateString([], { month: 'short' })}</p>
                            <p className="text-xl text-navy-900 leading-none">{new Date(session.booking_date).getDate()}</p>
                          </div>
                        </div>

                        <div className="flex-1 space-y-1">
                          <h4 className="text-lg font-black text-navy-900 transition-colors uppercase tracking-tight">{session.service_name || 'Standard Support Session'}</h4>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" /> {session.booking_time} ({session.timezone})
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            session.status === 'confirmed' ? 'bg-lime-50 text-lime-600 border-lime-100 shadow-sm' :
                            session.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm' :
                            'bg-gray-100 text-gray-400 border-gray-200'
                          }`}>
                            {session.status}
                          </span>
                          
                          <div className="flex gap-2 min-w-[120px] justify-end">
                            {session.status === 'confirmed' && session.meeting_link ? (
                              <button
                                onClick={() => window.open(session.meeting_link, '_blank')}
                                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all flex items-center gap-2"
                              >
                                Join <Video className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button className="px-6 py-3 rounded-xl border border-gray-100 bg-white font-black text-[10px] uppercase tracking-widest text-gray-400 cursor-not-allowed">
                                Details
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="book"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-lime-50 text-lime-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black text-navy-900 tracking-tight">Request Support Session</h3>
                </div>

                <form onSubmit={handleCreateBooking} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-navy-900 tracking-widest ml-1">How can we help you?</label>
                    <textarea
                      required
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Describe the issue or the coordination assistance you need..."
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-lime-500/5 outline-none font-medium text-navy-900 transition-all min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-navy-900 tracking-widest ml-1">Requested Time Slot</label>
                    <select
                      required
                      value={timeSlotId}
                      onChange={(e) => setTimeSlotId(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-lime-500/5 outline-none font-medium text-navy-900 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Select Date & Time ({Intl.DateTimeFormat().resolvedOptions().timeZone}) --</option>
                      {slots.map(s => (
                        <option key={s.id} value={s.id}>
                          {new Date(s.slot_date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at {s.slot_time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-navy-900 tracking-widest border-b border-gray-200 pb-2">Coordination Agreements</h5>
                    {[
                      { id: 'tos', label: 'Agree to Proben Support Terms' },
                      { id: 'telemedicine', label: 'Consent to Tele-health coordination' },
                      { id: 'liability', label: 'Acknowledge Privacy Policy' }
                    ].map(agreement => (
                      <label key={agreement.id} className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={agreements[agreement.id]}
                            onChange={(e) => setAgreements({ ...agreements, [agreement.id]: e.target.checked })}
                            className="peer appearance-none w-5 h-5 rounded-md border-2 border-gray-300 checked:bg-[#82C341] checked:border-[#82C341] transition-colors cursor-pointer"
                          />
                          <CheckCircle className="absolute w-3.5 h-3.5 text-navy-900 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 group-hover:text-navy-900 transition-colors uppercase">
                          {agreement.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="bg-navy-900 p-6 rounded-3xl text-white flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg"><Info className="w-4 h-4 text-lime-500" /></div>
                    <p className="text-[10px] font-medium leading-relaxed opacity-60">Sessions are processed sequentially. You will receive a notification and meeting link once the expert confirms your slot.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={!agreements.tos || !agreements.telemedicine || !agreements.liability}
                    className="w-full bg-[#82C341] text-[#0a1128] py-5 rounded-2xl font-black hover:bg-[#76b13b] disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#82C341]/10 mt-4 active:scale-[0.98]"
                  >
                    Confirm & Send Request
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
