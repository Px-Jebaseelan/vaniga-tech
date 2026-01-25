import express from 'express';
import {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomerBalances,
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/').get(getCustomers).post(createCustomer);

router
    .route('/:id')
    .get(getCustomer)
    .put(updateCustomer)
    .delete(deleteCustomer);

router.post('/:id/refresh', refreshCustomerBalances);

export default router;

