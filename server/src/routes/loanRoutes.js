const express = require('express');
const router = express.Router();
const {
    getLoanApplications,
    createLoanApplication,
    getLoanApplication,
} = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getLoanApplications).post(createLoanApplication);

router.route('/:id').get(getLoanApplication);

module.exports = router;
