import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema - Represents a micro-MSME business owner
 * 
 * Core Fields:
 * - businessName: The name of the merchant's business
 * - ownerName: Personal name of the business owner
 * - phone: Unique identifier for authentication (India-centric)
 * - password: Hashed password for security
 * - vanigaScore: Proprietary credit score (300-900 range, like CIBIL)
 * - loanEligible: Computed flag based on score threshold
 * - onboardingComplete: Tracks if user has completed initial setup
 */
const userSchema = new mongoose.Schema(
    {
        businessName: {
            type: String,
            required: [true, 'Business name is required'],
            trim: true,
            maxlength: [100, 'Business name cannot exceed 100 characters'],
        },
        ownerName: {
            type: String,
            trim: true,
            maxlength: [100, 'Owner name cannot exceed 100 characters'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            trim: true,
            match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number'],
            index: true, // Indexed for faster lookups during login
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password in queries by default
        },
        vanigaScore: {
            type: Number,
            default: 300, // Starting score for new users (like CIBIL's minimum)
            min: 300,
            max: 900,
        },
        loanEligible: {
            type: Boolean,
            default: false,
        },
        onboardingComplete: {
            type: Boolean,
            default: false,
        },
        gstNumber: {
            type: String,
            trim: true,
            uppercase: true,
            sparse: true,
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

/**
 * Pre-save Hook: Hash password before saving to database
 * Only runs if password is modified (new user or password change)
 */
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance Method: Compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password from login
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Instance Method: Update loan eligibility based on VanigaScore
 * Threshold: Score >= 650 makes user eligible for loans
 */
userSchema.methods.updateLoanEligibility = function () {
    this.loanEligible = this.vanigaScore >= 650;
};

const User = mongoose.model('User', userSchema);

export default User;
