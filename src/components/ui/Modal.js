'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm shadow-2xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-2xl md:rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 h-full md:h-auto overflow-y-auto"
        >
          <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 sticky top-0 bg-white z-10">
            <div>
              <h3 className="text-lg md:text-xl font-black text-navy-900 tracking-tight uppercase">{title}</h3>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Unified Health Portal Action</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 md:p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-navy-900 group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
          <div className="p-6 md:p-8">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
