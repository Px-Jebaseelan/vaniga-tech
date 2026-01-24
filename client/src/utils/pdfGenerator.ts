import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { User, Transaction, DashboardStats } from '../types';

export const generateCreditReport = (
    user: User,
    transactions: Transaction[],
    stats?: DashboardStats | null
) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(79, 70, 229); // Indigo
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('VanigaTech', 14, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Credit Platform', 14, 28);

    // Report Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Credit Score Report', 14, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 62);

    // Business Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Business Information', 14, 75);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Business Name: ${user.businessName}`, 14, 85);
    doc.text(`Owner: ${user.ownerName || 'N/A'}`, 14, 92);
    doc.text(`Phone: ${user.phone}`, 14, 99);
    doc.text(`Member Since: ${new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 14, 106);

    // VanigaScore Section
    doc.setFillColor(240, 245, 255);
    doc.roundedRect(14, 115, pageWidth - 28, 35, 3, 3, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('VanigaScore™', 20, 125);

    doc.setFontSize(32);
    const scoreColor = user.vanigaScore >= 750 ? [16, 185, 129] :
        user.vanigaScore >= 650 ? [59, 130, 246] :
            user.vanigaScore >= 550 ? [245, 158, 11] : [239, 68, 68];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(user.vanigaScore.toString(), 20, 143);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const rating = user.vanigaScore >= 750 ? 'Excellent' :
        user.vanigaScore >= 650 ? 'Good' :
            user.vanigaScore >= 550 ? 'Fair' : 'Building';
    doc.text(`Rating: ${rating}`, 70, 143);

    doc.setFont('helvetica', 'normal');
    doc.text(`Loan Eligible: ${user.loanEligible ? 'Yes ✓' : 'No'}`, 120, 143);

    // Score Breakdown
    if (stats?.scoreBreakdown) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Score Breakdown', 14, 165);

        const breakdown = [
            ['Component', 'Score', 'Maximum'],
            ['Volume Score', `+${stats.scoreBreakdown.breakdown.volume}`, '250'],
            ['Consistency Score', `+${stats.scoreBreakdown.breakdown.consistency}`, '300'],
            ['Health Score', `+${stats.scoreBreakdown.breakdown.health}`, '50'],
            ['Base Score', '300', '300'],
            ['Total', user.vanigaScore.toString(), '900'],
        ];

        autoTable(doc, {
            startY: 170,
            head: [breakdown[0]],
            body: breakdown.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255 },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 40, halign: 'center' },
                2: { cellWidth: 40, halign: 'center' },
            },
        });
    }

    // Business Metrics
    const finalY = (doc as any).lastAutoTable?.finalY || 220;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Business Metrics', 14, finalY + 15);

    if (stats) {
        const metrics = [
            ['Metric', 'Value'],
            ['Total Credit Given', `₹${stats.stats.totalCreditGiven.toLocaleString('en-IN')}`],
            ['Payment Received', `₹${stats.stats.totalPaymentReceived.toLocaleString('en-IN')}`],
            ['Pending Amount', `₹${stats.stats.pendingAmount.toLocaleString('en-IN')}`],
            ['Total Expenses', `₹${stats.stats.totalExpenses.toLocaleString('en-IN')}`],
            ['Active Business Days', stats.scoreBreakdown?.metrics.activeDays.toString() || '0'],
        ];

        autoTable(doc, {
            startY: finalY + 20,
            head: [metrics[0]],
            body: metrics.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [79, 70, 229], textColor: 255 },
            styles: { fontSize: 9 },
        });
    }

    // Recent Transactions
    const metricsY = (doc as any).lastAutoTable?.finalY || 270;

    if (metricsY < 250) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Recent Transactions', 14, metricsY + 15);

        const recentTxns = transactions.slice(0, 10);
        const txnData = recentTxns.map(txn => [
            new Date(txn.date).toLocaleDateString('en-IN'),
            txn.type.replace('_', ' '),
            txn.customerName || '-',
            `₹${txn.amount.toLocaleString('en-IN')}`,
        ]);

        autoTable(doc, {
            startY: metricsY + 20,
            head: [['Date', 'Type', 'Customer', 'Amount']],
            body: txnData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255 },
            styles: { fontSize: 8 },
        });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Page ${i} of ${pageCount} | VanigaTech Credit Report | Confidential`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    const fileName = `VanigaTech_Credit_Report_${user.businessName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};
