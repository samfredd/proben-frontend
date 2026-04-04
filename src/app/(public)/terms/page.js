import React from "react";
import Navbar from "@/components/layout/navbar";
import FooterSection from "@/sections/public/home/footer";
import { Gavel, CheckCircle2, AlertCircle, FileText } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Service Scope",
      content: "Proben Group Home Consultants provide administrative billing coordination and operations software. We are not a medical provider and do not offer clinical advice. All clinical compliance remains the sole responsibility of the facility operator.",
      icon: Gavel
    },
    {
      title: "2. Subscription & Payments",
      content: "Billing services are charged as a percentage of recovered revenue, while software modules (Phase 2+) are billed on a monthly subscription basis. Late payments exceeding 30 days may result in service suspension or data access restrictions.",
      icon: CheckCircle2
    },
    {
      title: "3. Compliance Responsibilities",
      content: "While Proben provides the infrastructure for HIPAA-compliant data processing, client facilities are responsible for maintaining their own internal compliance training, resident consent logs, and secure access protocols at the facility level.",
      icon: AlertCircle
    },
    {
      title: "4. Termination of Service",
      content: "Either party may terminate service agreements with 30-day written notice. Upon termination, client facilities will have 60 days to export their administrative data before permanent deletion from Proben's encrypted production environment.",
      icon: FileText
    }
  ];

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-20 px-6 lg:px-[15vw] bg-white border-b border-slate-200">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Gavel className="w-4 h-4" />
            Legal Terms
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            By partnering with Proben Group Home Consultants, you agree to these operational standards. 
            These terms ensure a secure, fair, and reliable working relationship between our firm and your healthcare facility.
          </p>
          <p className="mt-8 text-sm text-slate-400 font-medium italic">
            Last Updated: April 2, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6 lg:px-[15vw]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {sections.map((s, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-accent/30 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform"></div>
              
              <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center mb-8">
                <s.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{s.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {s.content}
              </p>
            </div>
          ))}

          <div className="md:col-span-2 p-8 bg-navy-900 rounded-[2rem] text-white space-y-6 mt-12 text-center">
            <h3 className="text-2xl font-bold">Questions about our legal framework?</h3>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our legal and compliance teams are available to discuss enterprise customizations or custom service agreements.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <a href="mailto:legal@probengroup.com" className="bg-accent text-navy-900 px-8 py-3 rounded-xl font-bold hover:bg-accent-light transition-all">
                Contact Legal
              </a>
              <a href="/contact" className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all">
                Support Hub
              </a>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
