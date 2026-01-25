import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ═══════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════

// CORS - Allow frontend to communicate with backend
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://vaniga-tech.vercel.app',
    process.env.CLIENT_URL,
].filter(Boolean); // Remove undefined values

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log('Blocked origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// Body parser - Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ═══════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'VanigaTech API is running',
        version: '1.0.0',
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/budgets', budgetRoutes);

// ═══════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════

app.use(notFound);
app.use(errorHandler);

// ═══════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║   🚀 VanigaTech Server Running                               ║
  ║                                                               ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                                    ║
  ║   Port: ${PORT}                                                ║
  ║   Database: MongoDB                                           ║
  ║                                                               ║
  ║   API Endpoints:                                              ║
  ║   • POST /api/auth/register                                   ║
  ║   • POST /api/auth/login                                      ║
  ║   • GET  /api/auth/me                                         ║
  ║   • POST /api/transactions                                    ║
  ║   • GET  /api/transactions                                    ║
  ║   • GET  /api/transactions/stats/dashboard                    ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
