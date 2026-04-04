'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles, Activity } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle, imageSrc, imageAlt }) {
  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Left Side: Visual/Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-navy-900 items-center justify-center overflow-hidden">
        {/* Elite Mesh Gradient Engine */}
        <div className="absolute inset-0 z-0 opacity-60">
           <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-accent mix-blend-screen filter blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-lime-400 mix-blend-screen filter blur-[100px] animate-float-slow" />
           <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500 mix-blend-overlay filter blur-[80px] animate-bounce-soft" />
        </div>
        
        <div className="relative z-10 w-full max-w-xl px-16 text-center">
          {/* Elite Brand Node */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 flex justify-center"
          >
            <div className="p-8 rounded-[3rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(130,195,65,0.2)] group transition-all duration-500 hover:scale-105 hover:bg-white/15">
              <Image 
                src="/logo.png" 
                alt="Proben Logo" 
                width={100} 
                height={100} 
                className="object-contain brightness-0 invert opacity-100 drop-shadow-[0_0_15px_rgba(130,195,65,0.5)]" 
                priority 
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-6xl font-black text-white leading-tight mb-8 tracking-tighter">
              {title || 'Healthcare Coordination, Simplified.'}
            </h1>
            <div className="flex items-center justify-center gap-4 mb-10">
               <span className="h-px w-12 bg-accent/30" />
               <p className="text-sm font-black text-accent uppercase tracking-[0.4em]">Enterprise Intelligence</p>
               <span className="h-px w-12 bg-accent/30" />
            </div>
            <p className="text-xl text-white/60 font-medium leading-relaxed max-w-md mx-auto">
              {subtitle || 'Manage your medical ecosystem with precision and ease. Welcome to the next generation of healthcare.'}
            </p>
          </motion.div>

          {/* Abstract Data Flow Grid */}
          <div className="mt-20 flex justify-center opacity-20">
            <div className="grid grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i} 
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2 + i, 
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                  className="w-10 h-10 rounded-2xl bg-accent transform rotate-12" 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Global Tactical Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #82C341 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
        />
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-20 relative bg-white">
        
        {/* Saturated Background Glow for Right Side */}
        <div className="absolute inset-0 -z-10 bg-slate-50 opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-lg">
            {/* Elite Header Coordination */}
            <div className="flex justify-between items-center mb-16 lg:mb-24">
                <div className="lg:hidden p-3 bg-navy-900 rounded-2xl shadow-xl">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain brightness-0 invert" />
                </div>
                <Link href="/" className="group text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy-900 transition-all flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-primary shadow-sm transition-all">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                    Gateway Control
                </Link>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-2 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(10,17,40,0.08)] border border-slate-100 relative"
            >
               <div className="p-8 sm:p-12">
                 {children}
               </div>

               {/* Decorative Pulse Marker */}
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-navy-900 rounded-full border border-white/10 shadow-xl flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Secure Module</span>
               </div>
            </motion.div>

            {/* Tactical Footer Coordination */}
            <div className="mt-20 pt-10 border-t border-slate-50 flex flex-wrap justify-center gap-x-10 gap-y-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                <Link href="/privacy" className="hover:text-accent transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-slate-200 rounded-full" /> Privacy</Link>
                <Link href="/terms" className="hover:text-accent transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-slate-200 rounded-full" /> Protocols</Link>
                <Link href="/support" className="hover:text-accent transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-slate-200 rounded-full" /> Liaison</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
