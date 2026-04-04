'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children, title, subtitle, imageSrc, imageAlt }) {
  return (
    <div className="min-h-screen bg-[#FAFBFF] flex overflow-hidden">
      {/* Left Side: Visual/Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#82C341] items-center justify-center overflow-hidden">
        {/* Decorative Gradients - Brand Green Theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#82C341] to-[#6ca035]">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0a1128]/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 w-full max-w-xl px-16 text-center">
          {/* Logo in the Visual Side - Navy for contrast on Green */}
          <div className="mb-20 flex justify-center">
            <div className="p-5 rounded-[2.5rem] bg-[#0a1128] shadow-2xl shadow-[#0a1128]/20 group transition-transform duration-500 hover:scale-105 border border-[#82C341]/20">
              <Image 
                src="/logo.png" 
                alt="Proben Logo" 
                width={80} 
                height={80} 
                className="object-contain brightness-0 invert opacity-90" 
                priority 
              />
            </div>
          </div>

          <h1 className="text-5xl font-black text-[#0a1128] leading-tight mb-8 tracking-tighter">
            {title || 'Healthcare Coordination, Simplified.'}
          </h1>
          <p className="text-xl text-[#0a1128]/70 font-bold leading-relaxed max-w-md mx-auto">
            {subtitle || 'Manage your medical ecosystem with precision and ease. Welcome to the next generation of healthcare.'}
          </p>

          {/* Minimalist Visual Element - Geometric/Abstract instead of an image */}
          <div className="mt-16 flex justify-center opacity-20">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-[#0a1128] transform rotate-12" style={{ opacity: (9-i)/10 }} />
              ))}
            </div>
          </div>
        </div>

        {/* Subtle Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #0a1128 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-20 relative bg-white">
        {/* Background Accents (Mobile Only) - More Subtle */}
        <div className="lg:hidden absolute inset-0 -z-10 bg-[#FAFBFF]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-md">
            {/* Header with Back Link */}
            <div className="flex justify-between items-center mb-16 lg:mb-24">
                <div className="lg:hidden">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                </div>
                <Link href="/" className="group text-sm font-bold text-gray-400 hover:text-[#0a1128] transition-all flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                    Back to Selection
                </Link>
            </div>

            {children}

            {/* Footer - Minimalistic */}
            <div className="mt-20 pt-10 border-t border-gray-50 flex flex-wrap justify-center gap-x-10 gap-y-4 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                <Link href="/privacy" className="hover:text-[#0a1128] transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-[#0a1128] transition-colors">Terms</Link>
                <Link href="/support" className="hover:text-[#0a1128] transition-colors">Support</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
