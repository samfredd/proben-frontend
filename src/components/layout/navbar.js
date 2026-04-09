"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";

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

  const [activeMenu, setActiveMenu] = useState(null);

  const links = [
    { name: "Home", link: "/" },
    { 
      name: "Solutions", 
      submenu: [
        { name: "Billing Services", link: "/services/billing" },
        { name: "Employee Scheduling", link: "/employee-scheduling", comingSoon: true },
        { name: "Human Resources", link: "/human-resources", comingSoon: true },
        { name: "Electronic Medical Record", link: "/electronic-medical-record", comingSoon: true },
      ] 
    },
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
              alt="Proben IDD Consultants Logo" 
              width={100} 
              height={24} 
              priority 
              className="brightness-0 invert h-auto w-auto" 
            />
          </Link>
        </div>
        
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link, index) => (
            <div 
              key={index} 
              className="relative group"
              onMouseEnter={() => link.submenu && setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {link.submenu ? (
                <button className="text-white/80 hover:text-white text-sm font-medium transition-all flex items-center gap-1.5 focus:outline-none py-2">
                  {link.name}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === index ? "rotate-180 text-accent" : ""}`} />
                </button>
              ) : (
                <Link 
                  href={link.link}
                  className="text-white/80 hover:text-white text-sm font-medium transition-all relative block py-2"
                >
                  {link.name}
                  <span className="absolute bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
                </Link>
              )}

              {link.submenu && (
                <AnimatePresence>
                  {activeMenu === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full w-64 pt-4"
                    >
                      <div className="bg-navy-900 border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.link}
                            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all group/sub"
                          >
                            <div className="flex flex-col gap-0.5">
                               <span className="text-xs font-bold uppercase tracking-widest">{sub.name}</span>
                               {sub.comingSoon && <span className="text-[8px] font-black text-accent uppercase tracking-widest">Coming Soon</span>}
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/signup" className="bg-accent hover:bg-accent-light text-navy-900 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]">
            Sign Up
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
                  {link.submenu ? (
                    <div className="py-2">
                       <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-4 mt-2">{link.name}</p>
                       <div className="flex flex-col gap-1 pl-4 border-l border-white/5">
                          {link.submenu.map((sub) => (
                            <Link 
                               key={sub.name}
                               href={sub.link}
                               onClick={() => setIsMobileMenuOpen(false)}
                               className="py-3 text-white/70 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-between"
                            >
                               <div className="flex flex-col">
                                  {sub.name}
                                  {sub.comingSoon && <span className="text-[9px] font-black text-accent uppercase">Coming Soon</span>}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-20" />
                            </Link>
                          ))}
                       </div>
                    </div>
                  ) : (
                    <Link 
                      href={link.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-5 border-b border-white/5 text-white/90 text-xl font-black uppercase tracking-tight hover:text-accent transition-colors"
                    >
                      {link.name}
                      <ChevronRight className="w-5 h-5 opacity-40" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12">
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-5 bg-accent text-navy-900 text-center rounded-xl font-bold text-sm uppercase tracking-widest transition-transform active:scale-[0.98]">
                Sign Up Now
              </Link>
            </div>
            
            <div className="mt-auto pb-12 text-center">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">© 2026 Proben IDD Consultants • Secure Healthcare Systems</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
