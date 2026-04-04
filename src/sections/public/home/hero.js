'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  ArrowRight,
  TrendingUp,
  Layout,
  Lock,
  Sparkles,
  Shield,
  Zap,
  CheckCircle,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    tag: "Operational Excellence",
    title: "Precision Billing.",
    highlight: "Revenue Redefined.",
    description: "Enterprise-grade revenue cycle management for behavioral health assets. Optimized reimbursement via clinical-grade intelligence.",
    metric: "99% Settlement Rate",
    ctaPrimary: { text: "Book Consultation", href: "/contact" },
    ctaSecondary: { text: "Protocol Hub", href: "/services/billing" },
    bgImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000",
  },
  {
    tag: "Future Infrastructure",
    title: "The Future of Care.",
    highlight: "Managed Today.",
    description: "High-density scheduling, member coordination, and operational command portals designed for high-stakes healthcare clusters.",
    metric: "Elite Coordination",
    ctaPrimary: { text: "Join Waitlist", href: "/waitlist" },
    ctaSecondary: { text: "Explore Tiers", href: "/pricing" },
    bgImage: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=2000",
  },
  {
    tag: "Security Protocols",
    title: "Secure. Compliant.",
    highlight: "Authorized.",
    description: "AES-256 encrypted infrastructure engineered for total data sovereignty. HIPAA-aligned and enterprise-proven.",
    metric: "Global Compliance",
    ctaPrimary: { text: "Enable Protection", href: "/contact" },
    ctaSecondary: { text: "System Audit", href: "/about" },
    bgImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-navy-900 pt-32 pb-24 md:pb-0">
      
      {/* ── Dynamic Elite Mesh Engine ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image 
              src={slide.bgImage}
              alt="Elite Healthcare Management"
              fill
              priority
              className="object-cover brightness-[0.45] saturate-[0.8]"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Layered Saturated Orbs */}
        <div className="absolute inset-0 opacity-40 z-10 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full animate-bounce-soft" />
        </div>
        
        {/* Elite Gradient Masking */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-transparent to-navy-900/95 z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-transparent to-navy-900/80 opacity-60 z-20" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-20" 
             style={{ backgroundImage: 'radial-gradient(circle, #82C341 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
        />
      </div>

      {/* ── Main Content Integration ── */}
      <div className="relative z-30 w-full px-6 text-center max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, letterSpacing: "-0.05em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "-0.02em" }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Elite Tactical Tag */}
            <div className="inline-flex items-center gap-3 px-6 py-2 mb-10 text-[10px] font-black tracking-[0.4em] uppercase rounded-full border border-white/10 bg-white/5 text-accent backdrop-blur-xl shadow-2xl">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              {slide.tag}
            </div>

            {/* Tactical Hyper-Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {slide.title}
              <br />
              <span className="text-accent brightness-110 drop-shadow-[0_0_30px_rgba(130,195,65,0.4)]">
                {slide.highlight}
              </span>
            </h1>

            {/* Precision Sub-headline */}
            <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              {slide.description}
            </p>

            {/* Elite Action Matrix */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href={slide.ctaPrimary.href}
                className="group relative inline-flex items-center gap-4 bg-accent px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] text-navy-900 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_-10px_rgba(130,195,65,0.3)] hover:shadow-[0_25px_60px_-10px_rgba(130,195,65,0.5)]"
              >
                {slide.ctaPrimary.text}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-900 text-accent transition-transform group-hover:rotate-45 shadow-lg">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
              
              <Link
                href={slide.ctaSecondary.href}
                className="group px-10 py-5 text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:text-accent relative overflow-hidden"
              >
                {slide.ctaSecondary.text}
                <span className="absolute bottom-2 left-10 right-10 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Elite Saturated Stats Bar ── */}
      <div className="relative md:absolute md:bottom-12 md:left-1/2 md:-translate-x-1/2 w-[calc(100%-48px)] max-w-7xl z-40 mt-20 md:mt-0 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden glass-card-saturated"
        >
          <div className="flex items-center gap-6 p-6 md:p-10 bg-white/[0.03] group transition-all hover:bg-white/10 cursor-default">
            <div className="w-16 h-16 rounded-[1.5rem] bg-accent/20 flex items-center justify-center text-accent ring-1 ring-accent/30 group-hover:scale-110 transition-transform shadow-lg shadow-accent/10">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tighter">99.9%</p>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-accent/60 mt-1">Settlement Efficiency</p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-6 md:p-10 bg-white/[0.03] group transition-all hover:bg-white/10 cursor-default border-x border-white/5">
            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600/20 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/30 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
              <Layout className="w-8 h-8" />
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tighter">UNIFIED</p>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-blue-400/60 mt-1">Global ERP Access</p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-6 md:p-10 bg-white/[0.03] group transition-all hover:bg-white/10 cursor-default">
            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-600/20 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/30 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tighter">AES-256</p>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-400/60 mt-1">Platform Sovereignty</p>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}