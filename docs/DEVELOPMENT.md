# UIET Connect - Development Guide

## Project Overview

UIET Connect is a full-stack smart campus infrastructure platform built with modern web technologies. This guide covers the architecture, development workflow, and best practices.

## Architecture

### Tech Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                       Frontend                          │
│  React + TypeScript + Tailwind + Zustand               │
│                  Port: 5173                             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ HTTP/REST
                  │
┌─────────────────▼───────────────────────────────────────┐
│                       Backend                           │
│     Node.js + Express + Prisma + JWT                    │
│                  Port: 5000                             │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌──────────────────┐
│  PostgreSQL   │   │   AI Service     │
│   Database    │   │ Python FastAPI   │
│  Port: 5432   │   │   Port: 8000     │
└───────────────┘   └──────────────────┘
```

## Development Phases

### Phase 1: Authentication & Classrooms ✅ IMPLEMENTED

**Completed Features:**
- JWT-based authentication system
- Role-based access control (Student, Teacher, Admin)
- Admin approval workflow for new users
- Classroom availability tracker
- Real-time classroom status updates
- Comprehensive filtering system

**Key Files:**
- Backend: `src/controllers/auth.controller.ts`, `src/controllers/classroom.controller.ts`
- Frontend: `src/pages/Login.tsx`, `src/pages/Classrooms.tsx`
- Database: `prisma/schema.prisma`

### Phase 2: AI-Powered Lost & Found 🔄 NEXT

**To Implement:**
1. Image upload functionality
2. Integration with AI service
3. Embedding generation for images
4. Similarity matching algorithm
5. Match results display

**Implementation Steps:**

1. **Backend Lost & Found Controller:**
```typescript
// src/controllers/lostfound.controller.ts
export const reportLostItem = async (req, res) => {
  // 1. Upload image to storage
  // 2. Call AI service to generate embedding
  // 3. Store item with embedding in database
  // 4. Return success response
}

export const findMatches = async (req, res) => {
  // 1. Get item embedding
  // 2. Query similar embeddings from database
  // 3. Return top matches with similarity scores
}
```

2. **Frontend Upload Component:**
```typescript
// src/components/ImageUpload.tsx
// Implement drag-and-drop image upload
// Preview image before submission
// Call backend API with FormData
```

3. **AI Service Integration:**
- Ensure model is loaded on startup
- Test embedding generation endpoint
- Optimize similarity threshold

### Phase 3: Projects & Events 📅 PLANNED

**Projects Module:**
- Student project submission
- Admin approval workflow
- Public showcase page
- Search and filter by tech stack
- GitHub integration

**Events Module:**
- Event creation (Admin/Teacher)
- Student registration
- Calendar view
- Email notifications
- Capacity management

### Phase 4: AI Chatbot 🤖 PLANNED

**Features:**
- Context-aware responses
- Campus-specific knowledge base
- Query classrooms, events, etc.
- Floating chat widget
- Message history

## Code Organization

### Backend Structure

```
backend/src/
├── controllers/     # Request handlers
├── routes/          # API route definitions
├── middleware/      # Auth, validation, error handling
├── services/        # Business logic
├── utils/           # Helper functions
└── types/           # TypeScript types
```

### Frontend Structure

```
frontend/src/
├── components/      # Reusable UI components
├── pages/           # Page components
├── layouts/         # Layout wrappers
├── store/           # Zustand state management
├── services/        # API service functions
├── hooks/           # Custom React hooks
└── utils/           # Helper functions
```

## Best Practices

### Backend Development

1. **Always use TypeScript types:**
```typescript
interface CreateClassroomDto {
  name: string;
  building: string;
  floor: number;
  capacity: number;
}
```

2. **Error Handling:**
```typescript
try {
  // operation
} catch (error) {
  console.error('Operation failed:', error);
  res.status(500).json({
    success: false,
    message: 'Operation failed'
  });
}
```

3. **Use Prisma for all database operations** - prevents SQL injection

4. **Validate input with Joi schemas** before processing

5. **Use middleware for authentication** on protected routes

### Frontend Development

1. **Use custom hooks for API calls:**
```typescript
const useClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return { classrooms, loading };
};
```

2. **Centralize API calls in services:**
```typescript
// services/classroomService.ts
export const classroomService = {
  getAll: () => apiClient.get('/classrooms'),
  getById: (id) => apiClient.get(`/classrooms/${id}`),
  update: (id, data) => apiClient.put(`/classrooms/${id}`, data)
};
```

3. **Use Zustand for global state** (auth, user preferences)

4. **Component composition:**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## Database Management

### Common Prisma Commands

```bash
# Generate client after schema changes
npx prisma generate

# Create migration
npx prisma migrate dev --name description

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database
npm run seed
```

### Adding New Tables

1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Update TypeScript types if needed
4. Create controllers and routes

## Testing

### Backend Testing (to be implemented)

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### Frontend Testing (to be implemented)

```bash
# Run tests
npm test

# Run in watch mode
npm test -- --watch
```

## Deployment

### Production Checklist

- [ ] Update all `.env` files with production values
- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS properly
- [ ] Set up SSL certificates
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Test all API endpoints
- [ ] Build and test Docker containers

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## Security Considerations

1. **Never commit `.env` files** - use `.env.example` templates
2. **Hash passwords** with bcrypt (10 rounds minimum)
3. **Validate all user input** on both frontend and backend
4. **Use parameterized queries** (Prisma handles this)
5. **Implement rate limiting** on API endpoints
6. **Set secure JWT expiration** times
7. **Use HTTPS** in production
8. **Sanitize file uploads** - check file types and sizes
9. **Implement CSRF protection** for state-changing operations
10. **Regular security audits** of dependencies

## Performance Optimization

### Backend

1. **Database indexing:**
```prisma
@@index([building, floor])
@@index([status])
```

2. **Pagination for large datasets**
3. **Caching frequently accessed data**
4. **Connection pooling** (Prisma handles this)
5. **Compression middleware** for responses

### Frontend

1. **Code splitting** with React.lazy()
2. **Image optimization** - compress before upload
3. **Debouncing search inputs**
4. **Virtual scrolling** for large lists
5. **Memoization** with React.memo, useMemo, useCallback

## Monitoring and Logging

### Backend Logs

```typescript
// Use structured logging
console.log({
  level: 'info',
  message: 'User logged in',
  userId: user.id,
  timestamp: new Date()
});
```

### Error Tracking

Consider integrating:
- Sentry for error tracking
- Winston for structured logging
- PM2 for process management

## Common Issues and Solutions

### Issue: "Port already in use"
**Solution:** Change port in configuration or kill process using port

### Issue: Database connection failed
**Solution:** 
1. Check PostgreSQL is running
2. Verify DATABASE_URL
3. Check firewall settings

### Issue: CORS errors
**Solution:**
1. Update FRONTEND_URL in backend .env
2. Check CORS middleware configuration
3. Verify API URL in frontend

### Issue: JWT token expired
**Solution:** Implement token refresh logic or increase JWT_EXPIRES_IN

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Support

For questions or issues:
- Check existing documentation
- Search GitHub issues
- Create new issue with details
- Contact development team

---

**Last Updated:** February 2024  
**Current Version:** 1.0.0  
**Current Phase:** Phase 1 Complete, Phase 2 In Progress
