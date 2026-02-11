# UIET Connect - Setup Instructions

Complete guide to setting up the UIET Connect platform locally.

## Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/))
- **Git** ([Download](https://git-scm.com/))

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd uiet-connect
```

## Step 2: Database Setup

### Install PostgreSQL

If not already installed, install PostgreSQL:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
Download and install from [PostgreSQL website](https://www.postgresql.org/download/windows/)

### Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE uiet_connect;
CREATE USER uiet_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE uiet_connect TO uiet_user;

# Enable pgvector extension (for AI embeddings)
\c uiet_connect
CREATE EXTENSION IF NOT EXISTS vector;

# Exit psql
\q
```

## Step 3: Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
DATABASE_URL="postgresql://uiet_user:your_password@localhost:5432/uiet_connect"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

# Storage (Supabase recommended for free tier)
STORAGE_PROVIDER="supabase"
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-key"
SUPABASE_BUCKET="uiet-connect"

AI_SERVICE_URL="http://localhost:8000"
```

### Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
npm run seed
```

### Start Backend Server

```bash
npm run dev
```

Backend should now be running on `http://localhost:5000`

## Step 4: Frontend Setup

### Install Dependencies

```bash
cd ../frontend
npm install
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

### Start Frontend Development Server

```bash
npm run dev
```

Frontend should now be running on `http://localhost:5173`

## Step 5: AI Service Setup

### Install Python Dependencies

```bash
cd ../ai-service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
MODEL_NAME="resnet50"
EMBEDDING_DIM=2048
SIMILARITY_THRESHOLD=0.75
TOP_K_MATCHES=5
PORT=8000
```

### Start AI Service

```bash
# With virtual environment activated
uvicorn main:app --reload --port 8000
```

AI service should now be running on `http://localhost:8000`

## Step 6: Verify Installation

### Check All Services

1. **Backend**: Visit `http://localhost:5000/health`
   - Should return: `{"status": "healthy"}`

2. **Frontend**: Visit `http://localhost:5173`
   - Should show login page

3. **AI Service**: Visit `http://localhost:8000/health`
   - Should return: `{"status": "healthy", "model_loaded": true}`

### Create Admin Account

Currently, admin accounts need to be created manually in the database:

```bash
# Access database
psql -U uiet_user -d uiet_connect

# Update a user to admin role
UPDATE users 
SET role = 'ADMIN', is_approved = true 
WHERE email = 'your-email@puchd.ac.in';
```

## Step 7: Storage Setup (Supabase)

### Create Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Create new project
3. Go to Storage settings
4. Create a new bucket named `uiet-connect`
5. Make it public for read access
6. Copy your project URL and anon key to `.env`

### Alternative: AWS S3

If using AWS S3 instead:

```env
STORAGE_PROVIDER="aws"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="uiet-connect"
```

## Development Workflow

### Running All Services

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Terminal 3 - AI Service:
```bash
cd ai-service
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload
```

### Database Management

View database in GUI:
```bash
cd backend
npx prisma studio
```

Reset database:
```bash
npx prisma migrate reset
```

## Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use:

**Backend**: Change `PORT` in `.env`
**Frontend**: Change port in `vite.config.ts`

### Database Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   # or
   brew services list
   ```

2. Check connection string in `.env`

3. Ensure database and user exist

### AI Service Model Loading Issues

1. First run may be slow as models download
2. Ensure adequate disk space (~500MB for models)
3. Check Python version (3.9+)
4. For GPU support, install CUDA-enabled PyTorch

### CORS Issues

If experiencing CORS errors:
1. Verify `FRONTEND_URL` in backend `.env`
2. Check frontend `VITE_API_URL` matches backend port
3. Clear browser cache

## Production Deployment

See `DEPLOYMENT.md` for production deployment instructions (Docker, cloud hosting, etc.)

## Next Steps

1. Create admin account
2. Login and test classroom management
3. Explore different user roles
4. Begin Phase 2 development (Lost & Found)

## Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Contact the development team

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [React Router Documentation](https://reactrouter.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
