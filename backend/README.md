# Live Polling System Backend

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- pnpm (or npm/yarn)

### Local Development Setup

1. **Clone and Install Dependencies**

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install dependencies
pnpm install
```

2. **Environment Configuration**
   Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/polling-system?retryWrites=true&w=majority
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

3. **MongoDB Setup**

- Create a free MongoDB Atlas cluster at https://cloud.mongodb.com
- Get your connection string and replace in `.env`
- Whitelist your IP address in MongoDB Atlas Network Access

4. **Run Development Server**

```bash
pnpm dev
```

The server will start on `http://localhost:5000`

### Vercel Deployment

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Build the Project**

```bash
pnpm build
```

3. **Deploy to Vercel**

```bash
vercel
```

4. **Set Environment Variables on Vercel**
   Go to your Vercel dashboard and add:

- `MONGODB_URI` - Your MongoDB Atlas connection string
- `NODE_ENV` - Set to `production`
- `CORS_ORIGIN` - Your frontend URL (comma-separated for multiple)

## API Testing with Postman

### Base URLs

- Local: `http://localhost:5000`
- Production: Your Vercel URL

### Test Flow

#### 1. Create a Poll (Teacher)

**POST** `/api/teacher/poll`

```json
{
    "title": "Math Quiz",
    "teacherId": "teacher123"
}
```

Save the returned `pollId` for next requests.

#### 2. Join Poll (Student)

**POST** `/api/student/join`

```json
{
    "pollId": "YOUR_POLL_ID",
    "studentName": "John Doe"
}
```

#### 3. Add Question (Teacher)

**POST** `/api/teacher/poll/{pollId}/question`

```json
{
    "text": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "timeLimit": 60
}
```

Save the returned `questionId`.

#### 4. Start Question (Teacher)

**POST** `/api/teacher/poll/{pollId}/question/{questionId}/start`

#### 5. Get Current Question (Student)

**GET** `/api/student/poll/{pollId}/current-question`

#### 6. Submit Answer (Student)

**POST** `/api/student/answer`

```json
{
    "pollId": "YOUR_POLL_ID",
    "questionId": "YOUR_QUESTION_ID",
    "studentName": "John Doe",
    "selectedOption": 1
}
```

#### 7. Get Results (Teacher)

**GET** `/api/teacher/poll/{pollId}/results`

### WebSocket Testing

Use a WebSocket client or the Socket.io client library:

```javascript
// Connect
const socket = io("http://localhost:5000");

// Student joins
socket.emit("join-poll", {
    pollId: "YOUR_POLL_ID",
    studentName: "John Doe",
});

// Teacher joins
socket.emit("teacher-join", {
    pollId: "YOUR_POLL_ID",
});

// Listen for events
socket.on("question-started", (data) => {
    console.log("New question:", data);
});

socket.on("poll-results-updated", (data) => {
    console.log("Results updated:", data);
});
```

## Project Structure

```
src/
├── config/
│   └── database.ts       # MongoDB connection
├── controllers/
│   ├── teacherController.ts
│   └── studentController.ts
├── models/
│   ├── Poll.ts
│   └── Session.ts
├── routes/
│   ├── teacherRoutes.ts
│   └── studentRoutes.ts
├── socket/
│   └── SocketManager.ts  # WebSocket handling
├── types/
│   └── index.ts          # TypeScript interfaces
├── utils/
│   └── helpers.ts        # Utility functions
└── server.ts             # Main server file
```

## Features Implemented

### Core Features ✅

- Teacher can create polls
- Students can join with unique names
- Teacher can add multiple questions
- Real-time question broadcasting
- 60-second timer for answers
- Live result updates
- Student removal by teacher
- Poll history for teachers

### WebSocket Events ✅

- Real-time question start/end
- Live participant count
- Instant result updates
- Timer countdown
- Student join/leave notifications

### Security ✅

- Input validation
- Rate limiting
- CORS configuration
- MongoDB connection security
- Error handling

## Troubleshooting

### MongoDB Connection Issues

- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure database user has proper permissions

### Vercel Deployment Issues

- Make sure to run `pnpm build` before deploying
- Check if all environment variables are set
- Verify the build output in `dist/` folder

### Socket Connection Issues

- Check CORS configuration
- Ensure WebSocket transport is enabled
- Verify firewall settings

## Next Steps

After backend is tested and deployed:

1. Note down the deployed backend URL
2. Configure frontend to use this URL
3. Test real-time features with multiple browser tabs
4. Monitor server logs for any issues
