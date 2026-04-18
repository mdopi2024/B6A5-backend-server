# 🏨 Hotel Management System (Boshono Hotel Management System)

A robust **backend RESTful API** for managing hotel operations including rooms, bookings, guests, payments, and staff.

Built with **Node.js**, **Express.js**, and **PostgreSQL**, this system uses **Better Auth** for authentication and **Stripe** for secure payment processing.

---

## 🔗 Project Links

| Resource | URL |
|----------|-----|
| 🌐 Frontend Repository | # |
| 🖥️ Backend Repository | # |
| 🚀 Live Demo | # |
| 📡 API Base URL | # |

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

### 👨‍💼 Staff Management
- Manage staff roles & departments

---

### 📊 Dashboard & Reports
- Booking stats, revenue, room availability

---

## 📡 REST API Endpoints

### 🔐 Auth APIs

| Method | Endpoint | Description | Auth Required | Example Body |
|--------|----------|------------|---------------|--------------|
| POST | `/api/v1/auth/register` | Register user | ❌ | `{ "name": "John Doe", "email": "john@example.com", "password": "123456", "role": "guest" }` |
| POST | `/api/v1/auth/login` | Login user | ❌ | `{ "email": "john@example.com", "password": "123456" }` |
| POST | `/api/v1/auth/logout` | Logout | ✅ | `{}` |
| GET | `/api/v1/auth/me` | Current user | ✅ | - |

---

### 🛏️ Room APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|------------|---------------|
| GET | `/api/v1/rooms` | Get all rooms | ❌ |
| GET | `/api/v1/rooms/:id` | Get room | ❌ |
| POST | `/api/v1/rooms` | Add room | ✅ (Admin) |
| PUT | `/api/v1/rooms/:id` | Update room | ✅ (Admin) |
| DELETE | `/api/v1/rooms/:id` | Delete room | ✅ (Admin) |

---

### 📅 Booking APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|------------|---------------|
| GET | `/api/v1/bookings` | All bookings | ✅ (Admin) |
| POST | `/api/v1/bookings` | Create booking | ✅ |
| PUT | `/api/v1/bookings/:id` | Update booking | ✅ |
| DELETE | `/api/v1/bookings/:id` | Cancel booking | ✅ |

---

### 💳 Payment APIs (Stripe)

| Method | Endpoint | Description | Auth Required | Example Body |
|--------|----------|------------|---------------|--------------|
| POST | `/api/v1/payments/create-intent` | Create Stripe payment intent | ✅ | `{ "bookingId": "uuid", "amount": 20000 }` |
| POST | `/api/v1/payments/confirm` | Confirm payment | ✅ | `{ "paymentIntentId": "pi_xxx" }` |
| GET | `/api/v1/payments/:bookingId` | Get payment | ✅ | - |
| GET | `/api/v1/payments/invoice/:bookingId` | Get invoice | ✅ | - |


---

## 🛠️ Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Installation

```bash
git clone #
cd hotel-management-backend
npm install


### Create .env file:

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/hotel_db

# Better Auth
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:5000

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

### Run Server

# Development
npm run dev

# Production
npm start