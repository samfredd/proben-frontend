"use client";

import React from "react";
import Navbar from "@/components/layout/navbar";
import Link from "next/link";
import FooterSection from "@/sections/public/home/footer";
import { 
  Calendar, 
  Clock, 
  Users, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight,
  CheckCircle2,
  BellRing
} from "lucide-react";

export default function EmployeeSchedulingPage() {
  const metrics = [
    { label: "Scheduling Efficiency", value: "+30%", icon: Zap, desc: "Reduce time spent on rotas by 4 hours weekly." },
    { label: "Gap Coverage", value: "100%", icon: CheckCircle2, desc: "Proprietary zero-gap care algorithm." },
    { label: "Overtime Savings", value: "12%", icon: BarChart3, desc: "Average monthly labor cost reduction." }
  ];

  const features = [
    { title: "Auto-Rota Intelligence", icon: Zap, desc: "One-click generation of complex staff rotations based on credentials." },
    { title: "Conflict Guard", icon: ShieldCheck, desc: "Prevent double-booking and labor law violations before they happen." },
    { title: "Mobile Shift Swap", icon: Users, desc: "Staff-led coordination with admin approvals for maximum flexibility." },
    { title: "Credential Match", icon: Users, desc: "Only schedule DSPs with active, valid required state-mandated certifications." },
    { title: "Smart Alerts", icon: BellRing, desc: "Instant notifications for no-shows or upcoming shift gaps." },
    { title: "Payroll Integration", icon: BarChart3, desc: "Direct export of verified hours to your payroll system." }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      {/* ---------------- Scheduling Hero ---------------- */}
      <section className="pt-32 pb-20 px-6 lg:px-[10vw] bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055?fm=jpg&q=60&w=2000&auto=format&fit=crop"
            alt="Coordination background"
            className="w-full h-full object-cover opacity-[0.03] grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full border border-accent/30 bg-accent/10 text-accent backdrop-blur-md">
              <Clock className="w-3.5 h-3.5" />
              Coming Soon: Operational Excellence
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
              Scheduling for <br />
              <span className="text-accent">Zero-Gap Care.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              Eliminate the chaos of manual rotas. Proben’s intelligent scheduling engine ensures 
              your IDD facility is always staffed with the right DSPs at the right time—meeting 
              every care ratio, reducing overtime, and preventing employee burnout.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-navy-900 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] text-center">
                Sign Up Now
              </Link>
              <Link href="/contact" className="w-full sm:w-auto bg-white border border-slate-200 hover:border-accent text-slate-900 px-8 py-4 rounded-xl font-bold transition-all text-center">
                Optimise My Rota
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50 lg:-rotate-2 transition-transform hover:rotate-0 duration-700">
            <img 
              src="https://images.unsplash.com/photo-1653566031535-bcf33e1c2893?fm=jpg&q=60&w=1500&auto=format&fit=crop"
              alt="Efficient staff scheduling"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      {/* ---------------- Clean Metrics Section ---------------- */}
      <section className="py-16 px-6 lg:px-[10vw] bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 group hover:border-accent transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent ring-1 ring-accent/20 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 mb-1">{item.value}</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{item.label}</p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Detailed Content Section: Care-Ratio Engine ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-white overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055?fm=jpg&q=60&w=2000&auto=format&fit=crop"
            alt="Strategy background"
            className="w-full h-full object-cover opacity-[0.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              The Care-Ratio <br />
              <span className="text-accent underline decoration-accent/10 underline-offset-8">Engine.</span>
            </h2>
            <p>
              Residential care providers face a constant balancing act: maintaining 
              state-mandated care ratios while controlling labor costs. Proben’s algorithm 
              doesn't just fill slots—it matches staff to the specific clinical needs of 
              each resident.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-accent font-black text-2xl mb-2">ICF / Group Home</p>
                <p className="text-xs text-slate-500 font-medium whitespace-pre-wrap">Optimization for complex multi-site staffing requirements.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-accent font-black text-2xl mb-2">Credential Match</p>
                <p className="text-xs text-slate-500 font-medium whitespace-pre-wrap">Automatic verification of DSP qualifications before scheduling.</p>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="bg-navy-900 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden border border-accent/20">
              <div className="absolute inset-0 z-0 opacity-60 group-hover:scale-105 transition-transform duration-1000">
                <img 
                  src="https://images.unsplash.com/photo-1653566031535-bcf33e1c2893?fm=jpg&q=60&w=1500&auto=format&fit=crop"
                  alt="Strategic healthcare coordination"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
              </div>

              <div className="relative z-10 aspect-video rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center border border-white/5 backdrop-blur-[2px]">
                <div className="w-20 h-20 rounded-3xl bg-accent/20 backdrop-blur-xl flex items-center justify-center text-accent mb-6 border border-accent/30 shadow-2xl">
                  <Calendar className="w-10 h-10 animate-pulse" />
                </div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-navy-900/40 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-accent/30 transition-all shadow-2xl overflow-hidden">
                   <div className="absolute inset-0 z-0 opacity-25">
                      <img 
                        src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055?fm=jpg&q=60&w=500&auto=format&fit=crop"
                        alt="Tech monitor grid"
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                         <p className="text-accent text-[10px] font-black uppercase tracking-[0.3em] drop-shadow-md">Ratio Optimization Active</p>
                      </div>
                      <p className="text-white font-black text-sm tracking-tight drop-shadow-md">DYNAMIC CREW MATCHING ENGINE</p>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* ---------------- Feature Grid ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Staffing Intelligence.</h2>
            <p className="text-slate-500 text-lg">Built specifically for the complex staffing and ratio requirements of IDD residential care.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Mobile Empowerment Section ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative group p-12 rounded-[3rem] border border-slate-100 flex flex-col items-center text-center overflow-hidden bg-navy-900 shadow-2xl">
             <div className="absolute inset-0 z-0 opacity-40 group-hover:scale-105 transition-transform duration-1000">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1500"
                  alt="Staff mobile coordination"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent" />
             </div>
             
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-accent/20 backdrop-blur-xl flex items-center justify-center text-accent mb-8 border border-accent/30 shadow-2xl">
                  <BellRing className="w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 drop-shadow-md tracking-tight underline decoration-accent/20 decoration-8 underline-offset-8">The Shift-Swap Economy.</h3>
                <p className="text-slate-300 font-bold leading-relaxed mb-8 drop-shadow-md">
                   Empower your DSPs to manage their own work-life balance. Proben’s mobile app 
                   allows for staff-led shift swaps with built-in compliance checks, reducing 
                   the burden on your house managers by 60%.
                </p>
                <div className="flex gap-4">
                   <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                   <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
                   <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
                </div>
             </div>
          </div>
          <div className="space-y-8">
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Zero Chaos. <br /><span className="text-accent underline decoration-accent/10 underline-offset-8">Maximum Output.</span></h2>
             <p className="text-lg text-slate-600 leading-relaxed font-medium">
                When a staff member is sick, Proben doesn't just alert you—it suggests 
                replacements from your float pool who meet the exact credential requirements 
                for that specific house and shift. Stop the phone-tag and start coordinating 
                in real-time.
             </p>
             <Link href="/signup" className="inline-flex items-center gap-3 text-navy-900 font-black uppercase tracking-widest text-xs group">
                Join the Platform
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform color-accent" />
             </Link>
          </div>
        </div>
      </section>

      {/* ---------------- CTA Banner ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw]">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[3rem] bg-black p-12 md:p-20 text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              Eliminate the chaos of <span className="text-accent underline decoration-white/20">manual rotas.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-12 font-medium">
              Join the facilities that have recovered an average of 15% in labor costs within the first 
              90 days by automating their staff coordination.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/signup" className="bg-accent px-10 py-5 rounded-2xl font-black text-navy-900 transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-accent/20">
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
