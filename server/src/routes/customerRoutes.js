const express = require('express');
const router = express.Router();
const {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomerBalances,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/').get(getCustomers).post(createCustomer);

router
    .route('/:id')
    .get(getCustomer)
    .put(updateCustomer)
    .delete(deleteCustomer);

router.post('/:id/refresh', refreshCustomerBalances);

module.exports = router;
