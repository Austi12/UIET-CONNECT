# UIET Connect API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST `/auth/signup`
Register a new student account.

**Request Body:**
```json
{
  "email": "student@puchd.ac.in",
  "password": "password123",
  "name": "John Doe",
  "department": "CSE",
  "year": 2,
  "rollNumber": "20CS001",
  "phoneNumber": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Awaiting admin approval.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@puchd.ac.in",
      "name": "John Doe",
      "role": "STUDENT",
      "isApproved": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

#### POST `/auth/login`
Login to get JWT token.

**Request Body:**
```json
{
  "email": "student@puchd.ac.in",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "student@puchd.ac.in",
      "name": "John Doe",
      "role": "STUDENT",
      "department": "CSE",
      "year": 2,
      "isApproved": true,
      "isActive": true
    }
  }
}
```

#### POST `/auth/logout`
Logout and invalidate token.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET `/auth/profile`
Get current user profile.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@puchd.ac.in",
      "name": "John Doe",
      "role": "STUDENT",
      "department": "CSE",
      "year": 2,
      "rollNumber": "20CS001",
      "phoneNumber": "9876543210",
      "profileImage": null
    }
  }
}
```

#### PUT `/auth/profile`
Update user profile.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "John Updated",
  "department": "IT",
  "year": 3,
  "phoneNumber": "9876543211"
}
```

---

### Classrooms

#### GET `/classrooms`
Get all classrooms with optional filters.

**Headers:** Requires authentication

**Query Parameters:**
- `building` (optional): Filter by building name
- `floor` (optional): Filter by floor number
- `status` (optional): Filter by status (FREE, OCCUPIED, RESERVED)

**Response:**
```json
{
  "success": true,
  "data": {
    "classrooms": [
      {
        "id": "uuid",
        "name": "Room 301",
        "building": "Block A",
        "floor": 3,
        "capacity": 60,
        "status": "FREE",
        "features": ["projector", "ac", "whiteboard"],
        "description": "Large lecture hall",
        "imageUrl": null,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 1
  }
}
```

#### GET `/classrooms/stats`
Get classroom statistics.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "free": 30,
    "occupied": 15,
    "reserved": 5,
    "percentage": {
      "free": 60,
      "occupied": 30,
      "reserved": 10
    }
  }
}
```

#### GET `/classrooms/:id`
Get classroom details by ID.

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "classroom": {
      "id": "uuid",
      "name": "Room 301",
      "building": "Block A",
      "floor": 3,
      "capacity": 60,
      "status": "FREE",
      "features": ["projector", "ac"],
      "logs": [
        {
          "id": "uuid",
          "previousStatus": "OCCUPIED",
          "newStatus": "FREE",
          "reason": "Class ended",
          "createdAt": "2024-01-15T10:00:00Z",
          "user": {
            "name": "Teacher Name",
            "role": "TEACHER"
          }
        }
      ]
    }
  }
}
```

#### POST `/classrooms`
Create new classroom (Admin only).

**Headers:** Requires authentication (ADMIN)

**Request Body:**
```json
{
  "name": "Room 401",
  "building": "Block B",
  "floor": 4,
  "capacity": 80,
  "features": ["projector", "ac", "whiteboard"],
  "description": "Seminar hall"
}
```

#### PATCH `/classrooms/:id/status`
Update classroom status (Admin/Teacher only).

**Headers:** Requires authentication (ADMIN or TEACHER)

**Request Body:**
```json
{
  "status": "OCCUPIED",
  "reason": "Class in progress"
}
```

#### PUT `/classrooms/:id`
Update classroom details (Admin only).

**Headers:** Requires authentication (ADMIN)

**Request Body:**
```json
{
  "name": "Room 401 Updated",
  "capacity": 85,
  "features": ["projector", "ac", "whiteboard", "smartboard"]
}
```

#### DELETE `/classrooms/:id`
Delete classroom (Admin only).

**Headers:** Requires authentication (ADMIN)

---

### Lost & Found

*To be implemented in Phase 2*

#### POST `/lost-found/lost`
Report a lost item.

#### POST `/lost-found/found`
Report a found item.

#### GET `/lost-found/matches/:itemId`
Get AI-powered matches for an item.

---

### Projects

*To be implemented in Phase 3*

#### GET `/projects`
Get all approved projects.

#### POST `/projects`
Submit a new project.

#### PUT `/projects/:id`
Update project details.

---

### Events

*To be implemented in Phase 3*

#### GET `/events`
Get all published events.

#### POST `/events`
Create new event (Admin/Teacher).

#### POST `/events/:id/register`
Register for an event.

---

### Chat

*To be implemented in Phase 4*

#### POST `/chat`
Send message to AI chatbot.

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address.

---

## Pagination

For endpoints that return lists, pagination parameters can be used:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response will include pagination metadata:

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
