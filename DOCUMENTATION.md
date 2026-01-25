# VanigaTech - Professional Documentation

## Executive Summary

**VanigaTech** is a comprehensive fintech platform designed specifically for micro and small businesses (MSMEs) in India. The platform enables businesses to build creditworthiness through systematic transaction tracking, ultimately helping them become loan-eligible through our proprietary **VanigaScore™** system.

**Live Application**: [https://vaniga-tech.vercel.app](https://vaniga-tech.vercel.app)

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Core Features](#core-features)
3. [Technical Architecture](#technical-architecture)
4. [User Guide](#user-guide)
5. [API Documentation](#api-documentation)
6. [Deployment](#deployment)
7. [Security & Privacy](#security--privacy)
8. [Future Roadmap](#future-roadmap)

---

## Platform Overview

### Problem Statement

India has over **63 million micro-businesses** that struggle to access formal credit due to lack of credit history. Traditional credit scoring systems don't account for the unique transaction patterns of small businesses.

### Solution

VanigaTech provides a digital platform where businesses can:
- Track daily credit given to customers
- Record payments received
- Manage expenses
- Build a **VanigaScore** (300-900 range)
- Become eligible for formal loans (score ≥ 650)

### Target Users

- Small shop owners
- Street vendors
- Service providers
- Micro-entrepreneurs
- Anyone running a cash-based business

---

## Core Features

### 1. Voice-Based Transaction Entry

**Description**: Industry-grade voice recognition system for hands-free transaction recording.

**Key Capabilities**:
- Natural language processing in English, Hindi, and Tamil
- Supports multiple transaction patterns:
  - "Credit given to Ramesh 5000 rupees"
  - "Payment received from Suresh 3000"
  - "Expense 17,000 for rent"
  - "Credits given to Phoenix was ₹150"
- Handles comma-separated numbers (17,000)
- Supports Indian numbering (lakh, crore, thousand)
- Real-time confidence scoring (60%+ required)
- Auto-stop after utterance completion

**Technical Implementation**:
- Web Speech API with Indian English (en-IN)
- Non-continuous mode for reliability
- 3 alternative transcriptions for accuracy
- Comprehensive NLP parser with 23+ keyword patterns
- Regex-based amount extraction with multiplier support

**User Flow**:
1. Click "Voice Input" button
2. Click "Start" to begin listening
3. Speak transaction details clearly
4. Review parsed data (Type, Amount, Customer)
5. Confirm or edit before saving

---

### 2. QR Code Payment Integration

**Description**: Generate and share QR codes for seamless payment collection.

**Key Capabilities**:
- Dynamic QR code generation with UPI deep links
- Customizable payment amounts
- Customer name integration
- Multiple sharing options (WhatsApp, Download, Copy)
- Professional QR code design with branding

**Technical Implementation**:
- `qrcode.react` library for QR generation
- UPI URI format: `upi://pay?pa=...&pn=...&am=...&cu=INR`
- Canvas-based QR code rendering
- PNG export with high resolution

**User Flow**:
1. Navigate to Transactions → "QR Code"
2. Enter amount and optional customer name
3. Generate QR code
4. Share via WhatsApp or download
5. Customer scans and pays via any UPI app

---

### 3. AI-Powered Business Insights

**Description**: Google Gemini AI analyzes transaction data to provide personalized business recommendations.

**Key Capabilities**:
- Manual generation (saves API quota)
- Analyzes up to 100 recent transactions
- Provides 4-5 actionable insights:
  - Cash flow management tips
  - Credit score improvement suggestions
  - Business growth recommendations
  - Risk assessments
  - Positive encouragement
- Beautiful loading animations
- Refresh capability

**Technical Implementation**:
- Google Generative AI SDK
- Model: `gemini-flash-lite-latest`
- Comprehensive business data summary
- Smart prompt engineering for relevant insights
- Error handling with user-friendly messages

**Sample Insights**:
- "Your collection rate of 85% is excellent. Consider offering small discounts for early payments."
- "You've given ₹50,000 in credit this month. Track pending amounts closely to maintain cash flow."
- "Your VanigaScore of 720 makes you eligible for business loans up to ₹5 lakhs."

---

### 4. VanigaScore™ Credit Scoring

**Description**: Proprietary credit scoring algorithm (300-900 range) based on transaction behavior.

**Scoring Components**:

1. **Base Score** (300 points)
   - Starting point for all users

2. **Volume Score** (up to 300 points)
   - Based on total transaction volume
   - Formula: `min(300, (totalVolume / 100000) * 100)`

3. **Consistency Score** (up to 200 points)
   - Rewards regular transaction recording
   - Formula: `min(200, (transactionCount / 50) * 100)`

4. **Health Score** (up to 200 points)
   - Based on payment collection rate
   - Formula: `(paymentsReceived / creditGiven) * 200`

**Score Ranges**:
- 300-450: Building (15th percentile)
- 451-550: Fair (35th percentile)
- 551-650: Good (60th percentile)
- 651-750: Very Good (80th percentile) - **Loan Eligible**
- 751-900: Exceptional (95th percentile)

**Achievement Badges**:
- 🥉 Bronze (300+)
- 🥈 Silver (500+)
- 🥇 Gold (650+)
- 💎 Platinum (750+)
- 💠 Diamond (850+)

---

### 5. Comprehensive Analytics Dashboard

**Description**: Visual insights into business performance with interactive charts.

**Key Metrics**:
- Total Credit Given
- Payment Received
- Pending Amount
- Total Expenses
- VanigaScore with trend indicator
- Collection Rate

**Visualizations**:

1. **Daily Transaction Trend** (Line Chart)
   - Last 7 days of activity
   - Credit vs Payment comparison

2. **Monthly Overview** (Bar Chart)
   - Last 6 months
   - Revenue and expense trends

3. **Expense Breakdown** (Pie Chart)
   - 7 categories: Rent, Inventory, Utilities, Salary, Transport, Marketing, Other
   - Percentage distribution

4. **Recent Transactions** (List)
   - Last 5 transactions
   - Quick view with type badges

**Technical Implementation**:
- Recharts library for data visualization
- Real-time data aggregation
- Responsive design for mobile
- Color-coded transaction types

---

## Technical Architecture

### Frontend Stack

**Framework**: React 18.3 with TypeScript
**Build Tool**: Vite 7.2
**Styling**: TailwindCSS 3.4
**State Management**: React Context API
**Routing**: React Router v6
**HTTP Client**: Axios
**Animations**: Framer Motion
**Charts**: Recharts
**i18n**: i18next (English, Hindi, Tamil)
**PDF Generation**: jsPDF
**QR Codes**: qrcode.react

### Backend Stack

**Runtime**: Node.js 18+
**Framework**: Express.js 4.21
**Database**: MongoDB with Mongoose ODM
**Authentication**: JWT (JSON Web Tokens)
**Password Hashing**: bcryptjs
**AI Integration**: Google Generative AI SDK
**Environment**: dotenv

### Deployment

**Frontend**: Vercel (https://vaniga-tech.vercel.app)
**Backend**: Render (https://vaniga-tech.onrender.com)
**Database**: MongoDB Atlas
**CI/CD**: GitHub Actions (automated keep-alive)

### Project Structure

```
vaniga-tech/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   ├── hooks/         # Custom hooks (useVoiceInput)
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── i18n/          # Translations
│   │   ├── types/         # TypeScript types
│   │   └── data/          # Static data (benchmarks)
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Entry point
│   └── package.json
│
└── README.md
```

---

## User Guide

### Getting Started

#### 1. Registration

1. Visit https://vaniga-tech.vercel.app
2. Click "Register"
3. Fill in:
   - Full Name
   - Business Name
   - Email
   - Phone Number
   - Password
4. Click "Create Account"

#### 2. Login

1. Enter email and password
2. Click "Login"
3. Access your dashboard

### Recording Transactions

#### Method 1: Manual Entry

1. Go to "Transactions" page
2. Click "Add Transaction"
3. Select type: Credit Given / Payment Received / Expense
4. Enter amount
5. Add customer name (for credit/payment)
6. Select category (for expenses)
7. Click "Save"

#### Method 2: Voice Input

1. Go to "Transactions" page
2. Click "Voice Input" button
3. Click "Start"
4. Say: "Credit given to [Name] [Amount] rupees"
5. Review parsed data
6. Click "Confirm"

### Managing Customers

1. Go to "Customers" page
2. View all customers with outstanding balances
3. Click on a customer to see:
   - Total credit given
   - Payments received
   - Outstanding balance
   - Transaction history

### Viewing Analytics

1. Go to "Analytics" page
2. View:
   - Daily trends
   - Monthly overview
   - Expense breakdown
   - Key metrics

### Generating Reports

1. Go to "Profile" page
2. Click "Download Credit Report"
3. PDF report includes:
   - VanigaScore
   - Transaction summary
   - Recent transactions
   - Loan eligibility status

### Using QR Codes

1. Go to "Transactions" → "QR Code"
2. Enter amount
3. Add customer name (optional)
4. Click "Generate QR Code"
5. Share via:
   - WhatsApp
   - Download PNG
   - Copy to clipboard

### Getting AI Insights

1. Go to "Dashboard"
2. Find "AI Insights" section
3. Click "Generate Insights"
4. Wait for analysis (10-15 seconds)
5. Review 4-5 personalized recommendations
6. Click "Refresh" for updated insights

---

## API Documentation

### Base URL

**Production**: `https://vaniga-tech.onrender.com/api`
**Local**: `http://localhost:5000/api`

### Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

**POST** `/auth/register`
- Register new user
- Body: `{ name, businessName, email, phone, password }`
- Returns: `{ success, token, user }`

**POST** `/auth/login`
- Login user
- Body: `{ email, password }`
- Returns: `{ success, token, user }`

**GET** `/auth/me`
- Get current user
- Requires: Auth token
- Returns: `{ success, user }`

#### Transactions

**GET** `/transactions`
- Get all user transactions
- Requires: Auth token
- Returns: `{ success, transactions }`

**POST** `/transactions`
- Create transaction
- Body: `{ type, amount, customerName?, category?, date }`
- Returns: `{ success, transaction }`

**PUT** `/transactions/:id`
- Update transaction
- Returns: `{ success, transaction }`

**DELETE** `/transactions/:id`
- Delete transaction
- Returns: `{ success }`

#### Dashboard

**GET** `/dashboard/stats`
- Get dashboard statistics
- Returns: `{ success, stats: { totalCreditGiven, totalPaymentReceived, pendingAmount, totalExpenses, vanigaScore, transactionCount } }`

#### AI Insights

**GET** `/ai/insights`
- Get AI-powered business insights
- Requires: Auth token, GEMINI_API_KEY
- Returns: `{ success, data: { insights: string[], generatedAt: Date } }`

#### Customers

**GET** `/customers`
- Get all customers
- Returns: `{ success, customers }`

**POST** `/customers`
- Create customer
- Body: `{ name, phone?, email?, gstNumber? }`
- Returns: `{ success, customer }`

---

## Deployment

### Frontend (Vercel)

1. **Connect Repository**:
   - Link GitHub repository to Vercel
   - Auto-deploy on push to `main`

2. **Environment Variables**:
   ```
   VITE_API_URL=https://vaniga-tech.onrender.com/api
   ```

3. **Build Settings**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend (Render)

1. **Create Web Service**:
   - Connect GitHub repository
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables**:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   CLIENT_URL=https://vaniga-tech.vercel.app
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Auto-Deploy**: Enabled on push to `main`

### Database (MongoDB Atlas)

1. Create cluster
2. Whitelist IP: `0.0.0.0/0` (all IPs)
3. Create database user
4. Get connection string
5. Add to `MONGODB_URI`

---

## Security & Privacy

### Authentication

- JWT-based authentication
- Passwords hashed with bcryptjs (10 salt rounds)
- Token expiration: 30 days
- Secure HTTP-only cookies (optional)

### Data Protection

- All API requests over HTTPS
- CORS enabled for trusted origins only
- Input validation on all endpoints
- MongoDB injection prevention via Mongoose

### Privacy

- User data encrypted at rest (MongoDB Atlas)
- No third-party data sharing
- GDPR-compliant data handling
- Users can delete their accounts

---

## Future Roadmap

### Phase 1 (Completed ✅)
- ✅ Core transaction management
- ✅ VanigaScore algorithm
- ✅ Voice input feature
- ✅ QR code payments
- ✅ AI insights
- ✅ Multi-language support

### Phase 2 (Planned)
- 📱 Mobile app (React Native)
- 🏦 Direct loan application integration
- 📊 Advanced analytics with ML predictions
- 💳 Payment gateway integration
- 📧 Email/SMS notifications
- 🔔 Payment reminders

### Phase 3 (Future)
- 🤝 Multi-user support (team accounts)
- 📱 WhatsApp bot integration
- 🌐 Offline mode with sync
- 📈 Inventory management
- 💰 Invoice generation
- 🔗 Accounting software integration

---

## Support & Contact

**GitHub**: [https://github.com/Px-Jebaseelan/vaniga-tech](https://github.com/Px-Jebaseelan/vaniga-tech)
**Live Demo**: [https://vaniga-tech.vercel.app](https://vaniga-tech.vercel.app)
**API**: [https://vaniga-tech.onrender.com](https://vaniga-tech.onrender.com)

---

## License

MIT License - Free to use for educational and commercial purposes.

---

## Acknowledgments

- **Google Gemini AI** for business insights
- **Vercel** for frontend hosting
- **Render** for backend hosting
- **MongoDB Atlas** for database
- **React** and **Node.js** communities

---

**Built with ❤️ for India's Small Businesses**

*Empowering 63 million micro-businesses to access formal credit*
