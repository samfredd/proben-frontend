export function isHostedInvoiceFileUrl(fileUrl) {
  return /^https?:\/\//i.test(String(fileUrl || '').trim());
}

export function getInvoiceAmount(invoice) {
  return Number(invoice?.amount_usd ?? invoice?.amount ?? invoice?.amount_due ?? 0);
}
