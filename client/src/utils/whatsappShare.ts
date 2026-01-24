import type { User, DashboardStats } from '../types';

export const shareViaWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
};

export const shareCreditReport = (user: User, stats?: DashboardStats | null) => {
    const message = `
🏢 *VanigaTech Credit Report*

📊 *Business:* ${user.businessName}
📞 *Phone:* ${user.phone}

💳 *VanigaScore:* ${user.vanigaScore}/900
${user.loanEligible ? '✅ Loan Eligible' : '❌ Not Loan Eligible'}

${stats ? `
📈 *Business Metrics:*
• Credit Given: ₹${stats.stats.totalCreditGiven.toLocaleString('en-IN')}
• Payment Received: ₹${stats.stats.totalPaymentReceived.toLocaleString('en-IN')}
• Pending Amount: ₹${stats.stats.pendingAmount.toLocaleString('en-IN')}
• Total Expenses: ₹${stats.stats.totalExpenses.toLocaleString('en-IN')}
` : ''}

📅 *Report Date:* ${new Date().toLocaleDateString('en-IN')}

Powered by VanigaTech Credit Platform
  `.trim();

    shareViaWhatsApp(message);
};

export const shareTransactionSummary = (totalTransactions: number, totalAmount: number) => {
    const message = `
📊 *Transaction Summary*

Total Transactions: ${totalTransactions}
Total Amount: ₹${totalAmount.toLocaleString('en-IN')}

Generated on ${new Date().toLocaleDateString('en-IN')}

Powered by VanigaTech
  `.trim();

    shareViaWhatsApp(message);
};

export const shareCustomerReminder = (customerName: string, outstandingAmount: number, businessName: string) => {
    const message = `
नमस्ते ${customerName} जी,

यह ${businessName} की ओर से एक अनुस्मारक है।

आपकी बकाया राशि: ₹${outstandingAmount.toLocaleString('en-IN')}

कृपया जल्द से जल्द भुगतान करें।

धन्यवाद! 🙏
  `.trim();

    shareViaWhatsApp(message);
};
