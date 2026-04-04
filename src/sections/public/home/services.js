"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, BarChart3, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function ServicesSection() {
  const billingFeatures = [
    { title: "EDI Integration", desc: "Native electronic data interchange for high-speed claim submission." },
    { title: "Clean Claim Audit", desc: "Pre-submission human-in-the-loop audit for 99% accuracy." },
    { title: "Revenue Recovery", desc: "Specialized denial management and historical claim audits." },
    { title: "Compliance Gate", desc: "Continuous HIPAA and regulatory compliance monitoring." }
  ];

  return (
    <section className="py-24 bg-white px-6 lg:px-[15vw]">
      <div className="container mx-auto">
        {/* Phase Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <div className="px-3 py-1 bg-accent/5 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/10">
            Phase 1: Available Now
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Specialized <span className="text-accent">Billing Services</span>
          </h2>
          <p className="text-slate-500 max-w-2xl text-lg mt-4 leading-relaxed">
            Operational excellence designed specifically for group home providers. 
            We handle the complexity so you can focus on care.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {billingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-accent transition-all group"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-accent mb-6 shadow-sm group-hover:bg-accent group-hover:text-navy-900 transition-all">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Focus Transition Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-navy-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 blur-3xl rounded-full translate-x-1/3"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Beyond Billing.</h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                While we specialize in immediate revenue recovery through billing, 
                our platform is evolving into a complete Operational OS for healthcare facilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services/billing" className="bg-accent hover:bg-accent-light text-navy-900 px-8 py-4 rounded-xl font-bold text-center transition-all">
                  Billing Workflow
                </Link>
                <Link href="/waitlist" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-center transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                  Join Waitlist
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <BarChart3 className="w-8 h-8 text-accent mb-4" />
                <p className="text-2xl font-bold">+24%</p>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Rev Growth</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <Clock className="w-8 h-8 text-accent mb-4" />
                <p className="text-2xl font-bold">15 Days</p>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Avg. Payout</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
