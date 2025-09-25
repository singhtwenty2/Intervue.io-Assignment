import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/database";
import studentRoutes from "./routes/studentRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import { SocketManager } from "./socket/socketManager";
import { apiDocumentation } from "./utils/apiDocs";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    }),
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

app.get("/", (req: Request, res: Response) => {
    res.json(apiDocumentation);
});

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        success: false,
        error:
            process.env.NODE_ENV === "production"
                ? "Something went wrong"
                : err.message,
    });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, error: "Route not found" });
});

const io = new Server(httpServer, {
    cors: corsOptions,
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
});

const socketManager = new SocketManager(io);

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socketManager.handleConnection(socket);
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(
                `Environment: ${process.env.NODE_ENV || "development"}`,
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    httpServer.close(() => {
        console.log("Server closed");
        process.exit(0);
    });
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default httpServer;
