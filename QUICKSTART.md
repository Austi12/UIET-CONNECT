# 🚀 UIET Connect - Quick Start Guide

Get the platform running in **under 10 minutes**!

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check Python (need 3.9+)
python --version

# Check PostgreSQL
psql --version

# Check Git
git --version
```

## 5-Step Setup

### 1️⃣ Clone & Navigate
```bash
git clone <your-repo-url>
cd uiet-connect
```

### 2️⃣ Database
```bash
# Start PostgreSQL (if not running)
# Ubuntu: sudo systemctl start postgresql
# macOS: brew services start postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE uiet_connect;
CREATE USER uiet_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE uiet_connect TO uiet_user;
\q
```

### 3️⃣ Backend
```bash
cd backend

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your database URL

# Setup database
npx prisma generate
npx prisma migrate dev

# Start
npm run dev
```

### 4️⃣ Frontend (New Terminal)
```bash
cd frontend

# Install
npm install

# Configure
cp .env.example .env

# Start
npm run dev
```

### 5️⃣ AI Service (New Terminal)
```bash
cd ai-service

# Virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install
pip install -r requirements.txt

# Start
uvicorn main:app --reload
```

## 🎯 Access the Platform

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **AI Service**: http://localhost:8000

## 👤 Create Admin User

```bash
# Connect to database
psql -U uiet_user -d uiet_connect

# Make yourself admin
UPDATE users SET role = 'ADMIN', is_approved = true 
WHERE email = 'your-email@puchd.ac.in';
```

## ✅ Test Everything

1. **Sign up** at http://localhost:5173/signup
2. Make your account **admin** (see above)
3. **Login** and explore the dashboard
4. Try **classroom management**
5. Check all services are running

## 🐳 Docker Alternative

If you prefer Docker:

```bash
# Start everything
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📚 Next Steps

- Read `docs/SETUP.md` for detailed setup
- Check `docs/DEVELOPMENT.md` for development guide
- See `docs/API.md` for API documentation
- Start building Phase 2 features!

## 🆘 Troubleshooting

**Port in use?**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:8000 | xargs kill -9  # AI Service
```

**Database connection failed?**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

**AI service slow?**
- First run downloads models (~500MB)
- Be patient, it's worth it!

## 🎉 Success!

You should now have:
- ✅ Backend API running
- ✅ Frontend application running
- ✅ AI service ready
- ✅ Database configured
- ✅ Admin account created

Start building amazing features! 🚀
