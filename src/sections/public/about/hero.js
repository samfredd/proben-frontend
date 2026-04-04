"use client";
import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative h-[60vh] bg-primary flex items-center justify-center overflow-hidden">
      {/* Decorative Wave Elements - Approximating the design */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-primary-dark rounded-full opacity-20 blur-3xl transform -rotate-12"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] bg-accent rounded-full opacity-10 blur-3xl transform rotate-12"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-black text-white">
          About Us
        </h1>
      </motion.div>
    </section>
  );
}
