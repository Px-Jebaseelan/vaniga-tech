import { z } from 'zod';

// Transaction validation schemas
export const createTransactionSchema = z.object({
    body: z.object({
        type: z.enum(['CREDIT_GIVEN', 'PAYMENT_RECEIVED', 'EXPENSE'], {
            required_error: 'Transaction type is required',
        }),
        amount: z.number({
            required_error: 'Amount is required',
        }).positive('Amount must be positive').max(100000000, 'Amount cannot exceed 10 crore'),
        customerName: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
        category: z.enum(['RENT', 'INVENTORY', 'UTILITIES', 'SALARIES', 'TRANSPORT', 'MARKETING', 'OTHER']).optional(),
        paymentMethod: z.enum(['CASH', 'UPI', 'PENDING']).optional(),
        date: z.string().datetime().optional(),
    }),
});

// User registration validation
export const registerUserSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Name is required',
        }).min(2, 'Name must be at least 2 characters').max(100),
        businessName: z.string({
            required_error: 'Business name is required',
        }).min(2).max(200),
        email: z.string({
            required_error: 'Email is required',
        }).email('Invalid email format'),
        phone: z.string({
            required_error: 'Phone number is required',
        }).regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
        password: z.string({
            required_error: 'Password is required',
        }).min(6, 'Password must be at least 6 characters'),
    }),
});

// User login validation
export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
    }),
});

// Customer validation
export const createCustomerSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Customer name is required',
        }).min(1).max(100),
        phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number').optional(),
        email: z.string().email('Invalid email').optional(),
        address: z.string().max(500).optional(),
        notes: z.string().max(1000).optional(),
    }),
});

// Budget validation
export const createBudgetSchema = z.object({
    body: z.object({
        category: z.enum(['RENT', 'INVENTORY', 'UTILITIES', 'SALARIES', 'TRANSPORT', 'MARKETING', 'OTHER'], {
            required_error: 'Category is required',
        }),
        monthlyLimit: z.number({
            required_error: 'Monthly limit is required',
        }).positive('Limit must be positive'),
        month: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month format (YYYY-MM)').optional(),
        alertThreshold: z.number().min(0).max(100).optional(),
    }),
});

// Loan application validation
export const createLoanSchema = z.object({
    body: z.object({
        amount: z.number({
            required_error: 'Loan amount is required',
        }).positive().min(10000, 'Minimum loan amount is ₹10,000').max(10000000, 'Maximum loan amount is ₹1 crore'),
        purpose: z.string({
            required_error: 'Loan purpose is required',
        }).min(10, 'Purpose must be at least 10 characters').max(500),
        tenure: z.number().int().min(3, 'Minimum tenure is 3 months').max(60, 'Maximum tenure is 60 months'),
    }),
});

// Validation middleware
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors,
                });
            }
            next(error);
        }
    };
};
