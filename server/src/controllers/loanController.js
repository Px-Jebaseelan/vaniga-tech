const LoanApplication = require('../models/LoanApplication');

// @desc    Get all loan applications for a user
// @route   GET /api/loans
// @access  Private
exports.getLoanApplications = async (req, res, next) => {
    try {
        const applications = await LoanApplication.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new loan application
// @route   POST /api/loans
// @access  Private
exports.createLoanApplication = async (req, res, next) => {
    try {
        const { loanAmount, purpose, tenure, remarks } = req.body;

        // Check loan eligibility
        if (!req.user.loanEligible) {
            return res.status(400).json({
                success: false,
                message: 'Your VanigaScore is not high enough for loan eligibility. Keep building your credit!',
            });
        }

        const application = await LoanApplication.create({
            userId: req.user._id,
            loanAmount,
            purpose,
            tenure,
            remarks,
            vanigaScoreAtApplication: req.user.vanigaScore,
        });

        res.status(201).json({
            success: true,
            data: application,
            message: 'Loan application submitted successfully!',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single loan application
// @route   GET /api/loans/:id
// @access  Private
exports.getLoanApplication = async (req, res, next) => {
    try {
        const application = await LoanApplication.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Loan application not found',
            });
        }

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};
