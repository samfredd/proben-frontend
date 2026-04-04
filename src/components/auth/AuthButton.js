'use client';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function AuthButton({ children, type = 'submit', onClick, loading, icon = true, variant = 'primary', className = '' }) {
  const baseStyles = "w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#82C341] text-[#0a1128] hover:bg-[#76b13b] shadow-lg shadow-[#82C341]/10 hover:shadow-[#82C341]/20",
    secondary: "bg-white text-[#0a1128] border border-gray-100 hover:border-[#0a1128]/10 hover:bg-gray-50 shadow-sm",
    navy: "bg-[#0a1128] text-white hover:bg-[#060a1a] shadow-lg shadow-[#0a1128]/10 hover:shadow-[#0a1128]/20"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${className} group`}
    >
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <>
          {children}
          {icon && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
        </>
      )}
    </button>
  );
}
