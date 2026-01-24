import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { calculateVanigaScore } from '../utils/calculateScore.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new merchant/business owner
 * @access  Public
 */
export const register = async (req, res) => {
    try {
        const { businessName, ownerName, phone, password } = req.body;

        // Validate required fields
        if (!businessName || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide business name, phone, and password',
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already registered',
            });
        }

        // Create new user
        const user = await User.create({
            businessName,
            ownerName,
            phone,
            password, // Will be hashed by pre-save hook
        });

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: user._id,
                    businessName: user.businessName,
                    ownerName: user.ownerName,
                    phone: user.phone,
                    vanigaScore: user.vanigaScore,
                    loanEligible: user.loanEligible,
                    onboardingComplete: user.onboardingComplete,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration',
        });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validate input
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone and password',
            });
        }

        // Find user and include password field
        const user = await User.findOne({ phone }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    businessName: user.businessName,
                    ownerName: user.ownerName,
                    phone: user.phone,
                    vanigaScore: user.vanigaScore,
                    loanEligible: user.loanEligible,
                    onboardingComplete: user.onboardingComplete,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during login',
        });
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
export const getMe = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    businessName: user.businessName,
                    ownerName: user.ownerName,
                    phone: user.phone,
                    vanigaScore: user.vanigaScore,
                    loanEligible: user.loanEligible,
                    onboardingComplete: user.onboardingComplete,
                },
            },
        });
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
    try {
        const { businessName, ownerName, onboardingComplete } = req.body;

        const user = await User.findById(req.user._id);

        if (businessName) user.businessName = businessName;
        if (ownerName) user.ownerName = ownerName;
        if (onboardingComplete !== undefined) user.onboardingComplete = onboardingComplete;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    businessName: user.businessName,
                    ownerName: user.ownerName,
                    phone: user.phone,
                    vanigaScore: user.vanigaScore,
                    loanEligible: user.loanEligible,
                    onboardingComplete: user.onboardingComplete,
                },
            },
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
