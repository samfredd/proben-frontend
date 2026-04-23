"use client";
import { motion } from "framer-motion";

export default function AboutIntro() {
  return (
    <section className="py-24 bg-secondary-bg px-8 md:px-[15vw]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left Column: Stats Box */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/50 backdrop-blur-sm p-10 flex gap-12 border border-black/5"
        >
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-black text-primary">2024</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Established</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-black text-primary">10+</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Employee</span>
          </div>
        </motion.div>

        {/* Right Column: Content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight">
            Your Trusted Healthcare <br className="hidden md:block" /> Consulting Partner
          </h2>
          <p className="text-[#4a4a4a] text-sm leading-relaxed max-w-lg">
            Proben Medical Consultants is dedicated to providing healthcare 
            organizations with innovative, tailored solutions that enhance operational 
            efficiency, ensure compliance, and improve patient outcomes. With a 
            commitment to excellence, we offer an unmatched experience in 
            healthcare consulting, backed by our expertise and a client-focused 
            approach.
          </p>
          <a 
            href="/contact" 
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary hover:text-accent transition-colors mt-4"
          >
            Contact Us Today
          </a>
        </motion.div>
      </div>
    </section>
  );
}
