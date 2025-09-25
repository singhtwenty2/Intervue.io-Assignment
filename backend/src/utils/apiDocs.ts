export const apiDocumentation = {
    message: "Live Polling System API - Intervue.io SDE Intern Assignment",
    version: "1.0.0",
    description: "Real-time polling system backend with Socket.io integration",
    assignment: {
        company: "Intervue.io",
        role: "SDE Intern",
        round: "Assignment Round 1",
        developer: "Your Name",
        submissionDate: new Date().toISOString().split("T")[0],
        timeline: "2 Days Development",
    },
    frontend: {
        url: "https://intervue-io-assignment-jet.vercel.app/",
        repository: "https://github.com/singhtwenty2/Intervue.io-Assignment",
        technology: "React + TypeScript + Redux + Socket.io-client",
    },
    backend: {
        url: "https://intervueio-assignment-production.up.railway.app/",
        technology: "Express.js + TypeScript + Socket.io + MongoDB",
    },
    features: [
        "Real-time polling with WebSocket support",
        "Teacher dashboard for poll management",
        "Student interface for poll participation",
        "Live result updates and timer synchronization",
        "Student management and removal capabilities",
        "60-second question timer with auto-progression",
    ],
    api: {
        baseUrl:
            process.env.NODE_ENV === "production"
                ? "https://intervueio-assignment-production.up.railway.app"
                : "http://localhost:3000",
        endpoints: {
            teacher: [
                {
                    method: "POST",
                    path: "/api/teacher/poll",
                    description: "Create a new poll",
                    body: {
                        title: "string",
                    },
                },
                {
                    method: "GET",
                    path: "/api/teacher/poll/:pollId",
                    description: "Get poll details and connected students",
                },
                {
                    method: "POST",
                    path: "/api/teacher/poll/:pollId/question",
                    description: "Add a new question to poll",
                    body: {
                        text: "string",
                        options: ["string[]"],
                        timeLimit: "number (optional, default: 60)",
                    },
                },
                {
                    method: "POST",
                    path: "/api/teacher/poll/:pollId/question/:questionId/start",
                    description: "Start a specific question",
                },
                {
                    method: "DELETE",
                    path: "/api/teacher/poll/:pollId/student/:studentName",
                    description: "Remove a student from poll",
                },
                {
                    method: "GET",
                    path: "/api/teacher/poll/:pollId/results",
                    description: "Get poll results and analytics",
                },
            ],
            student: [
                {
                    method: "POST",
                    path: "/api/student/join",
                    description: "Join a poll session",
                    body: {
                        pollId: "string",
                        studentName: "string",
                    },
                },
                {
                    method: "POST",
                    path: "/api/student/answer",
                    description: "Submit answer to active question",
                    body: {
                        pollId: "string",
                        questionId: "string",
                        selectedOption: "number",
                    },
                },
                {
                    method: "GET",
                    path: "/api/student/poll/:pollId/current-question",
                    description: "Get currently active question",
                },
            ],
            system: [
                {
                    method: "GET",
                    path: "/health",
                    description: "Health check endpoint",
                },
                {
                    method: "GET",
                    path: "/",
                    description: "API documentation (this page)",
                },
            ],
        },
    },
    websocket: {
        events: {
            client_to_server: [
                "join-poll - Join a specific poll room",
                "submit-answer - Submit answer to question",
                "start-question - Start a question (teacher only)",
                "end-question - End current question (teacher only)",
                "remove-student - Remove student from poll (teacher only)",
            ],
            server_to_client: [
                "question-started - New question broadcasted",
                "question-ended - Question ended with results",
                "poll-results-updated - Live result updates",
                "student-joined - Student joined the poll",
                "student-left - Student left the poll",
                "student-removed - Student was removed",
                "timer-update - Timer countdown updates",
            ],
        },
        connection: {
            transports: ["websocket", "polling"],
            pingTimeout: 60000,
            pingInterval: 25000,
        },
    },
    database: {
        type: "MongoDB Atlas",
        collections: ["polls", "sessions"],
        features: [
            "Real-time data synchronization",
            "Automatic session cleanup",
            "Poll history storage",
            "Student answer tracking",
        ],
    },
    deployment: {
        platform: "Railway",
        environment: process.env.NODE_ENV || "development",
        uptime: "99.9% SLA",
        monitoring: "Health check endpoint available",
    },
    contact: {
        developer: "Aryan Singh",
        email: "aryansingh97713@gmail.com",
        portfolio: "https://singhtwenty2.pages.dev",
        github: "https://github.com/singhtwenty2",
    },
    technologies: {
        runtime: "Node.js",
        framework: "Express.js",
        language: "TypeScript",
        database: "MongoDB with Mongoose",
        realtime: "Socket.io",
        security: "Helmet, CORS, Rate Limiting",
        utilities: "Compression, dotenv, nanoid",
    },
    status: {
        server: "Running",
        database: "Connected",
        websocket: "Active",
        lastUpdated: new Date().toISOString(),
    },
};
