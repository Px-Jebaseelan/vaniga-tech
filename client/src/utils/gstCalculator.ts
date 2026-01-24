export const calculateGST = (amount: number, gstRate: number = 18): { gstAmount: number; totalAmount: number } => {
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;

    return {
        gstAmount: Math.round(gstAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
    };
};

export const extractBaseAmount = (totalAmount: number, gstRate: number = 18): { baseAmount: number; gstAmount: number } => {
    const baseAmount = totalAmount / (1 + gstRate / 100);
    const gstAmount = totalAmount - baseAmount;

    return {
        baseAmount: Math.round(baseAmount * 100) / 100,
        gstAmount: Math.round(gstAmount * 100) / 100,
    };
};

export const validateGSTNumber = (gstNumber: string): boolean => {
    // GST format: 22AAAAA0000A1Z5 (15 characters)
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
};

export const formatGSTNumber = (gstNumber: string): string => {
    return gstNumber.toUpperCase().replace(/\s/g, '');
};
