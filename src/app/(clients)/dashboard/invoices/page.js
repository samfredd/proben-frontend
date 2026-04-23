'use client';
import { useState, useEffect } from 'react';
import api from '@/api/api';
import { motion } from 'framer-motion';
import { Receipt, FileText, Download, ArrowRight, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import InvoiceDownloadButton from '@/components/payments/InvoiceDownloadButton';
import { getInvoiceAmount, isHostedInvoiceFileUrl } from '@/utils/invoices';
import TrialGate from '@/components/ui/TrialGate';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (invoice) => {
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
    } catch (err) {
      console.error('Payment failed', err);
      alert('Failed to initiate payment.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <TrialGate feature="Invoices">
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Billing & Invoices</h1>
        <p className="text-gray-500 mt-1">Manage your payments and download past invoices.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-600 border-t-transparent"></div>
          </div>
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-100/80 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Invoice details</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-navy-800">INV-{invoice.id.toString().padStart(4, '0')}</p>
                          <p className="text-sm text-gray-500 font-medium">{new Date(invoice.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-bold text-navy-900 text-lg">${getInvoiceAmount(invoice).toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                        ${invoice.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200 animate-pulse'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${invoice.status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {isHostedInvoiceFileUrl(invoice.file_url) ? (
                          <a href={invoice.file_url} target="_blank" className="p-2 text-gray-400 hover:text-navy-600 hover:bg-gray-100 rounded-lg transition-colors" title="Download PDF">
                            <Download className="w-5 h-5" />
                          </a>
                        ) : invoice.status === 'paid' ? (
                          <InvoiceDownloadButton transaction={invoice} user={user} />
                        ) : (
                          <div className="p-2 text-gray-300" title="No PDF available">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        {invoice.status === 'unpaid' && (
                          <div className="relative group/btn">
                            <div className="absolute -inset-1 bg-red-500 rounded-xl blur opacity-25 group-hover/btn:opacity-50 transition duration-1000 group-hover/btn:duration-200 animate-pulse"></div>
                            <button
                              onClick={() => handlePay(invoice)}
                              className="relative flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-navy-800 transition-colors shadow-md text-sm"
                            >
                              Pay <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
              <CreditCard className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-2">No invoices yet</h3>
            <p className="text-gray-500 font-medium max-w-sm">You haven&apos;t been billed for any services yet. Invoices will automatically appear here once generated.</p>
          </div>
        )}
      </div>
    </motion.div>
    </TrialGate>
  );
}
