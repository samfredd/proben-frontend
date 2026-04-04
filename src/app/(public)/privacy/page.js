import React from "react";
import Navbar from "@/components/layout/navbar";
import FooterSection from "@/sections/public/home/footer";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Data We Collect",
      content: "As a HIPAA-compliant billing service, we collect minimal personal identifyable information (PII) required for operational coordination. This includes facility contact details, administrative user credentials, and encrypted resident service logs necessary for billing submission.",
      icon: Eye
    },
    {
      title: "2. HIPAA & Security",
      content: "Proben Group Home Consultants adheres to all Business Associate Agreement (BAA) requirements. Data is encrypted in transit using TLS 1.3 and at rest using AES-256 standards. Our personnel undergo regular compliance training to ensure clinical data integrity.",
      icon: ShieldCheck
    },
    {
      title: "3. Third-party Sharing",
      content: "We never sell your data. Information is shared strictly with government payers, insurance clearinghouses, and contracted software partners (such as Focus integration) solely for the purpose of executing billing and administrative functions.",
      icon: Lock
    },
    {
      title: "4. Your Control",
      content: "Facility administrators retain full ownership of their data. You may request data exports or account termination at any time. We maintain audit logs of all access to ensure transparency and accountability.",
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
            <Lock className="w-4 h-4" />
            Security First
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            At Proben Group Home Consultants, we treat your facility's data with the same care as you treat your residents. 
            Our privacy protocols are built to exceed industry standards for long-term care administration.
          </p>
          <p className="mt-8 text-sm text-slate-400 font-medium italic">
            Last Updated: April 2, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6 lg:px-[15vw]">
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.map((s, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                <s.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {s.content}
                </p>
              </div>
            </div>
          ))}

          <div className="p-8 bg-navy-900 rounded-[2rem] text-white space-y-6 mt-12">
            <div className="flex items-center gap-3 text-accent uppercase tracking-widest font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              BAA Compliant
            </div>
            <h3 className="text-xl font-bold italic leading-relaxed">
              "Privacy in healthcare isn't a feature; it's the foundation of trust between a provider and their community."
            </h3>
            <div className="pt-4 border-t border-white/10 text-slate-400 text-sm">
              For specific legal inquiries or to sign a BAA with Proben, please contact our compliance team at <a href="mailto:security@probengroup.com" className="text-accent hover:underline">security@probengroup.com</a>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
