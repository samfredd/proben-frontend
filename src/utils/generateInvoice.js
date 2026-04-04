'use client';

export const generateInvoice = async (transaction, user) => {
  const { jsPDF } = await import('jspdf/dist/jspdf.es.min.js');
  const doc = new jsPDF();
  
  // Set up fonts and colors
  doc.setFont("helvetica");
  
  // Header
  doc.setFillColor(15, 23, 42); // navy-900 equivalent
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("PROBENN", 15, 25);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Receipt / Invoice", 150, 25);

  // Reset text color for body
  doc.setTextColor(51, 65, 85);

  // Billing Details
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Billed To:", 15, 55);
  
  doc.setFont("helvetica", "normal");
  doc.text(user?.organization_name || user?.name || 'Customer', 15, 62);
  doc.text(user?.email || '', 15, 68);

  doc.setFont("helvetica", "bold");
  doc.text("Invoice Details:", 120, 55);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Reference: ${transaction.id?.slice(0, 8).toUpperCase() || 'N/A'}`, 120, 62);
  doc.text(`Date: ${new Date(transaction.created_at).toLocaleDateString()}`, 120, 68);
  doc.text(`Status: ${transaction.status.toUpperCase()}`, 120, 74);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 85, 195, 85);

  // Table Header
  doc.setFont("helvetica", "bold");
  doc.text("Description", 15, 95);
  doc.text("Amount", 175, 95, { align: "right" });

  doc.line(15, 100, 195, 100);

  // Table Row
  doc.setFont("helvetica", "normal");
  const splitTitle = doc.splitTextToSize(transaction.title, 140);
  doc.text(splitTitle, 15, 110);
  doc.text(`$${Number(transaction.amount_usd).toFixed(2)}`, 175, 110, { align: "right" });

  // Divider
  doc.line(15, 125, 195, 125);

  // Total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total Paid:", 135, 135);
  doc.text(`$${Number(transaction.amount_usd).toFixed(2)}`, 175, 135, { align: "right" });

  // Footer
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Thank you for your business.", 105, 280, { align: "center" });

  // Download
  doc.save(`Receipt_${transaction.id?.slice(0, 8) || 'Proben'}.pdf`);
};
