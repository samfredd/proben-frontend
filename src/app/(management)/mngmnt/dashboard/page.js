'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Activity, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ArrowUpRight,
  TrendingUp,
  Briefcase,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalPatients: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    pendingBookings: 0,
    unpaidInvoicesCount: 0,
    unpaidInvoicesValue: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, invoicesRes, organizationsRes, patientsRes, subscriptionsRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/invoices'),
          api.get('/organizations'),
          api.get('/patients/mngmnt/by-client'),
          api.get('/subscriptions')
        ]);

        const books = bookingsRes.data.bookings || [];
        const invs = invoicesRes.data.invoices || [];
        const orgs = organizationsRes.data || [];
        const patientsByClient = patientsRes.data || [];
        const subs = subscriptionsRes.data || [];

        const pendingBooks = books.filter(b => b.status === 'pending').length;
        const confirmedRev = invs.filter(i => i.status === 'paid').reduce((sum, val) => sum + parseFloat(val.amount_usd), 0);
        const unpaidInvs = invs.filter(i => i.status === 'unpaid');
        const unpaidValue = unpaidInvs.reduce((sum, val) => sum + parseFloat(val.amount_usd), 0);
        
        const totalPatientsCount = patientsByClient.reduce((sum, client) => sum + parseInt(client.patient_count || 0), 0);
        const activeSubsCount = subs.filter(s => s.status === 'active').length;

        setStats({
          totalOrganizations: orgs.length,
          totalPatients: totalPatientsCount,
          activeSubscriptions: activeSubsCount,
          monthlyRevenue: confirmedRev,
          pendingBookings: pendingBooks,
          unpaidInvoicesCount: unpaidInvs.length,
          unpaidInvoicesValue: unpaidValue
        });

        setRecentBookings(books.slice(0, 8));
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const displayStats = [
    { 
      name: 'Total Patients', 
      value: stats.totalPatients.toLocaleString(), 
      trend: 'Across all clients', 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      link: '/mngmnt/patients'
    },
    { 
      name: 'Monthly Revenue', 
      value: `$${stats.monthlyRevenue.toLocaleString()}`, 
      trend: 'Confirmed paid', 
      icon: TrendingUp, 
      color: 'text-lime-600', 
      bg: 'bg-lime-50',
      link: '/mngmnt/payments'
    },
    { 
      name: 'Active Organizations', 
      value: stats.totalOrganizations.toString(), 
      trend: 'Enterprise clients', 
      icon: Building2, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      link: '/mngmnt/clients'
    },
    { 
      name: 'Pending Revenue', 
      value: `$${stats.unpaidInvoicesValue.toLocaleString()}`, 
      trend: `${stats.unpaidInvoicesCount} unpaid invoices`, 
      icon: CreditCard, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50',
      link: '/mngmnt/invoices'
    },
    { 
      name: 'Active Subscriptions', 
      value: stats.activeSubscriptions.toString(), 
      trend: 'Recurring plans', 
      icon: Briefcase, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      link: '/mngmnt/subscriptions'
    },
    { 
      name: 'Pending Bookings', 
      value: stats.pendingBookings.toString(), 
      trend: 'Needs coordination', 
      icon: Calendar, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50',
      link: '/mngmnt/bookings'
    },
  ];

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="B2B Command Center" subtitle="Operations & Growth Overview" />

      <main className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto text-navy-900">
        {/* Quick Actions & Search */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1 glass-panel p-4 flex items-center gap-4 group">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-lime-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Quick search across patients and organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium w-full text-navy-900 placeholder:text-gray-400"
            />
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/mngmnt/clients" className="flex-1 lg:flex-none whitespace-nowrap px-6 py-4 rounded-2xl bg-navy-900 text-white font-bold text-sm hover:bg-navy-800 transition-all shadow-lg flex items-center justify-center gap-2">
              Add Organization
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-navy-900 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-lime-600" />
              Platform Vitality
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
            {displayStats.map((stat, idx) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={stat.link}>
                  <div className="glass-panel p-6 h-full flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="space-y-4">
                      <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl w-fit`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.name}</p>
                        <h3 className="text-2xl font-black text-navy-900 tracking-tighter mt-1">{stat.value}</h3>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50/50">
                      <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 italic">
                        <TrendingUp className="w-3 h-3 text-lime-500" />
                        {stat.trend}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Activity */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-navy-900 tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-lime-600" />
                Operations Stream
              </h2>
              <Link href="/mngmnt/bookings" className="text-[10px] font-black uppercase text-gray-400 hover:text-navy-900 tracking-widest transition-colors">
                View All Activity
              </Link>
            </div>
            <div className="glass-panel overflow-hidden">
              <div className="divide-y divide-gray-50/50">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading operations...</p>
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No recent activity</div>
                ) : recentBookings.map((appt) => (
                  <div key={appt.id} className="p-5 flex items-center justify-between group hover:bg-gray-50/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                        <Activity className="w-5 h-5 text-navy-900" />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy-900 tracking-tight truncate max-w-[200px]">{appt.organization_name}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{appt.service_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-navy-900 tracking-tight">{new Date(appt.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mt-1 ${appt.status === 'confirmed' ? 'bg-lime-50 text-lime-600 border border-lime-100' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Stats / Alerts */}
          <section className="lg:col-span-4 space-y-4">
            <h2 className="text-lg font-black text-navy-900 tracking-tight flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-lime-600" />
              Pulse Check
            </h2>
            <div className="space-y-4">
              <div className="glass-panel p-6 border-l-4 border-l-lime-500">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Revenue Health</h4>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-navy-900 tracking-tighter">
                    {Math.round((stats.monthlyRevenue / (stats.monthlyRevenue + stats.unpaidInvoicesValue || 1)) * 100)}%
                  </span>
                  <span className="text-[10px] font-bold text-lime-600">Collection Rate</span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-1.5 mt-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.monthlyRevenue / (stats.monthlyRevenue + stats.unpaidInvoicesValue || 1)) * 100}%` }}
                    className="bg-lime-500 h-full"
                  />
                </div>
              </div>

              <div className="glass-panel p-6 border-l-4 border-l-blue-500">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Growth Metric</h4>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-navy-900 tracking-tighter">
                    {stats.totalPatients}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600">Total Patients</span>
                </div>
                <p className="text-[10px] font-medium text-gray-400 mt-4 leading-relaxed italic">
                  Average of {Math.round(stats.totalPatients / (stats.totalOrganizations || 1))} patients per organization.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
