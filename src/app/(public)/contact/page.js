'use client';
import { useState } from 'react';
import Navbar from "@/components/layout/navbar";
import FooterSection from "@/sections/public/home/footer";
import { 
  Mail, 
  ShieldCheck, 
  Phone, 
  CheckCircle2, 
  Send, 
  Clock, 
  BarChart3, 
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    organization: '', 
    residents: '1-5', 
    software: '', 
    message: '' 
  });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      toast.success("Audit Request Logged Successfully");
    }, 600);
  };

  const steps = [
    { title: "Review Logs", desc: "We analyze your top 3 denial reasons from your recent billing logs.", icon: BarChart3 },
    { title: "Gap Analysis", desc: "Identify missing coding opportunities and workflow friction.", icon: ShieldCheck },
    { title: "Strategy Session", desc: "15-minute consultation to review the findings and next steps.", icon: Clock },
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-accent selection:text-navy-900">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 lg:px-[10vw]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* ---------------- Consultation Sidebar (4cols) ---------------- */}
            <div className="lg:col-span-5 space-y-12">
              <div className="relative p-10 bg-navy-900 rounded-[3rem] text-white overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[80px] rounded-full" />
                 
                 <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-accent/20">
                      Expert Consultation
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-8">
                      Let's recover <br />
                      <span className="text-accent underline decoration-white/10 underline-offset-8 italic">your revenue.</span>
                    </h1>
                    
                    <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                      Request a 15-minute system audit. We’ll identify exactly where your billing 
                      friction is rooted and how to resolve it permanently.
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Our Team</p>
                          <p className="font-bold text-slate-200">strategy@probengroup.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Standard</p>
                          <p className="font-bold text-slate-200">HIPAA Protected Systems</p>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Step Process */}
              <div className="pl-6 space-y-10 relative">
                <div className="absolute left-[2.4rem] top-4 bottom-4 w-px bg-slate-100 dashed-border" />
                
                {steps.map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 relative z-10"
                  >
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-900 shadow-sm shrink-0">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg flex items-center gap-2 italic">
                        {i + 1}. {step.title}
                        <ChevronRight className="w-4 h-4 text-accent" />
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed mt-1">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ---------------- Audit Request Form (7cols) ---------------- */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-accent rounded-[3.5rem] p-12 md:p-20 text-navy-900 text-center relative overflow-hidden shadow-2xl"
                  >
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full" />
                    
                    <div className="w-24 h-24 bg-navy-900 text-accent rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl group animate-pulse">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-4xl font-black mb-6 tracking-tight">Request Logged.</h2>
                    <p className="text-lg font-bold opacity-80 mb-10 max-w-sm mx-auto">
                      A specialist is reviewing your organization profile. 
                      Expect a follow-up via email within 24 hours.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)} 
                      className="text-navy-900 font-black text-sm uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto"
                    >
                      Return to Form
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.04)]"
                  >
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-slate-900 placeholder:text-slate-300"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Work Email</label>
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-slate-900 placeholder:text-slate-300"
                            placeholder="john@facility.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Organization</label>
                          <input 
                            type="text" 
                            required
                            value={formData.organization}
                            onChange={e => setFormData({...formData, organization: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-slate-900 placeholder:text-slate-300"
                            placeholder="Group Home Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Scale (Residents)</label>
                          <select 
                            value={formData.residents}
                            onChange={e => setFormData({...formData, residents: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-slate-900 appearance-none"
                          >
                            <option>1-5 Residents</option>
                            <option>6-15 Residents</option>
                            <option>16-50 Residents</option>
                            <option>50+ Residents</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Current Billing Software</label>
                        <input 
                          type="text" 
                          value={formData.software}
                          onChange={e => setFormData({...formData, software: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-slate-900 placeholder:text-slate-300"
                          placeholder="e.g. Focus, MatrixCare, Manual"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Operation Summary</label>
                        <textarea 
                          rows="4"
                          required
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-slate-900 placeholder:text-slate-300 resize-none"
                          placeholder="Briefly describe your current billing or staffing challenges..."
                        ></textarea>
                      </div>

                      <div className="pt-4">
                        <button 
                          type="submit" 
                          className="w-full bg-accent hover:bg-accent-light text-navy-900 py-6 rounded-2xl font-black text-lg transition-all shadow-[0_20px_40px_rgba(152,242,1,0.2)] active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <Send className="w-6 h-6" />
                          Book System Audit
                        </button>
                        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mt-6">
                           Next availability: <span className="text-slate-900 italic">24-48 Business Hours</span>
                        </p>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      <FooterSection />

      <style jsx>{`
        .dashed-border {
          background-image: repeating-linear-gradient(0deg, #e2e8f0, #e2e8f0 4px, transparent 4px, transparent 8px);
        }
      `}</style>
    </main>
  );
}
