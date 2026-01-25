import QRCode from 'qrcode';

/**
 * Generate UPI payment QR code
 * @param upiId - Merchant's UPI ID (e.g., merchant@upi)
 * @param amount - Payment amount in rupees
 * @param name - Merchant/Business name
 * @param transactionNote - Optional note for the transaction
 * @returns Promise<string> - Base64 encoded QR code image
 */
export const generateUPIQRCode = async (
    upiId: string,
    amount: number,
    name: string,
    transactionNote?: string
): Promise<string> => {
    // Create UPI deep link
    // Format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR&tn=<NOTE>
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR${transactionNote ? `&tn=${encodeURIComponent(transactionNote)}` : ''}`;

    try {
        // Generate QR code as base64 image
        const qrCodeDataURL = await QRCode.toDataURL(upiLink, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });

        return qrCodeDataURL;
    } catch (error) {
        console.error('QR Code generation error:', error);
        throw new Error('Failed to generate QR code');
    }
};

/**
 * Generate UPI payment link (for copy functionality)
 */
export const generateUPILink = (
    upiId: string,
    amount: number,
    name: string,
    transactionNote?: string
): string => {
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR${transactionNote ? `&tn=${encodeURIComponent(transactionNote)}` : ''}`;
};

/**
 * Validate UPI ID format
 */
export const isValidUPIId = (upiId: string): boolean => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(upiId);
};
