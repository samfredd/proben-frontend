import React from "react";
import Navbar from "@/components/layout/navbar";
import Image from "next/image";
import FooterSection from "@/sections/public/home/footer";
import { CheckCircle2, ArrowRight, ShieldCheck, BarChart3, Clock, Zap, UserCheck } from "lucide-react";

export default function BillingServices() {
  const benefits = [
    "99% Clean Claim Rate",
    "15-Day Average Payout Cycle",
    "Full HIPAA Compliance",
    "Real-time Revenue Analytics",
    "Dedicated Account Manager",
    "Direct EDI Integration"
  ];

  const workflow = [
    { title: "Digital Intake", desc: "Securely upload your resident data and service logs to our encrypted portal." },
    { title: "Expert Audit", desc: "Our specialists review every claim for accuracy before submission." },
    { title: "Direct Submission", desc: "Claims are pushed directly to payers via our high-speed EDI pipelines." },
    { title: "Resolution & Analysis", desc: "We handle denials and provide detailed revenue performance reports." }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      {/* ---------------- Simplified Billing Hero ---------------- */}
      <section className="pt-32 pb-20 px-6 lg:px-[10vw] bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              Healthcare-Grade Billing
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
              IDD Billing Excellence. <br />
              <span className="text-accent underline decoration-accent/10">Medicaid-Grade Results.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              Stop losing revenue to administrative friction. Our specialized billing services are 
              engineered specifically for IDD residential providers and complex HCBS care facilities.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-black px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]">
                Request a Billing Audit
              </button>
              <button className="w-full sm:w-auto bg-white border border-slate-200 hover:border-accent text-slate-900 px-8 py-4 rounded-xl font-bold transition-all">
                View ROI Calculator
              </button>
            </div>
          </div>

          {/* Right: Immersive Image Frame */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50 lg:rotate-2">
            <Image 
              src="https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=1500"
              alt="Professional billing management"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      {/* ---------------- Clean Metrics Section ---------------- */}
      <section className="py-16 px-6 lg:px-[10vw] bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Clean Claim Rate", value: "99%", icon: CheckCircle2, desc: "Across 50k+ processed claims" },
            { label: "Avg. Payout Time", value: "15 Days", icon: Clock, desc: "Industry leading speed" },
            { label: "Revenue Growth", value: "+24%", icon: BarChart3, desc: "First 6 months average" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 group hover:border-accent transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent ring-1 ring-accent/20 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 mb-1">{item.value}</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{item.label}</p>
                <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- High-Fidelity Workflow ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">The Proben Optimized Workflow</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">A data-driven pipeline designed for maximum transparency and zero-friction reimbursement.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-px bg-slate-100 -z-10" />
          
          {workflow.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center font-bold text-2xl mb-8 group-hover:border-accent group-hover:text-accent transition-all shadow-sm relative z-10 bg-white">
                <span className="opacity-40 text-sm absolute -top-1 -left-1 bg-slate-50 w-6 h-6 rounded-lg flex items-center justify-center border border-slate-100">{i + 1}</span>
                {i === 0 && <Clock className="w-6 h-6" />}
                {i === 1 && <ShieldCheck className="w-6 h-6" />}
                {i === 2 && <Zap className="w-6 h-6" />}
                {i === 3 && <BarChart3 className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Enterprise Benefits Grid ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw] bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Enterprise Infrastructure</h2>
            <p className="text-slate-500 text-lg">We don't just process claims; we optimize your entire financial foundation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "99% Clean Claim Rate", icon: CheckCircle2, desc: "Rigorous automated scrubbing for error-free submissions." },
              { title: "15-Day Payout Cycle", icon: Clock, desc: "Accelerating cash flow through high-speed EDI pipelines." },
              { title: "Medicaid & HCBS Compliance", icon: ShieldCheck, desc: "Military-grade data protection aligned with state-specific IDD regulations." },
              { title: "Real-time Analytics", icon: BarChart3, desc: "Instant visibility into denials, aging, and payouts." },
              { title: "Dedicated Manager", icon: UserCheck, desc: "Direct access to revenue specialists for custom strategy." },
              { title: "Direct EDI Integration", icon: Zap, desc: "Zero-friction link between your EMR and major payers." }
            ].map((benefit, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- High-Impact CTA Banner ---------------- */}
      <section className="py-24 px-6 lg:px-[10vw]">
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
              <button className="w-full sm:w-auto text-white font-bold px-8 py-4 opacity-60 hover:opacity-100 transition-opacity">
                Explore the ROI Calculator
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
