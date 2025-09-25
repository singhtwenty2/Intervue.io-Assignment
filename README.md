# 🗳️ Live Polling System

> **Real-time polling application built for Intervue.io SDE Intern Assignment**

A comprehensive live polling system that enables teachers to create interactive polls and students to participate in real-time. Built with modern web technologies and designed for seamless classroom engagement.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://intervue-io-assignment-jet.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend-API-green?style=for-the-badge&logo=node.js)](https://intervueio-assignment-production.up.railway.app)

## 🚀 Features

### 👨‍🏫 Teacher Features

- **Create Polls**: Set up new polling sessions with custom titles
- **Question Management**: Add multiple-choice questions dynamically
- **Real-time Results**: View live polling results as students submit answers
- **Student Management**: See connected students and remove participants if needed
- **Smart Controls**: Only ask new questions when all students have answered or no active question exists
- **Poll History**: Access previous polling sessions and results

### 🎓 Student Features

- **Easy Join**: Enter poll using unique poll ID with custom name
- **Real-time Participation**: Answer questions as they're asked
- **Timer-based**: 60-second countdown for each question
- **Live Results**: View polling results after submitting answers
- **Session Management**: Unique identity per browser tab

### 🔄 Real-time Capabilities

- **Live Updates**: Instant synchronization across all participants
- **Socket.io Integration**: Real-time question broadcasting and result updates
- **Timer Synchronization**: Countdown timers synced across all users
- **Connection Management**: Handle disconnections and reconnections gracefully

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Socket.io-client** for real-time communication
- **Tailwind CSS** for styling
- **Vite** as build tool
- **React Router** for navigation
- **Lucide React** for icons

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **Socket.io** for WebSocket communication
- **MongoDB Atlas** with Mongoose
- **Express Rate Limiting** for API protection
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Development Tools

- **pnpm** as package manager
- **ESLint** for code linting
- **Prettier** for code formatting
- **Nodemon** for development server

### Deployment

- **Frontend**: Vercel
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas

## 🏗️ Project Structure

```
live-polling-system/
├── backend/                 # Express.js backend server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # API route handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── socket/         # Socket.io management
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Helper functions
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── common/     # Reusable components
│   │   │   ├── student/    # Student-specific components
│   │   │   └── teacher/    # Teacher-specific components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Main page components
│   │   ├── store/          # Redux store configuration
│   │   │   ├── api/        # RTK Query API slices
│   │   │   └── slices/     # Redux slices
│   │   └── types/          # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/singhtwenty2/Intervue.io-Assignment.git
    cd Intervue.io-Assignment
    ```

2. **Install dependencies**

    ```bash
    # Install backend dependencies
    cd backend
    pnpm install

    # Install frontend dependencies
    cd ../frontend
    pnpm install
    ```

3. **Environment Setup**

    **Backend** (`backend/.env`):

    ```env
    PORT=3001
    MONGODB_URI=your_mongodb_connection_string
    NODE_ENV=development
    CORS_ORIGIN=http://localhost:5173
    ```

    **Frontend** (`frontend/.env`):

    ```env
    VITE_BACKEND_URL=http://localhost:3001
    VITE_SOCKET_URL=http://localhost:3001
    ```

4. **Start Development Servers**

    **Terminal 1 - Backend**:

    ```bash
    cd backend
    pnpm dev
    ```

    **Terminal 2 - Frontend**:

    ```bash
    cd frontend
    pnpm dev
    ```

5. **Access the Application**
    - Frontend: http://localhost:5173
    - Backend API: http://localhost:3001

## 📱 Usage Guide

### For Teachers

1. **Create a Poll**
    - Visit the homepage and select "I'm a Teacher"
    - Enter a poll title and create your polling session
    - Copy the generated Poll ID to share with students

2. **Manage Questions**
    - Add questions with multiple choice options
    - Start questions when ready
    - View real-time results as students respond

3. **Monitor Students**
    - See connected students in real-time
    - Remove disruptive participants if needed
    - Track participation rates

### For Students

1. **Join a Poll**
    - Select "I'm a Student" on the homepage
    - Enter the Poll ID provided by your teacher
    - Set your unique display name

2. **Participate**
    - Wait for questions to be asked
    - Answer within the 60-second time limit
    - View results after submitting your response

## 🎨 Design System

The application follows a modern, clean design system based on the provided Figma mockups:

- **Primary Colors**: Purple theme (#8B5CF6, #7C3AED)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Consistent button styles, cards, and form elements
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant color contrasts and keyboard navigation

## 🔧 API Documentation

### Core Endpoints

#### Teacher Routes

- `POST /api/teacher/poll` - Create new poll
- `GET /api/teacher/poll/:pollId` - Get poll details
- `POST /api/teacher/poll/:pollId/question` - Add question
- `POST /api/teacher/poll/:pollId/question/:questionId/start` - Start question
- `DELETE /api/teacher/poll/:pollId/student/:studentName` - Remove student

#### Student Routes

- `POST /api/student/join` - Join poll session
- `POST /api/student/answer` - Submit answer
- `GET /api/student/poll/:pollId/current-question` - Get current question

### WebSocket Events

- `question-started` - New question broadcasted
- `question-ended` - Question time expired
- `poll-results-updated` - Live result updates
- `student-joined/left` - Student connection changes
- `timer-update` - Countdown synchronization

## 🚀 Deployment

### Vercel Deployment

Both frontend and backend are deployed on Vercel:

1. **Backend Deployment**

    ```bash
    cd backend
    vercel --prod
    ```

2. **Frontend Deployment**

    ```bash
    cd frontend
    vercel --prod
    ```

3. **Environment Variables**
    - Set up production environment variables in Vercel dashboard
    - Update CORS origins and Socket.io URLs for production

### Production Considerations

- MongoDB Atlas for database hosting
- Proper error handling and logging
- Rate limiting for API endpoints
- Socket.io scaling for multiple concurrent polls

## 🧪 Testing

### Manual Testing Checklist

- [ ] Teacher can create polls
- [ ] Students can join with unique names
- [ ] Questions broadcast in real-time
- [ ] Timer synchronization works
- [ ] Results update live
- [ ] Student removal functionality
- [ ] Connection handling (disconnect/reconnect)

### Testing Locally

1. Open multiple browser tabs/windows
2. Create a poll as teacher in one tab
3. Join as different students in other tabs
4. Test real-time functionality

## 🤝 Contributing

This project was developed as part of the Intervue.io SDE Intern assignment. While primarily for evaluation, suggestions and improvements are welcome.

## 📋 Assignment Requirements Checklist

### Must-Have Features ✅

- [x] Functional system with all core features
- [x] Teacher can create polls
- [x] Students can answer questions
- [x] Real-time results viewing
- [x] 60-second timer implementation
- [x] Socket.io for real-time communication
- [x] UI follows Figma design
- [x] Hosted on Vercel (both frontend and backend)

### Good to Have Features ✅

- [x] Well-designed user interface
- [x] Student removal functionality
- [x] Configurable poll settings

### Bonus Features ⚡

- [x] Real-time student management
- [x] Connection status indicators
- [x] Responsive design
- [x] TypeScript implementation
- [x] Professional code structure

## 📞 Contact

**Developer**: Aryan Singh

- **Email**: aryansingh97713@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/singhtwenty2/
- **GitHub**: [singhtwenty2](https://github.com/singhtwenty2)

## 📄 License

This project is developed for educational purposes as part of the Intervue.io SDE Intern assignment.

---

**Built for Intervue.io Assignment | 2025**

## 🎯 Assignment Submission Details

- **Assignment**: SDE Intern Role Assignment - Round 1
- **Company**: Intervue.io
- **Timeline**: 2 days development period
- **Technology Requirements**: Met all specified requirements
- **Design Compliance**: Follows provided Figma designs
- **Deployment**: Successfully hosted and accessible

> "A real-time polling system that brings classrooms to life with interactive engagement and seamless technology integration."
