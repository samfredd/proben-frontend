'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Zap, Shield, Activity } from 'lucide-react';

export default function Navbar() {
  const [top, setTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setTop(window.scrollY <= 100);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Terminal Hub", link: "/" },
    { name: "Clinical Flows", link: "/services/billing" },
    { name: "Strategic Arch", link: "/about" },
    { name: "Liaison", link: "/contact" },
  ];

  const isHome = pathname === "/";
  const shouldBeTransparent = isHome && top && !isMobileMenuOpen;

  return (
    <>
      <nav
        className={`px-8 lg:px-[12vw] py-6 flex justify-between items-center fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          shouldBeTransparent
            ? "bg-transparent border-b-transparent px-8 lg:px-[12vw] py-8" 
            : "bg-navy-900/90 backdrop-blur-2xl shadow-2xl py-5 border-b border-white/5"
        }`}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="p-2 bg-navy-900 rounded-xl border border-white/10 group-hover:border-accent transition-colors shadow-xl">
               <Image 
                 src="/logo.png" 
                 alt="Proben Logo" 
                 width={40} 
                 height={40} 
                 priority 
                 className="brightness-0 invert h-8 w-8 object-contain" 
               />
            </div>
            <div className="hidden lg:block">
               <span className="text-xs font-black uppercase text-white tracking-[0.2em] leading-none mb-1 block">Proben Tactical</span>
               <span className="text-[8px] font-black uppercase text-accent tracking-[0.3em] leading-none">Security Standard</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Links - Elite Style */}
        <div className="hidden md:flex gap-10 items-center">
          {links.map((link, index) => (
            <Link 
              key={index} 
              href={link.link}
              className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all group relative"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-accent transition-all duration-500 group-hover:w-full shadow-[0_0_8px_rgba(130,195,65,1)]"></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hidden sm:flex items-center gap-2 text-white/50 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all">
            <Shield className="w-3.5 h-3.5 text-accent" />
            Portal Entry
          </Link>
          <Link href="/contact" className="hidden sm:flex bg-accent hover:bg-white text-navy-900 px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_15px_30px_-5px_rgba(130,195,65,0.3)] active:scale-[0.95] hover:shadow-[0_20px_40px_-5px_rgba(130,195,65,0.4)]">
            Establish Contact
          </Link>
          
          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-accent hover:text-navy-900 transition-all shadow-xl"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Elite Standard */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-40 bg-navy-900 backdrop-blur-3xl pt-32 px-8 md:hidden flex flex-col"
          >
             {/* Elite Mesh Overlay for Mobile Menu */}
             <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent blur-[100px] rounded-full animate-pulse" />
             </div>

            <div className="relative z-10 flex flex-col gap-2">
              {links.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link 
                    href={link.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-6 border-b border-white/5 text-white/90 text-2xl font-black uppercase tracking-tighter hover:text-accent transition-all group"
                  >
                    <span className="flex items-center gap-4">
                       <span className="text-[10px] text-accent/40 font-mono">0{index + 1}</span>
                       {link.name}
                    </span>
                    <ChevronRight className="w-6 h-6 opacity-20 group-hover:translate-x-2 group-hover:opacity-100 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="relative z-10 mt-16 space-y-4">
              <Link href="/contact" className="flex items-center justify-center gap-3 w-full py-6 bg-accent text-navy-900 text-center rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl">
                <Activity className="w-4 h-4" /> Establish Contact
              </Link>
              <Link href="/login" className="flex items-center justify-center gap-3 w-full py-6 bg-white/5 text-white text-center rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] border border-white/10 backdrop-blur-lg">
                <Shield className="w-4 h-4 text-accent" /> Portal Entry
              </Link>
            </div>
            
            <div className="mt-auto pb-16 text-center relative z-10">
               <div className="flex justify-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-pulse delay-75" />
                  <div className="w-1.5 h-1.5 bg-accent/20 rounded-full animate-pulse delay-150" />
               </div>
              <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em] leading-relaxed">System v2.0 • Authorized Terminal Access Only</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
