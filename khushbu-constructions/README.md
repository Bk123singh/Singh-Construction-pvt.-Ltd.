# 🏢 Khushbu Constructions Pvt. Ltd. — Full-Stack MERN Website

A production-ready, full-stack MERN website for a construction company with admin panel, JWT auth, Cloudinary image uploads, and full deployment configuration.

---

## 📁 Project Structure

```
khushbu-constructions/
├── backend/                    # Node.js + Express + MongoDB
│   ├── config/
│   │   └── cloudinary.js       # Cloudinary + Multer config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   ├── gallery.controller.js
│   │   └── profile.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT protect + adminOnly
│   │   └── error.middleware.js  # Global error handler
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Project.model.js
│   │   ├── Gallery.model.js
│   │   └── Profile.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── gallery.routes.js
│   │   └── profile.routes.js
│   ├── server.js               # Main entry point
│   ├── render.yaml             # Render deployment config
│   └── .env.example
│
└── frontend/                   # React + Vite + Tailwind
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   └── PublicLayout.jsx   # Navbar + Footer + WhatsApp float
    │   │   └── admin/
    │   │       └── AdminLayout.jsx    # Admin sidebar layout
    │   ├── context/
    │   │   └── AuthContext.jsx        # Auth state + login/logout
    │   ├── pages/
    │   │   ├── Home.jsx               # Hero, stats, services, CTA
    │   │   ├── About.jsx              # Mission, vision, team, values
    │   │   ├── Projects.jsx           # Filterable project grid
    │   │   ├── Gallery.jsx            # Masonry grid + lightbox
    │   │   ├── Contact.jsx            # Form + map + WhatsApp
    │   │   └── admin/
    │   │       ├── AdminLogin.jsx
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminProjects.jsx
    │   │       ├── AdminGallery.jsx
    │   │       └── AdminProfile.jsx
    │   ├── utils/
    │   │   └── api.js                 # Axios + auto token refresh
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vercel.json             # Vercel SPA routing
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

---

## ⚙️ Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/khushbu-constructions
JWT_ACCESS_SECRET=your_min_32_char_secret_here_abc123
JWT_REFRESH_SECRET=another_min_32_char_secret_xyz789
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
ADMIN_SECRET_KEY=your_custom_admin_registration_key
```

### 3. Start the backend
```bash
npm run server   # Development (nodemon)
npm start        # Production
```

Backend runs at: `http://localhost:5000`

### 4. Register first admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@khushbuconstructions.com",
    "password": "SecurePass@123",
    "secretKey": "your_custom_admin_registration_key"
  }'
```
> ⚠️ After creating your admin, consider removing the `/register` route from `auth.routes.js` for production security.

---

## 🎨 Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=919876543210
VITE_COMPANY_PHONE=+919876543210
```

### 3. Start frontend
```bash
npm run dev     # Development
npm run build   # Production build
```

Frontend runs at: `http://localhost:5173`

---

## 🌐 Deployment

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo → select the `backend/` directory
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add all environment variables from `.env.example` in the Render dashboard
7. Deploy!

Your backend URL will be: `https://khushbu-constructions-api.onrender.com`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory**: `frontend`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add environment variables:
   ```
   VITE_API_URL=https://your-render-url.onrender.com/api
   VITE_WHATSAPP_NUMBER=919876543210
   ```
7. Deploy!

---

## 🔌 API Reference

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register admin (needs secret key) |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | Protected | Logout |
| GET | `/api/auth/me` | Protected | Get current user |
| PUT | `/api/auth/change-password` | Protected | Change password |

### Projects
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/projects` | Public | Get all (filter: status, category, featured) |
| GET | `/api/projects/:id` | Public | Get one |
| POST | `/api/projects` | Admin | Create (multipart with images) |
| PUT | `/api/projects/:id` | Admin | Update |
| DELETE | `/api/projects/:id` | Admin | Delete |
| DELETE | `/api/projects/:id/images/:imageId` | Admin | Remove image |

### Gallery
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/gallery` | Public | Get images (filter: category) |
| POST | `/api/gallery` | Admin | Upload image |
| PUT | `/api/gallery/:id` | Admin | Update caption/category |
| DELETE | `/api/gallery/:id` | Admin | Delete |

### Profile
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/profile` | Public | Get company profile |
| PUT | `/api/profile` | Admin | Update company info |
| PUT | `/api/profile/statistics` | Admin | Update stats counters |

---

## 🎯 Features Implemented

### Public Website
- ✅ **Home** — Hero with animated text, stats counters, services grid, featured projects, CTA banner
- ✅ **About** — Company description, mission/vision, values, team
- ✅ **Projects** — Filterable by status (ongoing/completed) and category, search, expandable cards
- ✅ **Gallery** — Masonry grid with lightbox, category filter
- ✅ **Contact** — Form, Google Maps embed, WhatsApp integration, call CTA

### Admin Panel (`/admin`)
- ✅ **Dashboard** — Live stats, quick actions, recent projects table
- ✅ **Projects** — Full CRUD with image upload via Cloudinary
- ✅ **Gallery** — Upload/delete with category tagging
- ✅ **Profile** — Company info, statistics, password change

### Technical
- ✅ JWT access + refresh token auth with auto-refresh interceptor
- ✅ Cloudinary image storage with size limits
- ✅ Rate limiting, Helmet security headers, CORS
- ✅ Framer Motion animations throughout
- ✅ Fully responsive (mobile-first)
- ✅ WhatsApp floating button
- ✅ SEO meta tags
- ✅ Error handling (frontend + backend)

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary (Gold) | `#F5A623` |
| Background | `#0A0A0A` |
| Surface | `#1A1A1A` |
| Border | `#2D2D2D` |
| Display Font | Bebas Neue |
| Heading Font | Barlow Condensed |
| Body Font | DM Sans |

---

## 🔒 Security Notes

1. **Change the `ADMIN_SECRET_KEY`** to a strong random string
2. **Disable the `/register` endpoint** after creating your admin account
3. **Use strong JWT secrets** (min 32 characters, random)
4. **Set `NODE_ENV=production`** on Render
5. **Use HTTPS** — both Vercel and Render provide this automatically

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Routing | React Router v6 |
| HTTP | Axios with interceptors |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (access + refresh tokens) |
| Images | Cloudinary + Multer |
| Deployment | Vercel (frontend) + Render (backend) |

---

*Built for Khushbu Constructions Pvt. Ltd. — © 2024*
