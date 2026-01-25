import Customer from '../models/Customer.js';

// @desc    Get all customers for a user
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req, res, next) => {
    try {
        const { search, sortBy = 'name', order = 'asc' } = req.query;

        const query = { userId: req.user._id };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const sortOptions = { [sortBy]: sortOrder };

        const customers = await Customer.find(query).sort(sortOptions);

        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req, res, next) => {
    try {
        const { name, phone, email, address, notes } = req.body;

        // Check if customer with same name already exists
        const existingCustomer = await Customer.findOne({
            userId: req.user._id,
            name: { $regex: new RegExp(`^${name}$`, 'i') },
        });

        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Customer with this name already exists',
            });
        }

        const customer = await Customer.create({
            userId: req.user._id,
            name,
            phone,
            email,
            address,
            notes,
        });

        res.status(201).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req, res, next) => {
    try {
        const { name, phone, email, address, notes } = req.body;

        let customer = await Customer.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        // Update fields
        if (name) customer.name = name;
        if (phone !== undefined) customer.phone = phone;
        if (email !== undefined) customer.email = email;
        if (address !== undefined) customer.address = address;
        if (notes !== undefined) customer.notes = notes;

        await customer.save();

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        await customer.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Customer deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh customer balances
// @route   POST /api/customers/:id/refresh
// @access  Private
export const refreshCustomerBalances = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        await customer.updateBalances();

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

