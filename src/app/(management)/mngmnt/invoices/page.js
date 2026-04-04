'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Modal from '@/components/ui/Modal';
import api from '@/api/api';
import { FileText, Plus, CheckCircle, Clock } from 'lucide-react';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInvoicesAndClients = async () => {
    try {
      const [invRes, clientRes] = await Promise.all([
        api.get('/invoices'),
        api.get('/organizations') // Let's mock this or use an actual endpoint
      ]);
      setInvoices(invRes.data.invoices || []);
      setClients(clientRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback if organizations route is not fully ready
      try {
        const fallbackRes = await api.get('/invoices'); // Just fetch invoices if clients fails
        setInvoices(fallbackRes.data.invoices || []);
      } catch (e) { }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoicesAndClients();
  }, []);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const invoiceData = {
      client_id: formData.get('clientId'),
      title: formData.get('title'),
      amount_usd: parseFloat(formData.get('amountUsd')),
      file_url: formData.get('fileUrl') || 'http://example.com/mock-invoice.pdf',
      due_date: formData.get('dueDate') || null
    };

    try {
      await api.post('/invoices/upload', invoiceData);
      alert('Invoice created successfully!');
      setIsModalOpen(false);
      fetchInvoicesAndClients();
    } catch (error) {
      alert(`Error creating invoice: ${error.message}`);
    }
  };

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="Invoices Management" subtitle="Create and track client invoices" />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-8">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Invoice">
          <form onSubmit={handleCreateInvoice} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy-900 tracking-widest ml-1">Client UUID</label>
              <input name="clientId" required placeholder="Enter Client ID (UUID)" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all appearance-none" />
              {/* Note: In a full CRM, this would be a select dropdown of organization names */}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy-900 tracking-widest ml-1">Invoice Title</label>
              <input name="title" required placeholder="e.g. Monthly Medical Billing Support" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-navy-900 tracking-widest ml-1">Amount (USD)</label>
                <input name="amountUsd" type="number" step="0.01" required placeholder="500.00" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-navy-900 tracking-widest ml-1">Due Date</label>
                <input name="dueDate" type="date" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy-900 tracking-widest ml-1">File URL (PDF/Image)</label>
              <input name="fileUrl" placeholder="https://s3.amazon.com/invoice.pdf" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-medium text-navy-900 transition-all text-sm" />
            </div>

            <button type="submit" className="w-full bg-accent text-primary py-5 rounded-2xl font-black hover:bg-accent-light transition-all shadow-xl shadow-accent/10 mt-6 active:scale-[0.98]">
              Upload & Notify Client
            </button>
          </form>
        </Modal>

        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-accent text-primary font-black text-xs uppercase tracking-widest rounded-xl hover:bg-accent-light transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-50 flex flex-col min-w-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Organization</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Title</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Amount (USD)</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading invoices...</td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No invoices found</td>
                  </tr>
                ) : invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-navy-900 tracking-tight">{inv.organization_name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-navy-900">{inv.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-navy-900 font-black tracking-tight">${Number(inv.amount_usd).toFixed(2)}</td>
                    <td className="px-6 py-5">
                      {inv.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-lime-50 text-lime-600 border border-lime-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100">
                          <Clock className="w-3.5 h-3.5" /> {inv.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
