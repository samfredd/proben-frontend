"use client";
import { motion } from "framer-motion";

const values = [
  {
    id: "01.",
    title: "Our Mission",
    description: "To empower healthcare organizations with the tools and strategies to achieve operational excellence, regulatory compliance, and exceptional care delivery.",
  },
  {
    id: "02.",
    title: "Our Vision",
    description: "To be a global leader in healthcare consulting, transforming healthcare systems and creating lasting, positive change for organizations and the communities they serve.",
  },
  {
    id: "03.",
    title: "Our Value",
    description: "At Proben, we prioritize integrity, collaboration, and innovation. We believe in raising industry standards and driving meaningful outcomes through customized solutions.",
  },
];

export default function AboutValues() {
  return (
    <section className="py-32 bg-secondary-bg px-8 md:px-[15vw]">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-black text-primary text-center mb-24"
        >
          Your Trusted Healthcare Consulting Partner
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((v, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="flex gap-4 items-start">
                <span className="text-[10px] font-bold text-accent mt-1">{v.id}</span>
                <div className="w-[2px] h-8 bg-accent"></div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tight">{v.title}</h3>
              </div>
              <p className="text-[#4a4a4a] text-[13px] leading-relaxed pl-10">
                {v.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
