import { Server, Socket } from "socket.io";
import Poll from "../models/poll";
import Session from "../models/session";
import { SocketData } from "../types";
import { calculateResults } from "../utils/helpers";

export class SocketManager {
    private io: Server;
    private activePollTimers: Map<string, NodeJS.Timeout> = new Map();

    constructor(io: Server) {
        this.io = io;
    }

    async handleConnection(socket: Socket) {
        socket.on(
            "join-poll",
            async (data: { pollId: string; studentName: string }) => {
                await this.handleJoinPoll(socket, data);
            },
        );

        socket.on(
            "submit-answer",
            async (data: {
                pollId: string;
                questionId: string;
                selectedOption: number;
            }) => {
                await this.handleSubmitAnswer(socket, data);
            },
        );

        socket.on(
            "start-question",
            async (data: { pollId: string; questionId: string }) => {
                await this.handleStartQuestion(socket, data);
            },
        );

        socket.on(
            "end-question",
            async (data: { pollId: string; questionId: string }) => {
                await this.handleEndQuestion(data);
            },
        );

        socket.on(
            "remove-student",
            async (data: { pollId: string; studentName: string }) => {
                await this.handleRemoveStudent(socket, data);
            },
        );

        socket.on("teacher-join", async (data: { pollId: string }) => {
            await this.handleTeacherJoin(socket, data);
        });

        socket.on("disconnect", async () => {
            await this.handleDisconnect(socket);
        });
    }

    private async handleJoinPoll(
        socket: Socket,
        data: { pollId: string; studentName: string },
    ) {
        try {
            const poll = await Poll.findById(data.pollId);
            if (!poll) {
                socket.emit("error", { message: "Poll not found" });
                return;
            }

            const room = `poll-${data.pollId}`;
            socket.join(room);

            socket.data = {
                pollId: data.pollId,
                role: "student",
                studentName: data.studentName,
            } as SocketData;

            if (!poll.participants.includes(data.studentName)) {
                poll.participants.push(data.studentName);
                await poll.save();
            }

            await Session.findOneAndUpdate(
                { pollId: data.pollId, studentName: data.studentName },
                {
                    socketId: socket.id,
                    isActive: true,
                    joinedAt: new Date(),
                },
                { upsert: true },
            );

            this.io.to(room).emit("student-joined", {
                studentName: data.studentName,
                totalStudents: poll.participants.length,
            });

            const currentQuestion =
                poll.currentQuestionIndex >= 0
                    ? poll.questions[poll.currentQuestionIndex]
                    : null;

            if (currentQuestion && currentQuestion.isActive) {
                const timeElapsed = currentQuestion.startTime
                    ? Math.floor(
                          (Date.now() - currentQuestion.startTime.getTime()) /
                              1000,
                      )
                    : 0;
                const timeRemaining = Math.max(
                    0,
                    currentQuestion.timeLimit - timeElapsed,
                );

                socket.emit("current-question", {
                    question: {
                        id: currentQuestion.id,
                        text: currentQuestion.text,
                        options: currentQuestion.options,
                        timeLimit: currentQuestion.timeLimit,
                    },
                    timeRemaining,
                });
            }
        } catch (error) {
            console.error("Error joining poll:", error);
            socket.emit("error", { message: "Failed to join poll" });
        }
    }

    private async handleTeacherJoin(socket: Socket, data: { pollId: string }) {
        const room = `poll-${data.pollId}`;
        const teacherRoom = `${room}-teacher`;

        socket.join(room);
        socket.join(teacherRoom);

        socket.data = {
            pollId: data.pollId,
            role: "teacher",
        } as SocketData;

        const poll = await Poll.findById(data.pollId);
        if (poll) {
            socket.emit("poll-state", {
                participants: poll.participants,
                currentQuestionIndex: poll.currentQuestionIndex,
                questions: poll.questions,
            });
        }
    }

    private async handleSubmitAnswer(
        socket: Socket,
        data: { pollId: string; questionId: string; selectedOption: number },
    ) {
        try {
            const studentName = socket.data?.studentName;
            if (!studentName) {
                socket.emit("error", { message: "Student not authenticated" });
                return;
            }

            const poll = await Poll.findById(data.pollId);
            if (!poll) {
                socket.emit("error", { message: "Poll not found" });
                return;
            }

            const question = poll.questions.find(
                (q) => q.id === data.questionId,
            );
            if (!question) {
                socket.emit("error", { message: "Question not found" });
                return;
            }

            if (!question.isActive) {
                socket.emit("error", { message: "Question is not active" });
                return;
            }

            const existingAnswer = question.answers.find(
                (a) => a.studentName === studentName,
            );
            if (existingAnswer) {
                socket.emit("error", { message: "Answer already submitted" });
                return;
            }

            question.answers.push({
                studentName,
                selectedOption: data.selectedOption,
                submittedAt: new Date(),
            });

            await poll.save();

            socket.emit("answer-submitted", { success: true });

            const results = calculateResults(
                question,
                poll.participants.length,
            );
            const room = `poll-${data.pollId}`;

            this.io.to(room).emit("poll-results-updated", {
                questionId: data.questionId,
                results,
            });

            if (question.answers.length === poll.participants.length) {
                await this.handleEndQuestion({
                    pollId: data.pollId,
                    questionId: data.questionId,
                });
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
            socket.emit("error", { message: "Failed to submit answer" });
        }
    }

    private async handleStartQuestion(
        socket: Socket,
        data: { pollId: string; questionId: string },
    ) {
        try {
            const poll = await Poll.findById(data.pollId);
            if (!poll) {
                socket.emit("error", { message: "Poll not found" });
                return;
            }

            const questionIndex = poll.questions.findIndex(
                (q) => q.id === data.questionId,
            );
            if (questionIndex === -1) {
                socket.emit("error", { message: "Question not found" });
                return;
            }

            const question = poll.questions[questionIndex];
            question.isActive = true;
            question.startTime = new Date();
            poll.currentQuestionIndex = questionIndex;

            await poll.save();

            const room = `poll-${data.pollId}`;
            this.io.to(room).emit("question-started", {
                question: {
                    id: question.id,
                    text: question.text,
                    options: question.options,
                    timeLimit: question.timeLimit,
                },
                timeLimit: question.timeLimit,
            });

            this.startQuestionTimer(
                data.pollId,
                data.questionId,
                question.timeLimit,
            );

            let remainingTime = question.timeLimit;
            const timerInterval = setInterval(() => {
                remainingTime--;
                this.io
                    .to(room)
                    .emit("timer-update", { timeRemaining: remainingTime });

                if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                }
            }, 1000);
        } catch (error) {
            console.error("Error starting question:", error);
            socket.emit("error", { message: "Failed to start question" });
        }
    }

    private async handleEndQuestion(data: {
        pollId: string;
        questionId: string;
    }) {
        try {
            const timerId = `${data.pollId}-${data.questionId}`;
            const timer = this.activePollTimers.get(timerId);
            if (timer) {
                clearTimeout(timer);
                this.activePollTimers.delete(timerId);
            }

            const poll = await Poll.findById(data.pollId);
            if (!poll) return;

            const question = poll.questions.find(
                (q) => q.id === data.questionId,
            );
            if (!question) return;

            question.isActive = false;
            question.endTime = new Date();
            await poll.save();

            const results = calculateResults(
                question,
                poll.participants.length,
            );
            const room = `poll-${data.pollId}`;

            this.io.to(room).emit("question-ended", {
                questionId: data.questionId,
                results,
            });
        } catch (error) {
            console.error("Error ending question:", error);
        }
    }

    private async handleRemoveStudent(
        socket: Socket,
        data: { pollId: string; studentName: string },
    ) {
        try {
            const poll = await Poll.findById(data.pollId);
            if (!poll) {
                socket.emit("error", { message: "Poll not found" });
                return;
            }

            poll.participants = poll.participants.filter(
                (p) => p !== data.studentName,
            );

            for (const question of poll.questions) {
                question.answers = question.answers.filter(
                    (a) => a.studentName !== data.studentName,
                );
            }

            await poll.save();

            await Session.findOneAndUpdate(
                { pollId: data.pollId, studentName: data.studentName },
                { isActive: false },
            );

            const session = await Session.findOne({
                pollId: data.pollId,
                studentName: data.studentName,
                isActive: false,
            });

            if (session && session.socketId) {
                const targetSocket = this.io.sockets.sockets.get(
                    session.socketId,
                );
                if (targetSocket) {
                    targetSocket.emit("student-removed", {
                        reason: "You have been removed from the poll by the teacher",
                    });
                    targetSocket.disconnect();
                }
            }

            const room = `poll-${data.pollId}`;
            this.io.to(room).emit("student-left", {
                studentName: data.studentName,
                totalStudents: poll.participants.length,
            });
        } catch (error) {
            console.error("Error removing student:", error);
            socket.emit("error", { message: "Failed to remove student" });
        }
    }

    private async handleDisconnect(socket: Socket) {
        try {
            const studentName = socket.data?.studentName;
            const pollId = socket.data?.pollId;

            if (studentName && pollId) {
                await Session.findOneAndUpdate(
                    { pollId, studentName },
                    { isActive: false },
                );

                const room = `poll-${pollId}`;
                const poll = await Poll.findById(pollId);

                if (poll) {
                    socket.to(room).emit("student-left", {
                        studentName,
                        totalStudents: poll.participants.length,
                    });
                }
            }
        } catch (error) {
            console.error("Error handling disconnect:", error);
        }
    }

    private startQuestionTimer(
        pollId: string,
        questionId: string,
        duration: number,
    ) {
        const timerId = `${pollId}-${questionId}`;

        if (this.activePollTimers.has(timerId)) {
            clearTimeout(this.activePollTimers.get(timerId)!);
        }

        const timer = setTimeout(async () => {
            await this.handleEndQuestion({ pollId, questionId });
            this.activePollTimers.delete(timerId);
        }, duration * 1000);

        this.activePollTimers.set(timerId, timer);
    }
}
