# 💸 Three-M — Make, Manage, Multiply Money

**Three-M** is a full-stack, production-grade **FinTech platform** built using **Clean Architecture (DDD)** that empowers users to **track, manage, and grow their wealth intelligently**.

It combines **real-time trading, AI-powered financial guidance, and advanced portfolio analytics** into a single unified ecosystem.

---

## 🚀 Why Three-M?

Most financial tools solve *one* problem.

**Three-M solves the entire financial journey:**

* 📊 Track your money
* 🧠 Manage you money
* 📈 Invest intelligently & trade
* 🤖 Automate financial decisions

---

## ✨ Core Capabilities

### 🔐 1. Secure & Scalable Foundation

* Multi-Factor Authentication (TOTP + QR)
* Google OAuth2 login
* Redis-based OTP system (rate-limited & secure)
* KYC workflow with admin verification
* JWT-based session handling

---

### 📈 2. Wealth Creation Engine

* **Real-time stock data** (WebSockets + Finnhub + Yahoo Finance)
* **Algorithmic trading engine**

  * Strategy-based execution
  * Fixed-value risk management
* Mutual funds & SIP management
* Long-term analytics:

  * XIRR calculations
  * 10-year projections

---

### 📊 3. Smart Financial Management

* Expense tracking with categorization
* Income vs spending insights (charts & analytics)
* Immutable ledger-based wallet system
* Transaction history & audit safety

---

### 🤖 4. AI-Powered Financial Intelligence

* Chat-based financial assistant (LangChain + OpenAI)
* Context-aware insights & recommendations
* Financial agents for:

  * Portfolio
  * Education
  * Trade execution
* Execute actions directly from chat (e.g. trading)

---

### 🤖 5. AI + Chat-Driven Trading

* Execute trades directly via chatbot
* Natural language → trading actions
* AI-assisted decision making before execution

---

### ⚙️ 5. Algorithmic Trading Engine

* Strategy-based automated trading
* Custom trading logic support
* Fixed-value risk control (loss protection)
* Event-driven execution using queues (BullMQ)

---

### 🛡️ 6. Admin & System Governance

* Central dashboard for:

  * Users
  * Transactions
  * KYC approvals
* SIP monitoring & observability
* Subscription system (Free vs Premium via Stripe)

---

### 📉 7. Investment Ecosystem

* Mutual funds & SIP management
* Portfolio diversification tools
* Automated investment tracking

---

### 📊 8. Advanced Portfolio Analytics

* XIRR calculations
* 10+ year growth projections
* Asset-wise performance insights

---

## 🏗️ Architecture (Clean Architecture / DDD)

Three-M follows a strict separation of concerns:

```
Domain Layer        → Core business logic
Application Layer   → Use cases & orchestration
Infrastructure      → DB, APIs, Redis, External services
Presentation Layer  → Controllers, UI, API endpoints
```

### Why this matters:

* Highly scalable
* Easy to test
* Plug-and-play integrations
* Production-ready design

---

## 🛠️ Tech Stack

### Backend

* Node.js + TypeScript
* Express.js
* MongoDB (Mongoose)
* Redis + BullMQ (Queues & caching)
* InversifyJS (Dependency Injection)

### Security

* Argon2 (password hashing)
* JWT authentication
* OTPLib (2FA)
* Google Auth Library

### AI & Intelligence

* LangChain
* OpenAI
* Pinecone (Vector DB)

### Frontend

* React 18 + Vite
* Zustand (State)
* TanStack Query (Data fetching)
* TanStack Router
* Tailwind CSS

### Visualization

* Recharts
* ApexCharts
* Lightweight Charts

---

## ⚡ Real-Time Capabilities

* Live stock updates via WebSockets
* Instant portfolio recalculation
* Real-time trade execution feedback

---

## 💡 Key Highlights

* 🔄 **Event-driven architecture** using queues
* 🧠 **AI + FinTech hybrid system**
* 🔒 **Security-first design**
* 📈 **Advanced financial analytics (XIRR, projections)**
* ⚙️ **Production-level code structure (DDD + Clean Architecture)**

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB
* Redis
* Stripe account
* Google OAuth credentials

---

### Installation

```bash
git clone https://github.com/Abisinan01/Three-M.git
cd Three-M
```

#### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

#### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📊 Future Roadmap

* 🔗 Blockchain-based immutable ledger (V2)
* 📱 Mobile app (React Native)
* 💰 Advanced tax optimization module
* 🌍 Multi-currency support

---

## 🧠 What This Project Demonstrates

This is not just a project — it showcases:

* System design thinking
* Scalable backend architecture
* Real-time systems
* AI integration in production
* Financial domain understanding

---

## 📄 License

ISC License

---

## 👨‍💻 Author

Developed by **Abisinan**
🔗 https://github.com/Abisinan01

---

## ⭐ Final Note

Three-M is designed as a **next-generation personal finance platform** — combining **engineering excellence with financial intelligence**.

If you like the project, consider giving it a ⭐
