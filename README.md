# 🛒 CampusCart — College Marketplace

A peer-to-peer marketplace for college students to buy and sell items within their campus community.

## 📁 Project Structure

```
campuscart/
├── server/     # Node.js + Express + MongoDB backend
└── client/     # React + Vite + Tailwind frontend
```

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Fill in your MONGO_URI, JWT_SECRET, and Cloudinary credentials in .env
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`

---

## ⚙️ Environment Variables (server/.env)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Frontend URL for CORS (default: http://localhost:5173) |

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (protected) |

### Listings
| Method | Route | Description |
|---|---|---|
| GET | `/api/listings` | Get all listings (filter: category, college, price, search) |
| GET | `/api/listings/mine` | Get my listings (protected) |
| GET | `/api/listings/:id` | Get single listing |
| POST | `/api/listings` | Create listing with images (protected) |
| PUT | `/api/listings/:id` | Update listing (protected, owner only) |
| DELETE | `/api/listings/:id` | Delete listing (protected, owner only) |
| POST | `/api/listings/:id/interest` | Express interest, get seller contact (protected) |

### Users
| Method | Route | Description |
|---|---|---|
| PUT | `/api/users/profile` | Update profile (protected) |

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary
- **Auth**: JWT (7-day expiry)

---

## ✨ Features

- 🔐 JWT-based authentication with college details
- 📸 Image upload via Cloudinary (up to 4 per listing)
- 🔍 Search + filter by category, price, college
- 💬 "Express Interest" reveals seller contact
- 📊 Seller dashboard with mark-sold and delete
- 🌙 Dark themed UI with Tailwind CSS
