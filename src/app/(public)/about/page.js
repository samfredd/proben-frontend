import React from "react";
import Navbar from "@/components/layout/navbar";
import Image from "next/image";
import FooterSection from "@/sections/public/home/footer";
import { ShieldCheck, Target, Users, BookOpen, HeartPulse, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const values = [
    { 
      title: "Operational Excellence", 
      desc: "We believe that group homes deserve the same enterprise-grade infrastructure as large hospitals.",
      icon: Target
    },
    { 
      title: "HIPAA-First Culture", 
      desc: "Security and compliance aren't just features; they are the foundation of everything we build.",
      icon: ShieldCheck
    },
    { 
      title: "Care-Centric Growth", 
      desc: "By solving the administrative burden, we allow providers to focus on what matters: the residents.",
      icon: HeartPulse
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      {/* ---------------- About Page Hero ---------------- */}
      <section className="pt-32 pb-20 px-6 lg:px-[10vw] bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Narrative Focus */}
          <div className="max-w-2xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-8">
              <BookOpen className="w-4 h-4" />
              Our Mission
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
              Reliable infrastructure <br />
              <span className="text-accent underline underline-offset-8 decoration-slate-100 italic">for humans.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              Proben was founded by healthcare operators who knew the administrative friction 
              stifling group home care was optional. We’re building the logic that lets your team lead with care.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-accent rounded-full"></div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Built by operators</p>
            </div>
          </div>

          {/* Right: Immersive Image Frame */}
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-50 rotate-2 group hover:rotate-0 transition-transform duration-700">
            <Image 
              src="https://images.unsplash.com/photo-1516841273335-e39b37888115?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0"
              alt="Professional collaboration"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent opacity-60 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ---------------- Narrative Vision Section ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <div className="grid grid-cols-2 gap-6 relative">
            {/* Visual Accents */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 blur-[80px] rounded-full" />
            
            <div className="h-80 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative group">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1500"
                alt="Modern workspace"
                fill
                className="object-cover brightness-95 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 font-bold text-white drop-shadow-md">Est. 2026</div>
            </div>
            <div className="h-80 bg-navy-900 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 blur-3xl rounded-full" />
               <Users className="w-12 h-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
               <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Nationwide</p>
               <p className="text-xl font-black">Serving care providers across the United States</p>
            </div>
          </div>

          <div className="space-y-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Engineered by collectors, <br />
              <span className="text-accent underline underline-offset-4 decoration-accent/20">redefined by care.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Most software for residential care is shrunken-down hospital systems. 
              We took the opposite approach. We architect from the group home floor up—understanding 
              the specific codes, staffing ratios, and regulatory nuances unique to this industry.
            </p>
            
            <div className="relative p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-black font-black text-2xl shadow-lg ring-4 ring-white">"</div>
              <p className="italic text-xl text-slate-800 leading-relaxed font-medium mb-6">"Group homes are the invisible backbone of US care. We’re finally giving them the authority tools they deserve."</p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">— Proben Leadership</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- Premium Value Grid ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase tracking-widest">Our Founding Logic</h2>
             <div className="w-20 h-1.5 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v, i) => (
              <div key={i} className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-2">
                <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-accent group-hover:text-black transition-colors">
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:translate-x-1 transition-transform">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- High-Impact CTA Banner ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-white">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[3rem] bg-black p-12 md:p-20 text-center">
          {/* Abstract Glows */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              Ready to recover your <span className="text-accent underline decoration-white/20">hidden revenue?</span>
            </h2>
            <p className="text-lg text-slate-400 mb-12">
              Book a 15-minute diagnostic audit of your recent billing logs. Most group homes 
              recover an average of 14% in previously denied claims within the first 60 days.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-black px-10 py-5 rounded-full font-bold transition-all shadow-2xl active:scale-95">
                Request Billing Audit
              </button>
              <button className="w-full sm:w-auto text-white font-bold px-8 py-4 opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2">
                Join the Waitlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}