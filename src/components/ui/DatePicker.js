'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown, X } from 'lucide-react';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseValue(value) {
  if (!value) return null;
  const d = new Date(value + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplay(value) {
  const d = parseValue(value);
  if (!d) return null;
  return `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - daysInMonth - firstDay + 1, current: false });
  return cells;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => CURRENT_YEAR - i);

export default function DatePicker({ value, onChange, placeholder = 'Select date of birth' }) {
  const selected = parseValue(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? 1990);
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? 0);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const yearListRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  // Recompute anchor position whenever the picker opens
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 300),
    });
  }, [isOpen]);

  useEffect(() => {
    function onMouseDown(e) {
      if (
        triggerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) return;
      setIsOpen(false);
      setShowYearSelect(false);
    }
    if (isOpen) document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen]);

  useEffect(() => {
    if (showYearSelect && yearListRef.current) {
      const active = yearListRef.current.querySelector('[data-active="true"]');
      active?.scrollIntoView({ block: 'center' });
    }
  }, [showYearSelect]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    const isLastMonth = viewYear === CURRENT_YEAR && viewMonth === today.getMonth();
    if (isLastMonth) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (cell) => {
    if (!cell.current) return;
    const picked = new Date(viewYear, viewMonth, cell.day);
    picked.setHours(0, 0, 0, 0);
    if (picked > today) return;
    onChange(toYMD(picked));
    setIsOpen(false);
    setShowYearSelect(false);
  };

  const isNextDisabled = viewYear === CURRENT_YEAR && viewMonth === today.getMonth();
  const cells = buildCalendarDays(viewYear, viewMonth);
  const displayText = formatDisplay(value);

  return (
    <div ref={triggerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setIsOpen(o => !o); setShowYearSelect(false); }}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-left flex items-center justify-between gap-3 transition-all outline-none group ${
          isOpen
            ? 'border-[#0a1128] ring-2 ring-[#0a1128]/8 bg-white'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <span className={`font-bold truncate ${displayText ? 'text-[#0a1128]' : 'text-gray-400 font-medium'}`}>
          {displayText || placeholder}
        </span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          isOpen ? 'bg-[#0a1128] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
        }`}>
          <Calendar className="w-3.5 h-3.5" />
        </div>
      </button>

      {/* Floating dropdown via portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div
              ref={dropdownRef}
              style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="bg-white rounded-[1.5rem] shadow-2xl shadow-[#0a1128]/12 border border-gray-100 overflow-hidden"
              >
                {/* Navy header */}
                <div className="bg-[#0a1128] px-4 py-4">
                  {showYearSelect ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white/60 uppercase tracking-widest">Select Year</span>
                      <button
                        type="button"
                        onClick={() => setShowYearSelect(false)}
                        className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" /> Close
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={prevMonth}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowYearSelect(true)}
                        className="flex items-center gap-1.5 text-white font-black text-sm hover:text-[#82C341] transition-colors"
                      >
                        {MONTHS[viewMonth]} {viewYear}
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>

                      <button
                        type="button"
                        onClick={nextMonth}
                        disabled={isNextDisabled}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {showYearSelect ? (
                    <motion.div
                      key="years"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      ref={yearListRef}
                      className="grid grid-cols-4 gap-1 p-3 max-h-56 overflow-y-auto"
                    >
                      {YEAR_OPTIONS.map(y => (
                        <button
                          key={y}
                          data-active={y === viewYear}
                          type="button"
                          onClick={() => { setViewYear(y); setShowYearSelect(false); }}
                          className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                            y === viewYear
                              ? 'bg-[#0a1128] text-white shadow-lg shadow-[#0a1128]/20'
                              : 'text-[#0a1128]/60 hover:bg-gray-100 hover:text-[#0a1128]'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="p-3"
                    >
                      <div className="grid grid-cols-7 mb-1">
                        {DAYS_OF_WEEK.map(d => (
                          <div key={d} className="flex items-center justify-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase w-9 text-center py-1">
                              {d}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-y-0.5">
                        {cells.map((cell, i) => {
                          const cellDate = new Date(
                            viewYear,
                            viewMonth + (cell.current ? 0 : cell.day < 15 ? 1 : -1),
                            cell.day
                          );
                          cellDate.setHours(0, 0, 0, 0);
                          const isSelected = selected && toYMD(cellDate) === value;
                          const isFuture = cellDate > today;
                          const isToday = toYMD(cellDate) === toYMD(today);
                          const isClickable = cell.current && !isFuture;

                          return (
                            <div key={i} className="flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => isClickable && selectDay(cell)}
                                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                                  isSelected
                                    ? 'bg-[#0a1128] text-white shadow-md shadow-[#0a1128]/20 font-black'
                                    : isToday && cell.current
                                    ? 'bg-[#82C341]/20 text-[#4a7a1e] font-black ring-1 ring-[#82C341]/40'
                                    : isClickable
                                    ? 'text-[#0a1128] hover:bg-gray-100'
                                    : 'text-gray-300 cursor-default'
                                }`}
                              >
                                {cell.day}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {value && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Selected</span>
                          <span className="text-xs font-black text-[#0a1128]">{displayText}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
