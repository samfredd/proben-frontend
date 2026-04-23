"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  TrendingUp,
  Layout,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------------------------- DATA ---------------------------------- */

const SLIDES = [
  {
    tag: "Core Billing Solutions",
    title: "Billing Excellence.",
    highlight: "Care Redefined.",
    description:
      "Specialized Medicaid and HCBS billing for IDD providers. Improve reimbursement reliability with healthcare-grade operational consulting.",
    metric: "99% Clean Claim Rate",
    ctaPrimary: { text: "Book Consultation", href: "/contact" },
    ctaSecondary: { text: "Explore Services", href: "/services/billing" },
    bgImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000",
  },
  {
    tag: "Future Infrastructure",
    title: "The Future of Care.",
    highlight: "Built Today.",
    description:
      "Scheduling, HR management, and person-centered portals designed specifically for IDD residential operations.",
    metric: "Digital-First Ops",
    ctaPrimary: { text: "Register Now", href: "/signup" },
    ctaSecondary: { text: "Explore Services", href: "/services/billing" },
    bgImage: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=2000",
  },
  {
    tag: "Security & Compliance",
    title: "Secure. Compliant.",
    highlight: "Scalable.",
    description:
      "HIPAA-aligned infrastructure engineered to protect sensitive healthcare data while growing with your organization.",
    metric: "HIPAA Compliant",
    ctaPrimary: { text: "Get Protected", href: "/contact" },
    ctaSecondary: { text: "Billing Solutions", href: "/services/billing" },
    bgImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000",
  },
];

/* -------------------------------- COMPONENT -------------------------------- */

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black pt-20 pb-12 md:pb-0">
      
      {/* ---------------- Background Layer ---------------- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img 
              src={slide.bgImage}
              alt="Professional healthcare management"
              className="w-full h-full object-cover brightness-[0.65]"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Dynamic Glows for "Pop" */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-30 pointer-events-none z-10">
          <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-accent/20 blur-[130px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full animate-pulse decoration-delay-2000" />
        </div>
        
        {/* Dark Refined Gradient Overlays (Softer) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 opacity-30 z-20" />
      </div>

      {/* ---------------- Main Content ---------------- */}
      <div className="relative z-10 w-full px-6 text-center max-w-5xl py-12 md:py-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04, y: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Tag / Phase */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full border border-white/20 bg-white/10 text-accent backdrop-blur-md shadow-2xl">
              <Activity className="w-3.5 h-3.5" />
              {slide.tag}
            </div>

            {/* Huge Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1] tracking-tight mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {slide.title}
              <br />
              <span className="text-accent brightness-110 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {slide.highlight}
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              {slide.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href={slide.ctaPrimary.href}
                className="group relative inline-flex items-center gap-3 bg-accent px-10 py-5 rounded-full font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(var(--accent-rgb),0.15)]"
              >
                {slide.ctaPrimary.text}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/80 text-white transition-transform group-hover:rotate-45">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              
              <Link
                href={slide.ctaSecondary.href}
                className="group px-8 py-4 text-slate-300 font-bold transition-all hover:text-accent relative"
              >
                {slide.ctaSecondary.text}
                <span className="absolute bottom-3 left-8 right-8 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---------------- Bottom Stats Bar ---------------- */}
      <div className="relative md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 w-[calc(100%-48px)] max-w-6xl z-20 mt-auto md:mt-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-1 p-1 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-5 p-4 md:p-8 bg-white/[0.02] border-r border-white/5 rounded-2xl group transition-colors hover:bg-white/5">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent ring-1 ring-accent/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">99%</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Success Rate</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4 md:p-8 bg-white/[0.02] border-r border-white/5 rounded-2xl group transition-colors hover:bg-white/5">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent ring-1 ring-accent/20 group-hover:scale-110 transition-transform">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">Any ERP</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Universal Support</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4 md:p-8 bg-white/[0.02] rounded-2xl group transition-colors hover:bg-white/5">
            <div className="w-12 h-12 rounded-xl bg-accent/5 flex items-center justify-center text-accent/60 ring-1 ring-accent/20 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">AES-256</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Security Grade</p>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}