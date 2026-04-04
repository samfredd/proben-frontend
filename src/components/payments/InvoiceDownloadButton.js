'use client';
import React from 'react';
import { Download } from 'lucide-react';

const InvoiceDownloadButton = ({ transaction, user }) => {
  const handleDownload = async () => {
    try {
      const { generateInvoice } = await import('@/utils/generateInvoice');
      await generateInvoice(transaction, user);
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-navy-900 transition-all font-bold text-xs" 
      title="Download Receipt"
    >
      <Download className="w-4 h-4" />
    </button>
  );
};

export default InvoiceDownloadButton;
