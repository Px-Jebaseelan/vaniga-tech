const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpStore = new Map();

exports.sendOTP = async (phone) => {
    const otp = generateOTP();

    // Store OTP with 5-minute expiry
    otpStore.set(phone, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`OTP for ${phone}: ${otp}`);

    // For development, return OTP (remove in production)
    return { success: true, otp: process.env.NODE_ENV === 'development' ? otp : undefined };
};

exports.verifyOTP = (phone, otp) => {
    const stored = otpStore.get(phone);

    if (!stored) {
        return { success: false, message: 'OTP not found or expired' };
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(phone);
        return { success: false, message: 'OTP expired' };
    }

    if (stored.otp !== otp) {
        return { success: false, message: 'Invalid OTP' };
    }

    otpStore.delete(phone);
    return { success: true, message: 'OTP verified successfully' };
};

exports.clearOTP = (phone) => {
    otpStore.delete(phone);
};
