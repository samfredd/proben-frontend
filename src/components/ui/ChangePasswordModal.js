'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';
import { useToast } from '@/components/ui/Toast';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      addToast('Password updated successfully', 'success');
      onClose();
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      addToast(error.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Current Password</label>
          <input 
            type="password"
            required
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">New Password</label>
          <input 
            type="password"
            required
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Confirm New Password</label>
          <input 
            type="password"
            required
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-bold text-navy-900"
          />
        </div>
        
        <div className="pt-4 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 border border-gray-100 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-4 bg-navy-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/10 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
