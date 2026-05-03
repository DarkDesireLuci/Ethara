# Ethara - Project Management Platform

A modern, full-stack project management application with real-time task tracking and team collaboration features.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication
- **Project Management** - Create and manage multiple projects
- **Kanban Board** - Drag-and-drop task management with status columns
- **Team Collaboration** - Add members to projects with role-based access
- **Task Tracking** - Create, assign, and track tasks with priorities and due dates
- **Modern UI** - Beautiful dark theme with glassmorphism effects
- **Responsive Design** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- MongoDB with Prisma ORM
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 19
- Vite 8
- React Router v7
- Custom CSS with design system
- Lucide React icons

## 📦 Project Structure

```
ethara/
├── backend/          # Node.js backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma
├── frontend/         # React frontend
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       └── utils/
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running as a replica set on port 27017) **IMPORTANT!**
- npm or yarn

**⚠️ IMPORTANT: MongoDB Replica Set Required**

Prisma requires MongoDB to run as a replica set. See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed setup instructions.

**Quick setup:**
```bash
# Start MongoDB with replica set
mongod --replSet rs0 --port 27017 --dbpath "C:\data\db"

# In another terminal, initialize replica set
mongosh
rs.initiate()
```

**Or use MongoDB Atlas (easier):** Free cloud MongoDB with replica set already configured.

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (`.env`):
```env
# For local MongoDB with replica set:
DATABASE_URL="mongodb://127.0.0.1:27017/ethara?replicaSet=rs0&directConnection=true"

# Or for MongoDB Atlas (recommended for easier setup):
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ethara"

JWT_SECRET="your-secret-key"
PORT=3000
```

**Note:** See [MONGODB_SETUP.md](MONGODB_SETUP.md) for MongoDB replica set setup instructions.

4. Generate Prisma client and push schema:
```bash
npx prisma generate
npx prisma db push
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on http://localhost:3000

6. **Seed test data (optional but recommended):**
```bash
npm run seed
```

This creates test users and sample data. See [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md) for login details.

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## 🔑 Test Credentials

After seeding the database (`npm run seed` in backend), you can login with:

**Admin User:**
- Email: `test@example.com`
- Password: `test123`

**Demo User:**
- Email: `demo@example.com`
- Password: `demo123`

See [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md) for more details and testing scenarios.

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

## 🎨 Design Features

- **Dark Theme** - Easy on the eyes for long work sessions
- **Glassmorphism** - Modern frosted glass effects
- **Smooth Animations** - Polished transitions and interactions
- **Responsive Layout** - Adapts to all screen sizes
- **Accessible** - Proper contrast and semantic HTML

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for stateless authentication
- Protected API routes with middleware
- Role-based access control for projects
- Input validation and sanitization

## 📝 Database Schema

- **User** - User accounts with authentication
- **Project** - Projects with creator and description
- **ProjectMember** - Many-to-many relationship with roles
- **Task** - Tasks with status, priority, and assignments

## 🚀 Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

None at the moment. Please report any issues you find!

## ✅ Status

- ✅ Backend API running on http://localhost:3000
- ✅ Frontend running on http://localhost:5173
- ✅ MongoDB connected
- ✅ All features implemented and tested
- ✅ Responsive design working
- ✅ Authentication working
- ✅ Drag-and-drop kanban board working
