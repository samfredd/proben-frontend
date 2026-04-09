"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden bg-navy-900">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-accent/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-[15vw] relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl flex flex-col items-center gap-10"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px]">
              Ready to Optimize?
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Secure your <span className="text-accent">revenue recovery</span> today.
            </h2>
          </div>
          
          <p className="text-slate-400 text-lg lg:text-xl leading-relaxed max-w-2xl px-4">
            Join the group home providers who have already reclaimed 15-25% of their monthly billing revenue. 
            Request a professional audit or join the software waitlist.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <Link href="/contact" className="bg-accent hover:bg-accent-light text-navy-900 px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-accent/20 active:scale-[0.98] flex items-center gap-3">
              Request a Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/signup" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl font-bold transition-all backdrop-blur-md active:scale-[0.98]">
              Register Now
            </Link>
          </div>

          <div className="flex items-center gap-3 text-accent font-bold uppercase tracking-widest text-[10px]">
            <ShieldCheck className="w-4 h-4" />
            HIPAA Compliant | Secure Infrastructure
          </div>
        </motion.div>
      </div>
    </section>
  );
}
