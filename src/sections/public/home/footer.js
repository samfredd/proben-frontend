"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, ArrowRight } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-navy-900 pt-24 pb-12 px-6 lg:px-[15vw] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative z-10">
        {/* Column 1: Logo & Summary */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo.png" 
              alt="Proben Logo" 
              width={100} 
              height={24} 
              className="brightness-0 invert h-auto w-auto" 
            />
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Specialized billing excellence and operational software for the future of IDD and HCBS residential care. 
            Designed for reliability, built for compliance.
          </p>
          <div className="flex gap-4">
             {/* Simple social indicator */}
             <div className="text-xs text-slate-500 font-bold uppercase tracking-widest border-l border-slate-800 pl-4">
                Healthcare Grade Infrastructure
             </div>
          </div>
        </div>
        
        {/* Column 2: Solutions */}
        <div className="flex flex-col gap-8">
          <h3 className="font-bold text-accent text-xs uppercase tracking-[0.2em]">Solutions</h3>
          <ul className="flex flex-col gap-4 text-slate-400 text-sm">
            {[
              { name: 'Billing Services', link: '/services/billing' },
              { name: 'Employee Scheduling (Coming Soon)', link: '/employee-scheduling' },
              { name: 'Human Resources (Coming Soon)', link: '/human-resources' },
              { name: 'EMR Systems (Coming Soon)', link: '/electronic-medical-record' },
              { name: 'Join Waitlist', link: '/waitlist' }
            ].map((link) => (
              <li key={link.name}>
                <Link href={link.link} className="hover:text-accent transition-colors">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="flex flex-col gap-8">
          <h3 className="font-bold text-accent text-xs uppercase tracking-[0.2em]">Company</h3>
          <ul className="flex flex-col gap-4 text-slate-400 text-sm">
            {[
              { name: 'About Us', link: '/about' },
              { name: 'Contact', link: '/contact' },
              { name: 'Client Portal', link: '/login' },
              { name: 'Careers', link: '#' }
            ].map((link) => (
              <li key={link.name}>
                <Link href={link.link} className="hover:text-accent transition-colors">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="flex flex-col gap-8">
          <h3 className="font-bold text-accent text-xs uppercase tracking-[0.2em]">Connect</h3>
          <div className="flex flex-col gap-4 text-slate-400 text-sm leading-relaxed">
            <p>Remote Operations Hub <br /> USA Nationwide</p>
            <div className="flex items-center gap-2 text-white font-bold">
               <Mail className="w-4 h-4 text-accent" />
               <a href="mailto:strategy@probengroup.com" className="hover:text-accent transition-colors text-slate-300">
                 strategy@probengroup.com
               </a>
            </div>
            <Link href="/contact" className="mt-4 text-xs font-bold text-white flex items-center gap-2 group">
               Book System Audit
               <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-12 border-t border-accent/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] relative z-10">
        <div className="flex flex-col gap-2">
          <p>© 2026 Proben IDD Consultants. <span className="text-accent/50">HIPAA Protected Systems.</span></p>
          <p className="normal-case tracking-normal max-w-2xl mt-4 opacity-50 text-[11px] leading-relaxed">
            <strong>Disclaimer:</strong> Proben is an Intellectual and Developmental Disabilities (IDD) administrative services and consulting firm. Our platform is an HCBS coordination and billing tool designed for facility administrators. We do not provide clinical treatment.
          </p>
        </div>
        <div className="flex gap-8">
           <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
           <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
