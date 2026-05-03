# Ethara Backend

Backend API for the Ethara project management application.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (local)
- **ORM**: Prisma 6
- **Authentication**: JWT with bcrypt

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running as a replica set on `mongodb://127.0.0.1:27017`

   **⚠️ IMPORTANT:** Prisma requires MongoDB to run as a replica set!
   
   See `../MONGODB_SETUP.md` for setup instructions, or use MongoDB Atlas (free).

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Push schema to database:
```bash
npx prisma db push
```

## Running the Server

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)
- `POST /api/projects/:id/members` - Add member (admin only)
- `DELETE /api/projects/:id/members/:userId` - Remove member (admin only)

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="mongodb://127.0.0.1:27017/ethara"
JWT_SECRET="supersecret123"
PORT=3000
```

## Database Schema

- **User**: User accounts with authentication
- **Project**: Projects with creator and members
- **ProjectMember**: Project membership with roles (Admin/Member)
- **Task**: Tasks assigned to projects and users

## Status

✅ Backend is configured and running on http://localhost:3000
✅ MongoDB connection established
✅ All routes and controllers implemented
✅ Authentication middleware working
✅ Role-based access control implemented
