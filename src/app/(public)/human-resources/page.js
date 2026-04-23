"use client";

import React from "react";
import Navbar from "@/components/layout/navbar";
import Link from "next/link";
import FooterSection from "@/sections/public/home/footer";
import { 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Activity, 
  Users, 
  ArrowRight,
  ClipboardList,
  GraduationCap
} from "lucide-react";

export default function HumanResourcesPage() {
  const hrMetrics = [
    { label: "Audit Readiness", value: "100%", icon: ShieldCheck, desc: "Digital personnel files compliant with state standards." },
    { label: "Onboarding Speed", value: "-60%", icon: Activity, desc: "Reduce time-to-hire by automating document collection." },
    { label: "Certification Rate", value: "99.9%", icon: UserCheck, desc: "Automated tracking for CPR and medical certs." }
  ];

  const hrFeatures = [
    { title: "Digital Onboarding", icon: UserCheck, desc: "Automated e-signature workflows for W-4s, I-9s, and company handbooks." },
    { title: "Compliance Automator", icon: ShieldCheck, desc: "Proactive tracking of TB tests, background checks, and license renewals." },
    { title: "Personnel Records", icon: FileText, desc: "Centralized, encrypted storage for every employee document and performance record." },
    { title: "Training Intelligence", icon: GraduationCap, desc: "Assign and track state-mandated CEU training modules directly in the platform." },
    { title: "Incident Tracking", icon: ClipboardList, desc: "Structured logs for staff incidents and professional development plans." },
    { title: "HR Analytics", icon: Activity, desc: "Monitor retention rates and staffing costs across multiple facilities." }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      {/* ---------------- HR Hero ---------------- */}
      <section className="pt-32 pb-20 px-6 lg:px-[10vw] bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1653566031535-bcf33e1c2893?fm=jpg&q=60&w=2000&auto=format&fit=crop"
            alt="Collaboration background"
            className="w-full h-full object-cover opacity-[0.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full border border-accent/30 bg-accent/10 text-accent backdrop-blur-md">
              <UserCheck className="w-4 h-4" />
              Coming Soon: Compliance-First HR
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
              The Engine of <br />
              <span className="text-accent underline decoration-accent/20 underline-offset-8">Compliant Growth.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              Proben IDD Consultants is engineered specifically for the unique DSP staffing and HCBS 
              compliance burdens of residential care. We automate the entire employee lifecycle—from 
              recruitment and background checks to continuous certification tracking and retention analytics.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
              <Link href="/signup" className="w-full sm:w-auto bg-accent hover:bg-accent-light text-navy-900 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]">
                Sign Up Now
              </Link>
              <Link href="/contact" className="w-full sm:w-auto bg-white border border-slate-200 hover:border-accent text-slate-900 px-8 py-4 rounded-xl font-bold transition-all">
                Request HR Audit
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50 lg:rotate-2 transition-transform hover:rotate-0 duration-700">
            <img 
              src="https://images.unsplash.com/photo-1653566031535-bcf33e1c2893?fm=jpg&q=60&w=1500&auto=format&fit=crop"
              alt="Professional HR coordination"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      {/* ---------------- Clean Metrics Section ---------------- */}
      <section className="py-16 px-6 lg:px-[10vw] bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {hrMetrics.map((item, i) => (
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

      {/* ---------------- Detailed Content Section: DSP Lifecycle ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-white overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000"
            alt="Process background"
            className="w-full h-full object-cover opacity-[0.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="relative">
            <div className="bg-navy-900 rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden group border border-accent/20">
              <div className="absolute inset-0 z-0 opacity-70 group-hover:scale-110 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000"
                  alt="Retention Intelligence"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
              </div>

              <div className="relative z-10 aspect-square rounded-[2rem] overflow-hidden flex flex-col items-center justify-center p-12 text-center text-white">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 backdrop-blur-xl flex items-center justify-center text-accent mb-6 border border-accent/30 shadow-2xl">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black mb-4 tracking-tight drop-shadow-md">Retention Intelligence</h4>
                <p className="text-white text-sm italic font-bold leading-relaxed drop-shadow-md">"Turnover in IDD care is often 40%+. Proben helps you identify burnout risks before they become vacancies."</p>
              </div>
            </div>
          </div>
          <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              The DSP Lifecycle <br />
              <span className="text-accent underline decoration-accent/10 underline-offset-8">Management.</span>
            </h2>
            <p>
              Direct Support Professionals (DSPs) are the heartbeat of IDD care. Yet, administrative 
              bottlenecks often lead to high turnover and compliance gaps. Proben removes the 
              friction, providing a seamless mobile onboarding experience that gets staff into 
              the field faster.
            </p>
            <ul className="space-y-4">
              {[
                "Automated Background & OIG Exclusion Checks",
                "Digital Signature Workflows for Handbooks & I-9s",
                "Mobile-First Document Uploads for Credentials"
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-center text-base font-bold text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- Feature Grid ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Audit-Proof Infrastructure.</h2>
            <p className="text-slate-500 text-lg">Access every DSP certification and state-mandated training record in one click. Audit-shielding built-in.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hrFeatures.map((feature, i) => (
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

      {/* ---------------- Compliance Details Section ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="space-y-6">
              <h3 className="text-3xl font-black text-slate-900">Zero-Missing Document Policy.</h3>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                 Proben’s "Compliance Automator" doesn't just track documents—it predicts 
                 expirations. Receive 90, 60, and 30-day alerts for every TB test, CPR 
                 certification, and license renewal across your entire workforce.
              </p>
              <div className="bg-accent/5 p-6 rounded-2xl border border-accent/10">
                 <p className="text-sm font-bold text-accent uppercase tracking-widest mb-2">Audit Assurance</p>
                 <p className="text-slate-700 text-sm leading-relaxed font-medium italic">
                    "When the state auditors arrived, we pulled the complete personnel file 
                    for 50 employees in under 4 minutes. Not a single document was missing."
                 </p>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: "TB Tests", icon: ShieldCheck },
                { label: "CPR Certs", icon: GraduationCap },
                { label: "OIG Checks", icon: UserCheck },
                { label: "State DL", icon: FileText }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-3 text-center group hover:bg-white hover:shadow-lg transition-all">
                  <item.icon className="w-8 h-8 text-accent" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-900">{item.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ---------------- HR CTA Banner ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw]">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[3rem] bg-navy-900 p-12 md:p-20 text-center text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
              Ready to automate your <span className="text-accent underline decoration-white/20">HR compliance?</span>
            </h2>
            <p className="text-lg text-slate-400 mb-12 font-medium leading-relaxed">
              Book a 15-minute diagnostic audit of your staff records. Most facilities 
              save an average of 40 hours in administrative labor within the first 60 days.
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
