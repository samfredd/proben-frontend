'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';
import { Plus, CheckCircle, Activity, Settings2, ShieldCheck, X, Edit2, Trash2 } from 'lucide-react';
import { getSubscriptionServices } from '@/utils/subscriptions';

export default function SubscriptionPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [benefits, setBenefits] = useState(['']);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/services');
      const sorted = getSubscriptionServices(response.data || []).sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd));
      setPackages(sorted);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openCreateModal = () => {
    setEditingPackage(null);
    setBenefits(['']);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setBenefits(pkg.benefits && pkg.benefits.length > 0 ? pkg.benefits : ['']);
    setIsModalOpen(true);
  };

  const handleAddField = () => setBenefits([...benefits, '']);
  const handleRemoveField = (index) => setBenefits(benefits.filter((_, i) => i !== index));
  const handleBenefitChange = (index, value) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const packageData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price_usd: parseFloat(formData.get('priceUsd')),
      type: 'recurring',
      benefits: benefits.filter(b => b.trim() !== '')
    };

    try {
      if (editingPackage) {
        await api.put(`/services/${editingPackage.id}`, packageData);
        alert('Subscription package updated successfully!');
      } else {
        await api.post('/services', packageData);
        alert('Subscription package created successfully!');
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/services/${id}`);
      fetchPackages();
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="flex-1 bg-transparent min-h-screen">
      <DashboardHeader title="Subscription Packages" subtitle="Configure and price the recurring plans clients can subscribe to" />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-8">
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title={editingPackage ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy-900 tracking-widest ml-1">Plan Name</label>
              <input name="name" required defaultValue={editingPackage?.name} placeholder="e.g. Premium Health Suite" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy-900 tracking-widest ml-1">Description</label>
              <textarea name="description" required defaultValue={editingPackage?.description} rows="3" placeholder="Describe the plan benefits..." className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all"></textarea>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-navy-900 tracking-widest ml-1 flex justify-between items-center">
                Plan Benefits
                <button type="button" onClick={handleAddField} className="text-[10px] bg-navy-900 text-white px-3 py-1 rounded-lg">Add Point</button>
              </label>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      value={benefit} 
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      placeholder="e.g. 24/7 Priority Support"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none text-sm font-medium"
                    />
                    {benefits.length > 1 && (
                      <button type="button" onClick={() => handleRemoveField(index)} className="p-3 bg-red-50 text-red-500 rounded-xl">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-navy-900 tracking-widest ml-1">Monthly Cost (USD)</label>
                <input name="priceUsd" type="number" step="0.01" required defaultValue={editingPackage?.price_usd} placeholder="1000" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all" />
              </div>
            </div>

            <button type="submit" className="w-full bg-accent text-primary py-5 rounded-2xl font-black hover:bg-accent-light transition-all shadow-xl shadow-accent/10 mt-6 active:scale-[0.98]">
              {editingPackage ? 'Save Plan Changes' : 'Create Subscription Plan'}
            </button>
          </form>
        </Modal>

        <div className="flex justify-end">
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-accent text-primary font-black text-xs uppercase tracking-widest rounded-xl hover:bg-accent-light transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Subscription Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing packages...</div>
          ) : packages.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No subscription plans configured</div>
          ) : packages.map((pkg) => (
            <div key={pkg.id} className="glass-panel p-6 xl:p-8 flex flex-col justify-between hover:scale-[1.02] transition-all group animate-breathe" style={{ animationDelay: `${packages.indexOf(pkg) * 0.15}s` }}>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(pkg)} className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-navy-900 tracking-tight">{pkg.name}</h3>
                <p className="text-gray-500 text-sm mt-3 font-medium leading-relaxed italic line-clamp-2 mb-4">{pkg.description}</p>
                
                {pkg.benefits && pkg.benefits.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {pkg.benefits.slice(0, 4).map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-bold text-navy-900/60">
                        <CheckCircle className="w-3.5 h-3.5 text-lime-500 shrink-0" />
                        <span className="truncate">{benefit}</span>
                      </li>
                    ))}
                    {pkg.benefits.length > 4 && (
                      <li className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-5">
                        + {pkg.benefits.length - 4} more benefits
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <div className="mt-auto pt-6 border-t border-gray-50 flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Monthly Rate</div>
                  <div className="text-2xl font-black text-navy-900 tracking-tight">${Number(pkg.price_usd).toFixed(0)}</div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${pkg.is_active ? 'bg-lime-50 text-lime-600' : 'bg-gray-100 text-gray-400'}`}>
                  {pkg.is_active ? 'Active' : 'Archived'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
