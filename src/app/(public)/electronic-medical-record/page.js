"use client";

import React from "react";
import Navbar from "@/components/layout/navbar";
import Link from "next/link";
import FooterSection from "@/sections/public/home/footer";
import { 
  Activity, 
  Stethoscope, 
  Pill, 
  ShieldCheck, 
  BarChart3, 
  HeartPulse, 
  CheckCircle2, 
  FileLock2, 
  Zap,
  ClipboardCheck
} from "lucide-react";

export default function ElectronicMedicalRecordPage() {
  const emrMetrics = [
    { label: "Med-Admin Accuracy", value: "99.9%", icon: Pill, desc: "Barcode-verified administration pipelines." },
    { label: "Audit Pass Rate", value: "100%", icon: ClipboardCheck, desc: "Across 200+ state inspections." },
    { label: "Data Security", value: "AES-256", icon: FileLock2, desc: "Military-grade encryption for PHI." }
  ];

  const emrFeatures = [
    { title: "Person-Centered Charting", icon: Stethoscope, desc: "Goal-based clinical charting designed for residential care and community-living support." },
    { title: "eMAR System", icon: Pill, desc: "Electronic meds-administration with real-time miss-dose alerts and sign-offs." },
    { title: "Vitals Hub", icon: HeartPulse, desc: "Track weight, BP, and behavioral markers with automated trend analysis." },
    { title: "HIPAA Vault", icon: FileLock2, desc: "Secure, encrypted storage for all patient records and diagnostic files." },
    { title: "Incident Command", icon: Activity, desc: "Automated state-report generation for clinical and safety incidents." },
    { title: "Doctor Portal", icon: Zap, desc: "Secure view-only access for visiting physicians and care coordinators." }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      {/* ---------------- EMR Hero ---------------- */}
      <section className="pt-32 pb-20 px-6 lg:px-[10vw] bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055?fm=jpg&q=60&w=2000&auto=format&fit=crop"
            alt="Data background"
            className="w-full h-full object-cover opacity-[0.03] grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full border border-accent/30 bg-accent/10 text-accent backdrop-blur-md">
              <Activity className="w-4 h-4" />
              Coming Soon: Clinical Intelligence Hub
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
              Clinical Data for <br />
              <span className="text-accent underline decoration-accent/20 underline-offset-[1.5rem]">Empowered Care.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              Moving beyond binders. Proben IDD Consultants centralizes every clinical touchpoint 
              into a secure, intuitive digital ecosystem. We bridge the gap between complex 
              HCBS regulations and operational excellence, ensuring your facility remains 
              audit-ready and HIPAA-compliant 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
              <Link href="/signup" className="w-full sm:w-auto bg-accent hover:bg-accent-light text-navy-900 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]">
                Sign Up Now
              </Link>
              <Link href="/contact" className="w-full sm:w-auto bg-white border border-slate-200 hover:border-accent text-slate-900 px-8 py-4 rounded-xl font-bold transition-all">
                Book Clinical Audit
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50 lg:-rotate-2 transition-transform hover:rotate-0 duration-700">
            <img 
              src="https://images.unsplash.com/photo-1666886573212-2de95596d509?fm=jpg&q=60&w=1500&auto=format&fit=crop"
              alt="Electronic Medical Record interface"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      {/* ---------------- Clean Metrics Section ---------------- */}
      <section className="py-16 px-6 lg:px-[10vw] bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {emrMetrics.map((item, i) => (
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

      {/* ---------------- Detailed Content Section: Clinical Governance ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-white overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1558444458-5cd055848bb0?auto=format&fit=crop&q=80&w=2000"
            alt="Infrastructure background"
            className="w-full h-full object-cover opacity-[0.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-white via-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
            <div className="relative space-y-8 text-slate-600 leading-relaxed text-lg">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                The Clinical <br />
                <span className="text-accent">Governance Framework.</span>
              </h2>
              <p>
                Proben’s EMR isn’t just a storage tool; it’s a governance engine. For IDD providers, 
                maintaining the "Paper Trail" for state audits is the single largest administrative 
                burden. We automate this trail from the moment a DSP signs in.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="mt-1.5 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <p className="text-sm font-medium italic">"We reduced our audit preparation time from 3 weeks to 3 hours using Proben’s incident auto-reporting."</p>
                </div>
              </div>
              <p className="text-base">
                Our architecture ensures that every note, every vitals check, and every med-pass 
                is time-stamped, geo-verified, and cross-referenced with the patient’s Individual 
                Support Plan (ISP). This isn’t data entry—it’s clinical integrity.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="bg-navy-900 rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden group border border-accent/20">
              <div className="absolute inset-0 z-0 opacity-70 group-hover:scale-110 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055?fm=jpg&q=60&w=1000&auto=format&fit=crop"
                  alt="Real-Time Clinical Monitoring"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
              </div>

              <div className="relative z-10 aspect-video rounded-[2rem] overflow-hidden flex flex-col items-center justify-center border border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 backdrop-blur-xl flex items-center justify-center text-accent mb-6 border border-accent/30 animate-pulse shadow-2xl">
                  <BarChart3 className="w-8 h-8" />
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 group-hover:bg-accent/10 transition-colors shadow-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    <p className="text-accent text-[10px] font-black uppercase tracking-widest drop-shadow-md">Real-Time Monitoring</p>
                  </div>
                  <p className="text-white font-black text-sm tracking-tight drop-shadow-md">HIPAA-SECURE DATA STREAM ACTIVE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Feature Grid ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">The Digital Patient File.</h2>
            <p className="text-slate-500 text-lg">Centralize medication records, clinical charts, and incident logs with military-grade security.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {emrFeatures.map((feature, i) => (
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

      {/* ---------------- Medication Safety Protocol Section ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-10">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-accent/10 text-accent">
              <Pill className="w-3 h-3" />
              Safety-First Engineering
           </div>
           <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
              Eliminating the <span className="text-accent underline decoration-accent/20 underline-offset-8">Med-Pass Error.</span>
           </h2>
           <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Proben’s eMAR module is built with double-verification logic. By integrating 
              pharmacy data feeds directly into the clinician’s tablet, we ensure the 6 Rights 
              of Medication Administration are hard-coded into your workflow. No more missed 
              doses, no more illegible signatures.
           </p>
           <div className="pt-8 flex flex-wrap justify-center gap-12">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full border-2 border-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <p className="text-[10px] font-black uppercase text-slate-400">Barcode Verify</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full border-2 border-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <p className="text-[10px] font-black uppercase text-slate-400">Pharmacy Sync</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full border-2 border-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <p className="text-[10px] font-black uppercase text-slate-400">Miss-Pass Alerts</p>
              </div>
           </div>
        </div>
      </section>

      {/* ---------------- EMR CTA Banner ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw]">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[3rem] bg-navy-900 p-12 md:p-20 text-center text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight">
              Move beyond binders and <span className="text-accent underline decoration-white/20 underline-offset-8">paper burden.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-12 font-medium leading-relaxed">
              Book a clinical workflow audit today. Reduce med-admin errors by 99% and ensure 
              your IDD facility is always audit-ready with Proben IDD Consultants.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/signup" className="bg-accent hover:bg-accent-light text-navy-900 px-10 py-5 rounded-full font-bold transition-all shadow-2xl active:scale-95 text-center">
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
