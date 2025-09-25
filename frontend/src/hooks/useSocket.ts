import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import {
    addStudent,
    removeStudent,
    setCurrentQuestion,
    updatePollResults,
    updateTimeRemaining,
} from "../store/slices/pollSlice";
import { setConnected, setNotification } from "../store/slices/uiSlice";

const baseUrl = "https://intervueio-assignment-production.up.railway.app";

export const useSocket = (pollId: string | null, studentName?: string) => {
    const dispatch = useDispatch();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!pollId) return;

        socketRef.current = io(baseUrl, {
            transports: ["websocket", "polling"],
        });

        const socket = socketRef.current;

        socket.emit("join-poll", { pollId, studentName });

        socket.on("connect", () => {
            dispatch(setConnected(true));
        });

        socket.on("disconnect", () => {
            dispatch(setConnected(false));
        });

        socket.on("question-started", (data) => {
            dispatch(setCurrentQuestion(data.question));
            dispatch(
                setNotification({
                    message: "New question started!",
                    type: "info",
                }),
            );
        });

        socket.on("question-ended", (data) => {
            dispatch(setCurrentQuestion(null));
            dispatch(updatePollResults(data.results));
            dispatch(
                setNotification({
                    message: "Question ended!",
                    type: "info",
                }),
            );
        });

        socket.on("poll-results-updated", (data) => {
            dispatch(updatePollResults(data.results));
        });

        socket.on("student-joined", (data) => {
            dispatch(
                addStudent({
                    name: data.studentName,
                    joinedAt: new Date().toISOString(),
                    hasAnswered: false,
                    isConnected: true,
                }),
            );
        });

        socket.on("student-left", (data) => {
            dispatch(removeStudent(data.studentName));
        });

        socket.on("timer-update", (data) => {
            dispatch(updateTimeRemaining(data.timeRemaining));
        });

        socket.on("student-removed", (data) => {
            if (data.studentName === studentName) {
                window.location.href = "/kicked-out";
            }
        });

        socket.on("error", (error) => {
            dispatch(
                setNotification({
                    message: error.message || "An error occurred",
                    type: "error",
                }),
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [pollId, studentName, dispatch]);

    const emitEvent = (event: string, data: any) => {
        if (socketRef.current) {
            socketRef.current.emit(event, data);
        }
    };

    return { emitEvent };
};
