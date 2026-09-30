# AdForge AI — AI Advertising Creative Studio

AdForge AI is a production-style SaaS application designed to turn product ideas into high-converting, scroll-stopping social media and search advertising creatives in seconds.

---

## ⚡ Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons
- **Backend**: FastAPI (Python 3.12), Uvicorn, Pydantic v2
- **Database**: PostgreSQL with SQLAlchemy ORM (plus automatic SQLite fallback for local dev)
- **Security**: JWT Authentication (HS256) & Direct `bcrypt` password hashing
- **AI Engine**: Google Gemini Flash API with dynamic structured fallback engine

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+ recommended)
- Python 3.10+
- PostgreSQL (Optional: SQLite is automatically used if PostgreSQL credentials are not provided)

---

### 2. Backend Setup (FastAPI)

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a Python virtual environment
python -m venv .venv

# On Windows PowerShell:
..\.venv\Scripts\Activate.ps1

# On macOS/Linux:
source ../.venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure Environment Variables
# Copy .env.example to .env
cp .env.example .env

# 5. Start the FastAPI Uvicorn Server on 0.0.0.0 (listens on all network interfaces)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

> **FastAPI Interactive Swagger API Docs**: `http://localhost:8000/docs`  
> **API Health Check**: `http://localhost:8000/api/health`

---

### 3. Frontend Setup (React + Vite)

```bash
# 1. In the project root folder
npm install

# 2. Configure Environment Variables
# Copy .env.example to .env
cp .env.example .env

# 3. Start the Vite Dev Server (binds to 0.0.0.0)
npm run dev
```

> **Frontend Web App**: `http://localhost:3000`

---

## 📱 Cross-Device & Local Network Access (Wi-Fi)

To test the application from your smartphone, tablet, or another laptop on the same local network:

1. **Find your local LAN IP address**:
   - **Windows**: Run `ipconfig` in CMD/PowerShell (look for *IPv4 Address*, e.g., `192.168.1.50`).
   - **macOS/Linux**: Run `ifconfig` or `ip a` (e.g., `192.168.1.50`).

2. **Open on any device connected to your Wi-Fi**:
   - Web App: `http://<YOUR_LAN_IP>:3000` (e.g., `http://192.168.1.50:3000`)
   - Backend API: `http://<YOUR_LAN_IP>:8000`

> **Note**: The frontend dynamically detects LAN IP hostname access and automatically directs API calls to `http://<YOUR_LAN_IP>:8000`.

---

## 🌐 Environment Variables Configuration

### Frontend (`.env`)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the FastAPI backend | `http://localhost:8000` |

### Backend (`backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `PORT` | FastAPI server port | `8000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/adforge_db` |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated or `*`) | `*` |
| `JWT_SECRET` | Secret key for signing JWT auth tokens | `adforge_secret_key_2026` |
| `JWT_ALGORITHM` | JWT signing algorithm | `HS256` |
| `GEMINI_API_KEY` | Google Gemini API key (Optional) | `""` |
| `USE_FALLBACK_ONLY` | Force dynamic local AI generator | `false` |

---

## ☁️ Public Production Deployment Guide

### 1. Database Deployment (Hosted PostgreSQL)
Deploy a managed PostgreSQL database on **Neon**, **Supabase**, **Render Postgres**, or **Railway**:
1. Copy the database connection URL (e.g., `postgresql://user:pass@ep-cool-db.neon.tech/adforge_db?sslmode=require`).
2. Set this as `DATABASE_URL` in your backend environment variables.

---

### 2. Backend Deployment (Render / Railway / Fly.io / AWS)
Deploy `backend/` to a FastAPI-compatible platform (e.g., **Render** or **Railway**):
1. Root Directory: `backend`
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `DATABASE_URL` = `<YOUR_HOSTED_POSTGRES_URL>`
   - `CORS_ORIGINS` = `https://your-frontend.vercel.app`
   - `JWT_SECRET` = `<STRONG_RANDOM_SECRET>`
   - `GEMINI_API_KEY` = `<YOUR_GEMINI_KEY>`

---

### 3. Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
Deploy the root React application to **Vercel** or **Netlify**:
1. Build Command: `npm run build`
2. Output Directory: `dist`
3. Environment Variable:
   - `VITE_API_URL` = `https://your-backend-api.onrender.com`

---

## 🧪 Testing Across Devices

AdForge AI is tested and responsive across all standard viewports:
- **Mobile Phones**: `320px` - `480px` (Slide-out drawer navigation, stacked preview layout)
- **Tablets**: `481px` - `1024px` (2-column grids, collapsible drawer)
- **Desktops**: `1025px` - `1920px+` (Fixed sidebar navigation, 2-column live studio editor)

---

## 📄 License

MIT © 2026 AdForge AI.
