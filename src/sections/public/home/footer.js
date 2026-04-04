'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, ArrowRight, Activity, Zap, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function FooterSection() {
  return (
    <footer className="bg-navy-900 pt-32 pb-16 px-8 lg:px-[12vw] text-white overflow-hidden relative border-t border-white/5">
      {/* Elite Mesh Footer Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none opacity-30"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24 relative z-10">
        {/* Column 1: Brand Node */}
        <div className="md:col-span-5 flex flex-col gap-10">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-accent transition-all shadow-2xl">
               <Image 
                 src="/logo.png" 
                 alt="Proben Logo" 
                 width={50} 
                 height={50} 
                 className="brightness-0 invert h-10 w-10 object-contain" 
               />
            </div>
            <div>
               <span className="text-sm font-black uppercase text-white tracking-[0.2em] block">Proben Elite</span>
               <span className="text-[10px] font-black uppercase text-accent tracking-[0.4em] mt-1 block">Security Standard</span>
            </div>
          </Link>
          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
            Professional operational intelligence and revenue cycle synchronization for the future of behavioral health clusters. 
            Engineered for reliability, scaled for sovereignty.
          </p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                Network Live
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                <Shield className="w-3 h-3 text-accent" />
                HIPAA AES-256
             </div>
          </div>
        </div>
        
        {/* Column 2: Architecture */}
        <div className="md:col-span-2 flex flex-col gap-10">
          <h3 className="font-black text-accent text-[10px] uppercase tracking-[0.5em]">Architecture</h3>
          <ul className="flex flex-col gap-5 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
            {[
              { name: 'Clinical Flows', link: '/services/billing' },
              { name: 'Revenue Sync', link: '/waitlist' },
              { name: 'System Audit', link: '/contact' },
              { name: 'Liaison Hub', link: '/contact' }
            ].map((link) => (
              <li key={link.name}>
                <Link href={link.link} className="hover:text-white hover:translate-x-1 transition-all inline-block">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Protocols */}
        <div className="md:col-span-2 flex flex-col gap-10">
          <h3 className="font-black text-accent text-[10px] uppercase tracking-[0.5em]">Protocols</h3>
          <ul className="flex flex-col gap-5 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
            {[
              { name: 'About Elite', link: '/about' },
              { name: 'Technical Docs', link: '/contact' },
              { name: 'Portal Entry', link: '/login' },
              { name: 'Career Nodes', link: '#' }
            ].map((link) => (
              <li key={link.name}>
                <Link href={link.link} className="hover:text-white hover:translate-x-1 transition-all inline-block">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Command */}
        <div className="md:col-span-3 flex flex-col gap-10">
          <h3 className="font-black text-accent text-[10px] uppercase tracking-[0.5em]">Command</h3>
          <div className="flex flex-col gap-6 text-slate-400 text-sm leading-relaxed">
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">Global HQ</p>
              <p className="text-sm font-medium">Remote Operations Center <br /> United States Operations</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all">
                    <Mail className="w-5 h-5" />
                 </div>
                 <a href="mailto:strategy@probengroup.com" className="text-sm font-black text-white hover:text-accent transition-colors truncate">
                   strategy@proben.elite
                 </a>
              </div>
              <Link href="/contact" className="inline-flex items-center gap-3 text-[10px] font-black text-accent uppercase tracking-[0.3em] group mt-2 hover:text-white transition-colors">
                Initialize System Audit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Elite Status Bar ── */}
      <div className="pt-16 border-t border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] relative z-10">
        <div className="flex flex-col gap-4">
          <p className="flex items-center gap-3">
             <span className="text-white/40">© 2026 Proben Group Home Consultants.</span> 
             <span className="text-accent shadow-[0_0_10px_rgba(130,195,65,0.4)]">Tactical Standard v2.0 Active.</span>
          </p>
          <div className="normal-case tracking-normal max-w-4xl mt-4 opacity-30 text-[10px] font-medium leading-[2] group hover:opacity-100 transition-opacity">
            <strong className="text-white/60">Notice of Operations:</strong> Proben Elite is a business intelligence and administrative synchronization platform. Our infrastructure constitutes an operational coordination and fiscal settlement suite designed for facility command. We do not provide clinical diagnosis or treatment. All healthcare responsibility remains with the authorized provider nodes.
          </div>
        </div>
        <div className="flex gap-12 shrink-0">
           <Link href="/privacy" className="hover:text-accent transition-all hover:scale-105">Data Sovereignty</Link>
           <Link href="/terms" className="hover:text-accent transition-all hover:scale-105">Service Protocols</Link>
        </div>
      </div>
    </footer>
  );
}
