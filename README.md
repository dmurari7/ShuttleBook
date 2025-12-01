# ShuttleBook — Full Stack Badminton Court Booking System

A complete full-stack application for booking badminton courts, managing schedules, and pairing with training partners. ShuttleBook demonstrates core real-world concepts such as authentication, CRUD operations, global state management, and relational workflows like partner requests.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Understanding the Architecture](#understanding-the-architecture)
- [Frontend Concepts Explained](#frontend-concepts-explained)
- [Backend Concepts Explained](#backend-concepts-explained)
- [API Documentation](#api-documentation)
- [Key Features](#key-features)

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Tailwind CSS
- Axios
- Zustand (global state management)
- localStorage (JWT persistence)

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- Express middleware (auth protection)

## Project Structure

### Frontend (src/)

```
src/
├── api/
│   ├── axiosInstance.ts
│   ├── auth.ts
│   ├── bookings.ts
│   └── partners.ts
│
├── store/
│   └── authStore.ts
│
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Bookings.tsx
│   ├── CreateBooking.tsx
│   ├── PartnerRequests.tsx
│   └── Users.tsx
│
├── components/
│   ├── Navbar.tsx
│   └── BookingCard.tsx
│
├── App.tsx
└── main.tsx
```

### Backend (backend/)

```
backend/
├── index.js
├── .env
├── models/
│   ├── User.js
│   ├── Booking.js
│   └── PartnerRequest.js
│
├── routes/
│   ├── auth.js
│   ├── bookings.js
│   └── partners.js
│
├── middleware/
│   └── authMiddleware.js
└── package.json
```

### Why this structure?

Keeping frontend and backend fully separate provides:

- Independent deployment (e.g., Vercel + Render)
- Clear code organization
- Easier onboarding for collaborators
- Better testing and versioning

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB locally or Atlas
- Git

### Backend Setup

**1. Install dependencies**

```bash
cd backend
npm install
```

**2. Create .env**

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=8000
```

**3. Start the backend**

```bash
npm start
```

Backend will run at:
➡️ `http://localhost:8000`

### Frontend Setup

**1. Install dependencies**

```bash
cd client
npm install
```

**2. Start frontend**

```bash
npm run dev
```

Frontend runs at:
➡️ `http://localhost:5173`

## Understanding the Architecture

### Authentication Flow (JWT + Zustand)

#### Signup

1. User submits username, email, password
2. Backend hashes password using bcrypt
3. Saves user to MongoDB
4. Returns a signed JWT + user object

#### Login

1. User sends email + password
2. Backend verifies hashed password
3. Returns a JWT + user object
4. Frontend stores JWT in:
   - `localStorage`
   - Zustand `authStore`

#### Protected Requests

Frontend attaches:

```
Authorization: Bearer <token>
```

Backend:

1. Verifies token in `authMiddleware`
2. Injects `req.user` into route controllers

### Why JWT?

| Benefit     | Why it matters                     |
| ----------- | ---------------------------------- |
| Stateless   | No sessions stored on backend      |
| Scalable    | Works across multiple servers      |
| Lightweight | Fast verification                  |
| Simple      | Easy to attach in headers          |

## Frontend Concepts Explained

### Zustand Auth Store

Stores:

- `user` object
- JWT `token`
- `login()`, `logout()`, `setUser()`

Persists user after refresh via `localStorage`.

### axiosInstance

Automatically injects the JWT:

```javascript
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Routing (React Router)

- `/login`
- `/signup`
- `/dashboard` (protected)
- `/bookings`
- `/bookings/create`
- `/partner-requests`
- `/users`

Uses `<Navigate />` for protecting routes.

## Backend Concepts Explained

### Models

#### User

- `username`
- `email`
- `password`
- `role` (optional)

#### Booking

- `userId`
- `courtNumber`
- `location`
- `date`
- `timeSlot`
- `partnerName`

#### PartnerRequest

- `fromUser`
- `toUser`
- `booking`
- `status`: `pending` / `accepted` / `rejected`

### Middleware: authMiddleware

Verifies JWT, attaches decoded user to request object.

### Routes

- **Auth** → `/api/auth`
- **Bookings** → `/api/bookings`
- **Partner Requests** → `/api/partners`

Each route is protected except login/signup.

## API Documentation

### Authentication Routes

#### POST /api/auth/signup

**Request:**

```json
{
  "username": "player1",
  "email": "player@example.com",
  "password": "secret123"
}
```

**Response:**

```json
{
  "token": "JWT_HERE",
  "user": {
    "id": "123",
    "username": "player1",
    "email": "player@example.com"
  }
}
```

#### POST /api/auth/login

**Request:**

```json
{
  "email": "player@example.com",
  "password": "secret123"
}
```

Response same format as signup.

### Booking Routes

#### GET /api/bookings

Get all bookings for logged-in user.

#### POST /api/bookings

Create booking:

```json
{
  "courtNumber": 3,
  "location": "Dalplex",
  "date": "2025-02-01",
  "timeSlot": "7-8 PM",
  "partnerName": "John"
}
```

#### PUT /api/bookings/:id

Update booking.

#### DELETE /api/bookings/:id

Delete booking.

### Partner Request Routes

#### POST /api/partners/request

Send partner request:

```json
{
  "toUserId": "USER_ID",
  "bookingId": "BOOKING_ID"
}
```

#### GET /api/partners/incoming

Get incoming requests.

#### GET /api/partners/outgoing

Get outgoing requests.

#### PUT /api/partners/:id/respond

Accept/reject:

```json
{
  "action": "accepted"
}
```

## Key Features

✅ **Full Authentication System**

- JWT-based login + signup
- Persistent login via Zustand + localStorage

✅ **Bookings System**

- Create / view / update / delete bookings
- View bookings in a dashboard
- BookingCard component with all booking details
- Validation to prevent bookings in the past

✅ **Partner Request System**

- See all users
- Send request to match with a partner
- Accept / reject incoming requests
- Automatic partner assignment upon acceptance

✅ **Clean Architecture**

- Axios wrappers
- Frontend state management
- Backend auth middleware
- Clean separation of concerns