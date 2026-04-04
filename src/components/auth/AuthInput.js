'use client';
import { useState } from 'react';
import { Mail, Lock, User, Phone, Globe, ChevronDown, Eye, EyeOff } from 'lucide-react';

const icons = {
  mail: Mail,
  lock: Lock,
  user: User,
  phone: Phone,
  globe: Globe
};

export default function AuthInput({ label, type = 'text', icon, value, onChange, placeholder, required, options, disabled, helperText }) {
  const Icon = icons[icon];
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-2 group">
      {label && (
        <label className="text-[11px] font-black text-navy-900 uppercase tracking-[0.15em] ml-1 opacity-70 group-focus-within:opacity-100 transition-opacity">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none transition-colors">
            <Icon className="w-4 h-4 text-gray-300 group-focus-within:text-[#0a1128] transition-colors" />
          </div>
        )}

        {type === 'select' ? (
          <div className="relative">
            <select
              value={value}
              onChange={onChange}
              className={`w-full ${Icon ? 'pl-14' : 'px-6'} pr-12 py-4 rounded-2xl border border-gray-100 bg-white focus:ring-0 focus:border-[#0a1128]/20 outline-none transition-all font-semibold text-[#0a1128] shadow-sm appearance-none cursor-pointer`}
              required={required}
              disabled={disabled}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
          </div>
        ) : type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            className={`w-full ${Icon ? 'pl-14' : 'px-6'} py-4 rounded-2xl border border-gray-100 bg-white focus:ring-0 focus:border-[#0a1128]/20 outline-none transition-all font-semibold text-[#0a1128] shadow-sm min-h-[120px] resize-none`}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        ) : (
          <div className="relative">
             <input
                type={isPassword ? (showPassword ? 'text' : 'password') : type}
                value={value}
                onChange={onChange}
                className={`w-full ${Icon ? 'pl-14' : 'px-6'} ${isPassword ? 'pr-14' : 'pr-6'} py-4 rounded-2xl border border-gray-100 bg-white focus:ring-0 focus:border-[#0a1128]/20 outline-none transition-all font-semibold text-[#0a1128] shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
             />
             {isPassword && (
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-6 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-[#0a1128] transition-colors"
               >
                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </button>
             )}
          </div>
        )}
      </div>
      {helperText && <p className="text-[10px] text-gray-300 font-medium ml-1">{helperText}</p>}
    </div>
  );
}
