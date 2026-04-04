"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";

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
    { name: "Home", link: "/" },
    { name: "Billing Services", link: "/services/billing" },
    { name: "About Us", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  // Only allow transparency on the home page at the top
  const isHome = pathname === "/";
  const shouldBeTransparent = isHome && top && !isMobileMenuOpen;

  return (
    <>
      <nav
        className={`px-6 md:px-8 lg:px-[15vw] py-5 flex justify-between items-center fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          shouldBeTransparent
            ? "bg-transparent backdrop-blur-sm shadow-none border-b-transparent" 
            : "bg-navy-900/95 backdrop-blur-xl shadow-lg py-4 border-b border-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Proben Logo" 
              width={100} 
              height={24} 
              priority 
              className="brightness-0 invert h-auto w-auto" 
            />
          </Link>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link, index) => (
            <Link 
              key={index} 
              href={link.link}
              className="text-white/80 hover:text-white text-sm font-medium transition-all group relative"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest transition-all">
            Client Portal
          </Link>
          <Link href="/contact" className="hidden sm:block bg-accent hover:bg-accent-light text-navy-900 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]">
            Book Consultation
          </Link>
          
          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-all"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-navy-900 pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-2">
              {links.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={link.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-white/5 text-white/90 text-xl font-black uppercase tracking-tight hover:text-accent transition-colors"
                  >
                    {link.name}
                    <ChevronRight className="w-5 h-5 opacity-40" />
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 space-y-4">
              <Link href="/contact" className="block w-full py-5 bg-accent text-navy-900 text-center rounded-xl font-bold text-sm uppercase tracking-widest">
                Book Consultation
              </Link>
              <Link href="/login" className="block w-full py-5 bg-white/5 text-white text-center rounded-xl font-bold text-sm uppercase tracking-widest border border-white/10">
                Client Portal
              </Link>
            </div>
            
            <div className="mt-auto pb-12 text-center">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">© 2026 Proben • Secure Healthcare Systems</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
