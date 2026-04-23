'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast as useToastHook } from '@/context/ToastContext';
export const useToast = useToastHook;

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 right-2 md:right-8 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full outline-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  const icon = isSuccess ? (
    <CheckCircle2 className="w-5 h-5 text-accent" />
  ) : isError ? (
    <AlertCircle className="w-5 h-5 text-red-400" />
  ) : (
    <Info className="w-5 h-5 text-blue-400" />
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className="pointer-events-auto relative group"
    >
      <div className="glass-card bg-navy-900/90 border border-white/10 backdrop-blur-md p-4 pr-10 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[280px]">
        <div className="shrink-0">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white tracking-tight leading-snug">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Fancy Progress Bar */}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 5, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-1 origin-left rounded-b-2xl ${
            isSuccess ? 'bg-accent' : isError ? 'bg-red-400' : 'bg-blue-400'
          }`}
          style={{ width: '100%' }}
        />
      </div>
    </motion.div>
  );
}
