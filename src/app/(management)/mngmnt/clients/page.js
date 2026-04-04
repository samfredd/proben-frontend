'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileCheck, CheckCircle, Mail, Phone, MapPin, Star, PlusCircle, ArrowRight, Activity, Shield, Sparkles, ChevronDown } from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';
import Modal from '@/components/ui/Modal';
import { getSubscriptionServices } from '@/utils/subscriptions';

/* ─── animation variants ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } }
});

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.08 } }
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    try {
      const response = await api.get('/organizations');
      setClients(response.data.organizations || response.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(getSubscriptionServices(res.data || []));
    } catch (err) {
      console.error('Failed to fetch services', err);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchServices();
  }, []);

  const openSubModal = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleSetSubscription = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const serviceId = fd.get('serviceId');
    const service = services.find(s => s.id === serviceId);

    if (!service) return alert('Please select a service');

    try {
      setSubmitting(true);
      await api.post('/subscriptions', {
        client_id: selectedClient.id,
        service_id: service.id,
        plan_name: service.name,
        amount_usd: service.price_usd,
        next_billing_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      });
      alert('Subscription assigned successfully!');
      setIsModalOpen(false);
      fetchClients();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Organization CRM" subtitle="Strategic management of business clients & compliance" />

      <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 pb-20">
        
        {/* Header Section with Count */}
        <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <div>
                <h2 className="text-3xl font-black text-navy-900 tracking-tight flex items-center gap-3">
                    Active Partnerships
                    <span className="px-3 py-1 bg-lime-100 text-lime-700 text-xs font-black rounded-full border border-lime-200">
                        {clients.length}
                    </span>
                </h2>
                <p className="text-gray-400 font-medium mt-1">Global network of coordinated healthcare organizations</p>
            </div>
            <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="clay-card-accent px-8 py-4 bg-accent text-primary font-black text-sm uppercase tracking-widest hover:bg-accent-light transition-all flex items-center gap-2 self-start md:self-auto"
            >
                <PlusCircle className="w-4 h-4" />
                Onboard New Org
            </motion.button>
        </motion.div>

        <motion.div 
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {loading ? (
            <div className="col-span-full py-24 text-center">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Accessing CRM Records...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="col-span-full py-24 text-center clay-card bg-gray-50/50">
                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No client organizations registered</p>
            </div>
          ) : clients.map((client, i) => (
            <motion.div 
                key={client.id} 
                variants={fadeUp(i * 0.05)}
                className="clay-card bg-white flex flex-col group hover:-translate-y-2 transition-all duration-300 animate-breathe"
                style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className="p-8 pb-6 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-accent/10 transition-colors" />
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-3xl bg-gray-50 clay-card flex items-center justify-center shrink-0 border border-gray-100">
                        <Users className="w-7 h-7 text-navy-900 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="px-3 py-1 bg-lime-50 text-lime-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-lime-100">
                        {client.agreed_tos && client.agreed_telemedicine_consent ? 'Verified' : 'Pending'}
                    </span>
                </div>

                <h3 className="text-2xl font-black text-navy-900 tracking-tight leading-tight group-hover:text-primary transition-colors">{client.organization_name || client.name}</h3>
                
                <div className="mt-6 space-y-3 relative z-10">
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-bold tracking-tight">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-gray-50">
                        <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    {client.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-bold tracking-tight">
                     <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-gray-50">
                        <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    {client.country || 'United States'}
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8 flex-1">
                <div className="h-px bg-gray-50 w-full mb-8" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-5 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    Compliance & Security
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Terms of Service', status: client.agreed_tos },
                    { label: 'Telemedicine', status: client.agreed_telemedicine_consent },
                    { label: 'Medical Liability', status: client.agreed_medical_liability }
                  ].map((agreement) => (
                    <div key={agreement.label} className="flex justify-between items-center bg-gray-50/50 p-3.5 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all">
                        <span className="text-xs font-bold text-navy-900">{agreement.label}</span>
                        {agreement.status ? (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-lg">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-[9px] font-black text-green-600 uppercase">Active</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 rounded-lg">
                                <Activity className="w-3 h-3 text-red-500" />
                                <span className="text-[9px] font-black text-red-500 uppercase">Void</span>
                            </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 mx-4 mb-4 rounded-3xl bg-primary text-white flex justify-between items-center shadow-xl shadow-primary/10">
                <div className="flex items-center gap-3 px-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Est. {new Date(client.created_at).getFullYear()}</span>
                </div>
                <div className="flex gap-2">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openSubModal(client)}
                    className="p-2.5 rounded-xl bg-white/10 text-accent hover:bg-accent hover:text-primary transition-all group/btn"
                    title="Assign Subscription"
                  >
                    <Star className="w-4 h-4" />
                  </motion.button>
                  <Link 
                    href={`/mngmnt/clients/${client.id}/patients`}
                    className="p-2.5 rounded-xl bg-accent text-primary hover:bg-accent-light transition-all flex items-center justify-center"
                    title="View Patients & Records"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Set Subscription Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={`Assign Client Retainer`}
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-lime-50 flex items-center justify-center mx-auto mb-4 border border-lime-100">
                <Shield className="w-10 h-10 text-lime-600" />
            </div>
            <h3 className="text-xl font-black text-navy-900 tracking-tight">{selectedClient?.organization_name || selectedClient?.name}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Configuring b2b service agreement</p>
          </div>
          <form onSubmit={handleSetSubscription} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-navy-900 tracking-widest pl-1">Target Package</label>
              <div className="relative">
                <select 
                    name="serviceId" 
                    required 
                    className="clay-card w-full px-6 py-5 bg-slate-50 border border-slate-200 outline-none font-bold text-sm text-navy-900 appearance-none cursor-pointer focus:border-accent transition-all"
                >
                    <option value="">— Choose retainer plan —</option>
                    {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (${parseFloat(s.price_usd).toFixed(0)}/mo)</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
              </div>
            </div>

            <div className="clay-card bg-primary p-7 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -mr-12 -mt-12 blur-xl" />
                <div className="space-y-5 relative z-10">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white/50">Service Billing</span>
                        <span className="text-[9px] font-black bg-accent text-primary px-3 py-1 rounded-lg uppercase tracking-wider">Recurring</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <span className="text-xs font-bold text-white/50">Next Cycle</span>
                        <span className="text-xs font-black text-white">Active from today</span>
                    </div>
                </div>
            </div>

            <motion.button 
              type="submit" 
              whileTap={{ scale: 0.97 }}
              disabled={submitting}
              className="clay-card-accent w-full py-5 bg-accent text-primary font-black text-sm tracking-wide hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 mt-4"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  Updating Contract...
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  Confirm Agreement
                </>
              )}
            </motion.button>
          </form>
        </Modal>
      </main>
    </div>
  );
}
