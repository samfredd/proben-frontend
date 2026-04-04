'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import api from '@/api/api';
import { FileText, CheckCircle, ExternalLink, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import InvoiceDownloadButton from '@/components/payments/InvoiceDownloadButton';
import { getInvoiceAmount, isHostedInvoiceFileUrl } from '@/utils/invoices';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePayment = async (invoice) => {
    try {
      const res = await api.post('/payments/initialize', {
        amount_usd: getInvoiceAmount(invoice),
        email: user?.email || 'test@example.com',
        metadata: {
          type: 'invoice',
          invoice_id: invoice.id,
          description: `Invoice: ${invoice.title}`
        }
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      alert('Error initializing payment: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="flex-1 bg-[#fcfdfe] min-h-screen">
      <DashboardHeader title="Invoices & Payments" subtitle="Manage your organization's billing" />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-[2rem] border border-gray-50 flex flex-col min-w-0 shadow-sm overflow-hidden">
          <div className="p-5 md:p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-navy-900 tracking-tight">Recent Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Description</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Amount (USD)</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
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
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-navy-900 tracking-tight">{inv.title}</p>
                          {isHostedInvoiceFileUrl(inv.file_url) ? (
                            <a href={inv.file_url} target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase hover:underline flex items-center gap-1 mt-1">
                              View PDF <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase flex items-center gap-1 mt-1">
                              Auto Generated Invoice
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-navy-900 font-black tracking-tight">${getInvoiceAmount(inv).toFixed(2)}</td>
                    <td className="px-6 py-5">
                      {inv.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100">
                          <Clock className="w-3.5 h-3.5" /> {inv.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right w-40">
                      {inv.status !== 'paid' ? (
                        <button
                          onClick={() => handlePayment(inv)}
                          className="px-5 py-2.5 bg-navy-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-navy-800 transition-colors shadow-sm whitespace-nowrap"
                        >
                          Pay Now
                        </button>
                      ) : !isHostedInvoiceFileUrl(inv.file_url) ? (
                        <InvoiceDownloadButton transaction={inv} user={user} />
                      ) : null}
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
