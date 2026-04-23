# 🏨 Hotel Management System (Boshono Hotel Management System)

A robust **backend RESTful API** for managing hotel operations including rooms, bookings, guests, payments, and staff.

Built with **Node.js**, **Express.js**, and **PostgreSQL**, this system uses **Better Auth** for authentication and **Stripe** for secure payment processing.

---

## 🔗 Project Links

| Resource | URL |
|----------|-----|
| 🌐 Frontend Repository | https://github.com/mdopi2024/B6A5-CLIENT-SIDE|
| 🖥️ Backend Repository | https://github.com/mdopi2024/B6A5-backend-server |
| 🚀 Live Demo | https://boshonto-totel-management-frontend.vercel.app |


---

## ⚙️ Tech Stack

| Technology | Description |
|------------|------------|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| Better Auth | Authentication & session management |
| Stripe | Payment processing |
| bcrypt | Password hashing |
| dotenv | Environment configuration |

---

## ✨ Key Features

### 🔐 User Authentication & Authorization (Better Auth)
- Secure registration & login
- Session-based authentication
- Role-based access (Admin, Staff, Guest)

---

### 🛏️ Room Management
- Add, update, delete rooms
- Track availability status

---

### 📅 Booking Management
- Book rooms with date selection
- Prevents double booking
- Admin control over bookings

---

### 👤 Guest Management
- Store guest info (name, phone, NID/passport)
- Track stay history

---

### 💳 Payment & Invoice System (Stripe)
- Secure payments via **Stripe**
- Create payment intents
- Track payment status (pending / paid / failed)
- Generate invoices for bookings

---

### 👨‍💼 Staff / Manager Management
- Manage managers/staff roles & responsibilities

---

### 📊 Dashboard & Reports
- Booking stats, revenue, room availability

---

## 📡 REST API Endpoints

> Base URL example: `http://localhost:5000/api`

---

### 🔐 Auth APIs

| Method | Endpoint | Description | Auth |
|--------|----------|------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout | ✅ |
| GET | `/api/auth/me` | Current user | ✅ |

---

### 🛏️ Room APIs

| Method | Endpoint | Description | Auth |
|--------|----------|------------|------|
| GET | `/api/room` | Get all rooms | ❌ |
| GET | `/api/room/:id` | Get room | ❌ |
| POST | `/api/room` | Add room | ✅ (Admin) |
| PUT | `/api/room/:id` | Update room | ✅ (Admin) |
| DELETE | `/api/room/:id` | Delete room | ✅ (Admin) |

---

### 📅 Booking APIs

| Method | Endpoint | Description | Auth |
|--------|----------|------------|------|
| GET | `/api/booking` | All bookings | ✅ (Admin) |
| GET | `/api/booking/:id` | Get booking | ✅ |
| POST | `/api/booking` | Create booking | ✅ |
| PUT | `/api/booking/:id` | Update booking | ✅ |
| DELETE | `/api/booking/:id` | Cancel booking | ✅ |

---

### 👨‍💼 Manager APIs

| Method | Endpoint | Description | Auth |
|--------|----------|------------|------|
| GET | `/api/manager` | Get all managers | ✅ (Admin) |
| POST | `/api/manager` | Add manager | ✅ (Admin) |
| PUT | `/api/manager/:id` | Update manager | ✅ (Admin) |
| DELETE | `/api/manager/:id` | Delete manager | ✅ (Admin) |

---

### ⭐ Review APIs

| Method | Endpoint | Description | Auth |
|--------|----------|------------|------|
| GET | `/api/review` | Get all reviews | ❌ |
| POST | `/api/review` | Add review | ✅ |
| DELETE | `/api/review/:id` | Delete review | ✅ |

---

### 💳 Payment APIs (Stripe)

| Method | Endpoint | Description | Auth | Example Body |
|--------|----------|------------|------|--------------|
| POST | `/api/payment/create-intent` | Create payment intent | ✅ | `{ "bookingId": "uuid", "amount": 20000 }` |
| POST | `/api/payment/confirm` | Confirm payment | ✅ | `{ "paymentIntentId": "pi_xxx" }` |
| GET | `/api/payment/:bookingId` | Get payment | ✅ | - |
| GET | `/api/payment/invoice/:bookingId` | Get invoice | ✅ | - |

---


## 🛠️ Getting Started

## 🛠️ Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### 📥 Installation

```bash
git clone #
cd hotel-management-backend
npm install

## Create .env file:

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/hotel_db

# Better Auth
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:5000

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

## Run Server

# Development
npm run dev

# Production
npm start