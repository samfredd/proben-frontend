"use client";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-24 bg-white px-6 lg:px-[15vw] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055?fm=jpg&q=60&w=2000&auto=format&fit=crop"
          alt="Technical background"
          className="w-full h-full object-cover opacity-[0.02] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-slate-50/50" />
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/Screenshot-2025-01-17-at-12.01.06 AM.webp"
              alt="Healthcare excellence"
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 bg-primary p-8 rounded-2xl shadow-xl hidden md:block border border-white/5">
              Specialized Operations for <span className="text-accent underline decoration-accent/30 underline-offset-8">IDD Providers.</span>
            <span className="text-white/60 text-xs uppercase tracking-widest font-bold">Years of expertise</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-4">
            <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px]">
              Why Choose Us
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-primary leading-tight">
              Scaling Your <br /> 
              <span className="text-accent">Healthcare</span> Operations
            </h2>
          </div>

          <div className="flex flex-col gap-6 text-text-main/80 text-lg leading-relaxed max-w-lg">
            <p className="border-l-4 border-accent pl-6">
              Proben IDD Consultants is engineered for the administrative and clinical burdens of residential care. We bridge the gap between complex HCBS regulations and operational excellence through specialized consulting and high-fidelity software.
            </p>
            <p className="text-base text-primary/60">
              We handle the recruitment and employment of skilled professionals, allowing you to focus on direct patient care while standardizing your operational workflows through our secure booking and subscription platform.
            </p>
          </div>

          <div className="flex items-center gap-8 mt-4">
             <button className="text-primary font-bold text-sm uppercase tracking-widest border-b-2 border-accent pb-1 hover:text-accent transition-all">
                Our Story
             </button>
             <div className="w-12 h-[1px] bg-primary/10"></div>
             <button className="text-primary/40 font-bold text-sm uppercase tracking-widest hover:text-accent transition-all">
                Our Team
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
