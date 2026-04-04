'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/api/api';
import {
  BarChart3,
  TrendingUp,
  Heart,
  Droplets,
  Zap,
  Activity,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';

export default function ClientAnalytics() {
  const [activeRange, setActiveRange] = useState('1M');
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [activeRange]);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/client', { params: { activeRange } });
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch client analytics', err);
    }
  };

  const healthScores = data ? [
    { name: 'Wellness Score', value: data.latest.wellness_score.toString(), trend: '+2.4%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Avg. Heart Rate', value: `${data.latest.heart_rate} bpm`, trend: '-1.2%', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'Hydration Level', value: `${data.latest.hydration_level}%`, trend: '+5.0%', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Active Minutes', value: `${data.latest.active_minutes}m/day`, trend: '+12%', icon: Activity, color: 'text-green-500', bg: 'bg-green-50' },
  ] : [];

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen text-navy-900">
      <DashboardHeader title="My Health Analytics" subtitle="Track your wellness progress and clinical trends over time" />

      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 p-1 bg-gray-50 border border-gray-100 rounded-2xl">
            {['1W', '1M', '3M', '6M', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeRange === range ? 'bg-white text-navy-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-navy-900'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="px-8 py-4 bg-navy-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10">
            Download Health Data
          </button>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthScores.map((score) => (
            <motion.div
              key={score.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm group hover:shadow-xl hover:shadow-navy-900/5 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`${score.bg} ${score.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <score.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-green-500 flex items-center gap-1 uppercase tracking-widest">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {score.trend}
                </div>
              </div>
              <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{score.name}</h4>
              <p className="text-3xl font-black text-navy-900 tracking-tight">{score.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Vital Charts Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-xl font-bold text-navy-900 tracking-tight uppercase">Blood Pressure Trend</h3>
              <p className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest">Optimal Range</p>
            </div>

            <div className="h-64 flex items-end justify-between gap-4 px-4">
              {data?.bpHistory && data.bpHistory.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                  <div className="w-full relative bg-gray-50 rounded-lg overflow-hidden h-full flex flex-col justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className={`w-full ${h > 80 ? 'bg-navy-900' : 'bg-blue-200'} opacity-80 group-hover/bar:opacity-100 transition-opacity`}
                    />
                  </div>
                  <span className="text-[8px] text-gray-400 font-bold uppercase hidden md:block">W{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-navy-900"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Systolic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Diastolic</span>
              </div>
            </div>
          </section>

          {/* Health Goals */}
          <section className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-navy-900 tracking-tight uppercase">Active Goals</h3>
              <Target className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-8">
              {data && [
                { label: 'Weight Reduction', progress: data.latest.weight_reduction_progress, color: 'bg-green-500' },
                { label: 'Daily Hydration', progress: data.latest.daily_hydration_progress, color: 'bg-blue-500' },
                { label: 'Sleep Hygiene', progress: data.latest.sleep_hygiene_progress, color: 'bg-amber-500' },
                { label: 'Strength Training', progress: data.latest.strength_training_progress, color: 'bg-navy-900' },
              ].map((goal) => (
                <div key={goal.label} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-navy-900 tracking-tight leading-none">{goal.label}</span>
                    <span className="text-[10px] font-black text-navy-900/40 uppercase tracking-widest">{goal.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${goal.color} opacity-80`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-12 py-5 bg-gray-50 rounded-[1.5rem] text-navy-900 font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100 shadow-sm">
              Update Objectives
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
