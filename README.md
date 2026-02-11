# UIET Connect - Smart Campus Infrastructure Platform

A full-stack web platform for University Institute of Engineering and Technology (UIET), Panjab University that centralizes campus operations.

## 🎯 Features

- **Authentication & RBAC** - Multi-role system (Student, Teacher, Admin)
- **Classroom Tracker** - Real-time classroom availability
- **AI Lost & Found** - Image matching using embeddings
- **Project Showcase** - Student project portfolio
- **Events System** - Club events and registrations
- **AI Chatbot** - Campus assistant for queries

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- React Router v6
- Axios
- Zustand (State Management)

### Backend
- Node.js + Express
- JWT Authentication
- Prisma ORM
- PostgreSQL
- Role-based Access Control

### AI Services
- Python FastAPI (Lost & Found matching)
- OpenCV / face_recognition
- OpenAI/Gemini API (Chatbot)

### Storage
- Supabase Storage / AWS S3

## 📁 Project Structure

```
uiet-connect/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── layouts/         # Layout components
│   │   ├── store/           # Zustand store
│   │   └── utils/           # Utility functions
│   ├── public/
│   └── package.json
│
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── types/           # TypeScript types
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── ai-service/               # Python FastAPI microservice
│   ├── main.py              # FastAPI app
│   ├── model.py             # ML model
│   ├── embeddings.py        # Image processing
│   ├── requirements.txt
│   └── .env
│
└── docs/
    ├── API.md               # API documentation
    └── SETUP.md             # Setup instructions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- npm or yarn

### 1. Clone and Install

```bash
# Clone repository
git clone <repo-url>
cd uiet-connect

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install AI service dependencies
cd ../ai-service
pip install -r requirements.txt
```

### 2. Environment Setup

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/uiet_connect"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
PORT=5000

# Storage
STORAGE_PROVIDER="supabase" # or "aws"
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-key"

# AI Service
AI_SERVICE_URL="http://localhost:8000"
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

**AI Service (.env)**
```env
MODEL_PATH="./models"
EMBEDDING_DIM=512
SIMILARITY_THRESHOLD=0.75
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### 4. Run Services

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```

**Terminal 3 - AI Service**
```bash
cd ai-service
uvicorn main:app --reload --port 8000
```

## 🎨 Design System

### Colors
- **Primary**: #1E3A8A (Deep Academic Blue)
- **Secondary**: #F8FAFC (Light Background)
- **Accent**: #0EA5E9 (Modern Blue Accent)
- **Success**: #16A34A (Green)
- **Error**: #DC2626 (Red)
- **Warning**: #F59E0B (Yellow)

### Typography
- Font Family: Inter, system-ui
- Headings: Bold, 600-700 weight
- Body: Regular, 400 weight

## 📚 API Documentation

See [API.md](./docs/API.md) for complete API documentation.

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## 🔐 User Roles

1. **Student**
   - View classrooms
   - Upload/search lost items
   - Submit projects
   - Register for events
   - Use chatbot

2. **Teacher**
   - All student permissions
   - Approve projects
   - Create events

3. **Admin**
   - All permissions
   - Approve users
   - Manage classrooms
   - System configuration

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# AI Service tests
cd ai-service
pytest
```

## 📦 Deployment

### Production Build

**Frontend**
```bash
cd frontend
npm run build
```

**Backend**
```bash
cd backend
npm run build
```

### Docker Deployment
```bash
docker-compose up -d
```

## 🛡️ Security Features

- Bcrypt password hashing
- JWT with expiration
- Role-based access control
- Input validation
- SQL injection prevention (Prisma ORM)
- File upload restrictions
- Rate limiting

## 📈 Development Phases

- ✅ **Phase 1**: Auth + Classroom Module
- ⏳ **Phase 2**: Lost & Found with AI
- ⏳ **Phase 3**: Projects + Events
- ⏳ **Phase 4**: Chatbot Integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Developed for UIET, Panjab University

## 📞 Support

For issues and questions, please create an issue on GitHub.
