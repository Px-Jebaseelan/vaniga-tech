# VanigaTech 🚀

**Credit Platform for Micro-MSMEs** | Building Credit Scores for India's Small Businesses

VanigaTech is a fintech platform that helps micro and small businesses build their credit scores by tracking daily transactions. Get loan-ready with our proprietary VanigaScore™ system.

![VanigaTech](https://img.shields.io/badge/VanigaTech-Credit%20Platform-4F46E5)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.3.1-blue)

## 🌐 Live Demo

- **Frontend (Client)**: [https://vaniga-tech.vercel.app](https://vaniga-tech.vercel.app)
- **Backend (API)**: [https://vaniga-tech.onrender.com](https://vaniga-tech.onrender.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Multi-Language Support](#-multi-language-support)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features
- 🎯 **VanigaScore™** - Proprietary credit scoring system (300-900 range)
- 💰 **Transaction Management** - Track credit given, payments received, and expenses
- 👥 **Customer Management** - Manage customer relationships and outstanding balances
- 📊 **Analytics Dashboard** - Visual insights with charts and trends
- 📄 **PDF Reports** - Download professional credit reports
- 🌐 **Multi-Language** - English, Hindi (हिंदी), Tamil (தமிழ்)

### Advanced Features
- 📱 **WhatsApp Integration** - Share credit reports via WhatsApp
- ⚡ **Quick Actions** - Keyboard shortcuts (Ctrl+T/C/A/D)
- 📈 **Expense Categorization** - 7 categories (Rent, Inventory, Utilities, etc.)
- 🧾 **GST Integration** - GST number tracking and calculations
- 🔐 **Two-Factor Authentication** - OTP-based security
- 🏦 **Loan Applications** - Direct loan eligibility and applications
- 🎨 **Modern UI** - Responsive design with smooth animations

---

## 🛠 Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **i18next** - Internationalization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vanigatech.git
cd vanigatech
```

2. **Install dependencies**

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

3. **Set up environment variables**

Create `.env` files in both `server` and `client` directories (see [Environment Variables](#-environment-variables))

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the application**

**Server (Terminal 1):**
```bash
cd server
npm start
```

**Client (Terminal 2):**
```bash
cd client
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📁 Project Structure

```
vanigatech/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── hooks/         # Custom hooks
│   │   ├── i18n/          # Translations
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Entry point
│   └── package.json
│
└── README.md
```

---

## 🔐 Environment Variables

### Server (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/vanigatech

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# CORS
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get single customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Loans
- `GET /api/loans` - Get loan applications
- `POST /api/loans` - Create loan application
- `GET /api/loans/:id` - Get single loan application

---

## 🌐 Multi-Language Support

VanigaTech supports 3 languages:
- 🇬🇧 **English** - Default
- 🇮🇳 **Hindi** - हिंदी
- 🇮🇳 **Tamil** - தமிழ்

Language preference is saved to localStorage and persists across sessions.

---

## 🎯 VanigaScore™ Algorithm

The VanigaScore is calculated based on:
- **Base Score** (300 points) - Starting point
- **Volume Score** (up to 300 points) - Based on transaction volume
- **Consistency Score** (up to 200 points) - Regular transaction activity
- **Health Score** (up to 200 points) - Payment collection rate

**Score Range:** 300 - 900
**Loan Eligibility:** Score >= 650

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## � License

This project is licensed under the MIT License.

---

## � Support

For support, open an issue on GitHub.

---

**Made with ❤️ for India's Small Businesses**
