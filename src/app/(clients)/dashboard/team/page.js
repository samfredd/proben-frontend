'use client';
import { useState, useEffect } from 'react';
import api from '@/api/api';
import { Users, UserPlus, Trash2, Mail, Shield, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TrialGate from '@/components/ui/TrialGate';

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('client');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchTeam = async () => {
    try {
      const res = await api.get('/team');
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch team', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      await api.post('/team/invite', { email: inviteEmail, role: inviteRole });
      setMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}` });
      setInviteModal(false);
      setInviteEmail('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to send invite' });
    } finally {
      setInviteLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      await api.delete(`/team/${id}`);
      setMembers(members.filter(m => m.id !== id));
      setMessage({ type: 'success', text: 'Member removed' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove member' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <TrialGate feature="Team Management">
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Team Management</h1>
          <p className="text-gray-500 mt-1">Manage your organization's users and permissions.</p>
        </div>
        <button
          onClick={() => setInviteModal(true)}
          className="bg-lime-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-lime-700 transition-all shadow-lg shadow-lime-600/20"
        >
          <UserPlus className="w-5 h-5" />
          Invite Member
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Joined</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                  <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                  <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                  <td className="px-8 py-6"></td>
                </tr>
              ))
            ) : members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-50 text-navy-600 flex items-center justify-center font-bold">
                      {member.email[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-navy-900">{member.email}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-8 py-6 text-gray-500 text-sm font-medium">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {inviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setInviteModal(false)}
              className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 relative z-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-navy-900 mb-2">Invite Teammate</h2>
              <p className="text-gray-500 mb-8">Send an invitation to join your organization.</p>

              <form onSubmit={handleInvite} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-navy-800 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                      placeholder="teammate@organization.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-800 mb-2">Role</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setInviteRole('client')}
                      className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${inviteRole === 'client' ? 'border-lime-500 bg-lime-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <Users className={`w-6 h-6 mb-2 ${inviteRole === 'client' ? 'text-lime-600' : 'text-gray-400'}`} />
                      <div className="font-bold text-navy-900">Member</div>
                      <div className="text-xs text-gray-500">Standard dashboard access</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteRole('admin')}
                      className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${inviteRole === 'admin' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <Shield className={`w-6 h-6 mb-2 ${inviteRole === 'admin' ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div className="font-bold text-navy-900">Admin</div>
                      <div className="text-xs text-gray-500">Manage team & billing</div>
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setInviteModal(false)}
                    className="flex-1 py-4 font-bold text-gray-500 hover:text-navy-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="flex-[2] bg-navy-900 text-white py-4 rounded-2xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center gap-2"
                  >
                    {inviteLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Invite'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </TrialGate>
  );
}
