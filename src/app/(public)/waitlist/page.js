import React from "react";
import Navbar from "@/components/layout/navbar";
import FooterSection from "@/sections/public/home/footer";
import { ShieldCheck, Mail, Send, Lock, Calendar, Users, LayoutDashboard } from "lucide-react";

export default function WaitlistPage() {
  const futureModules = [
    { title: "Personnel Scheduling", icon: Calendar, desc: "Automated staff rotations and credentials tracking." },
    { title: "Resident Portal", icon: Users, desc: "Secure gateway for family updates and care reporting." },
    { title: "Admin OS", icon: LayoutDashboard, desc: "Unified dashboard for multi-facility operations." }
  ];

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6 lg:px-[15vw] flex flex-col lg:flex-row gap-16 items-start">
        {/* Left: Lead Capture Form */}
        <div className="flex-1 w-full max-w-2xl bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 relative">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl"></div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Join the Software Soft-Launch</h1>
          <p className="text-slate-600 mb-8 max-w-lg leading-relaxed">
            Register your facility for early access to our integrated scheduling and HR modules. 
            Selected partners receive lifetime preferential pricing.
          </p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 text-sm font-semibold text-slate-700">
                <label>Facility Name</label>
                <input type="text" placeholder="e.g. Proben Living" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
              </div>
              <div className="space-y-1.5 text-sm font-semibold text-slate-700">
                <label>Number of Residents</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent outline-none transition-all">
                  <option>1-5 Residents</option>
                  <option>6-15 Residents</option>
                  <option>16-50 Residents</option>
                  <option>50+ Residents</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-sm font-semibold text-slate-700">
              <label>Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="email" placeholder="admin@facility.com" className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-accent outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1.5 text-sm font-semibold text-slate-700">
              <label>Current Software (Optional)</label>
              <input type="text" placeholder="e.g. MatrixCare, Focus, None" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent outline-none transition-all" />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Your data is encrypted and handled in accordance with HIPAA standards. 
                We will only contact you regarding early platform access.
              </p>
            </div>

            <button type="submit" className="w-full bg-accent hover:bg-accent-light text-navy-900 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98]">
              <Send className="w-5 h-5" />
              Secure My Priority Access
            </button>
          </form>
        </div>

        {/* Right: Expectation Setting */}
        <div className="flex-1 space-y-12 lg:pt-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-widest text-sm">Upcoming Modules</h2>
            <div className="space-y-6">
              {futureModules.map((m, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 group-hover:border-accent transition-all shadow-sm">
                    <m.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{m.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-accent rounded-[2.5rem] text-navy-900 space-y-4">
            <ShieldCheck className="w-10 h-10" />
            <h3 className="text-xl font-bold italic">"Reliable systems for those who provide the care that matters most."</h3>
            <p className="text-navy-900/70 text-sm leading-relaxed font-medium">
              We are finalizing the first software modules in testing environments. 
              Join 15+ facilities already in the soft-launch queue.
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
