import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
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
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
app.use('/api/loans', loanRoutes); // Mounted loan routes

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
