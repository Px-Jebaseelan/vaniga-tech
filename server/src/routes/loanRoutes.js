import express from 'express';
import {
    getLoanApplications,
    createLoanApplication,
    getLoanApplication,
} from '../controllers/loanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getLoanApplications).post(createLoanApplication);

router.route('/:id').get(getLoanApplication);

export default router;

