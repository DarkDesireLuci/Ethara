# Ethara Frontend

Modern project management application built with React and Vite.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Routing**: React Router v7
- **Styling**: Custom CSS with design system
- **Icons**: Lucide React
- **State Management**: React Context API

## Features

- 🔐 **Authentication** - Secure login and registration
- 📊 **Dashboard** - Overview of projects and tasks
- 📁 **Project Management** - Create and manage projects
- ✅ **Kanban Board** - Drag-and-drop task management
- 👥 **Team Collaboration** - Project members and roles
- 🎨 **Modern UI** - Dark theme with glassmorphism effects
- 📱 **Responsive** - Works on all devices

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.jsx   # Main layout with sidebar
│   ├── Modal.jsx    # Modal component
│   ├── TaskCard.jsx # Task card component
│   └── ...
├── contexts/        # React contexts
│   └── AuthContext.jsx
├── pages/           # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProjectsPage.jsx
│   └── ProjectPage.jsx
├── utils/           # Utilities
│   └── api.js       # API client
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api`. Make sure the backend is running before using the application.

## Design System

The app uses a custom design system with:
- Dark theme optimized for long work sessions
- Glassmorphism effects for modern aesthetics
- Smooth animations and transitions
- Consistent spacing and typography
- Accessible color contrast

## Status

✅ Frontend is running on http://localhost:5173
✅ Connected to backend API
✅ All features implemented and working
✅ Responsive design
✅ Error handling and loading states
