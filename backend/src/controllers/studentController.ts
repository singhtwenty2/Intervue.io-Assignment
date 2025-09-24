import { Request, Response } from "express";
import Poll from "../models/poll";
import Session from "../models/session";
import { validateStudentName } from "../utils/helpers";

export const joinPoll = async (req: Request, res: Response) => {
    try {
        const { pollId, studentName } = req.body;

        if (!validateStudentName(studentName)) {
            return res.status(400).json({
                success: false,
                error: "Student name must be 2-50 characters and contain only letters, numbers, and spaces",
            });
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res
                .status(404)
                .json({ success: false, error: "Poll not found" });
        }

        if (!poll.isActive) {
            return res
                .status(400)
                .json({ success: false, error: "Poll is not active" });
        }

        if (!poll.participants.includes(studentName)) {
            poll.participants.push(studentName);
            await poll.save();
        }

        const session = await Session.findOneAndUpdate(
            { pollId, studentName },
            {
                pollId,
                studentName,
                socketId: "",
                isActive: true,
                joinedAt: new Date(),
            },
            { upsert: true, new: true },
        );

        res.json({
            success: true,
            studentId: session._id,
        });
    } catch (error) {
        console.error("Error joining poll:", error);
        res.status(500).json({ success: false, error: "Failed to join poll" });
    }
};

export const submitAnswer = async (req: Request, res: Response) => {
    try {
        const { pollId, questionId, studentName, selectedOption } = req.body;

        if (!validateStudentName(studentName)) {
            return res.status(400).json({
                success: false,
                error: "Invalid student name",
            });
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res
                .status(404)
                .json({ success: false, error: "Poll not found" });
        }

        const question = poll.questions.find((q) => q.id === questionId);
        if (!question) {
            return res
                .status(404)
                .json({ success: false, error: "Question not found" });
        }

        if (!question.isActive) {
            return res
                .status(400)
                .json({ success: false, error: "Question is not active" });
        }

        const existingAnswer = question.answers.find(
            (a) => a.studentName === studentName,
        );
        if (existingAnswer) {
            return res
                .status(400)
                .json({ success: false, error: "Answer already submitted" });
        }

        if (selectedOption < 0 || selectedOption >= question.options.length) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid option selected" });
        }

        question.answers.push({
            studentName,
            selectedOption,
            submittedAt: new Date(),
        });

        await poll.save();

        res.json({ success: true });
    } catch (error) {
        console.error("Error submitting answer:", error);
        res.status(500).json({
            success: false,
            error: "Failed to submit answer",
        });
    }
};

export const getCurrentQuestion = async (req: Request, res: Response) => {
    try {
        const { pollId } = req.params;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res
                .status(404)
                .json({ success: false, error: "Poll not found" });
        }

        if (poll.currentQuestionIndex === -1) {
            return res.json({ question: null, timeRemaining: 0 });
        }

        const currentQuestion = poll.questions[poll.currentQuestionIndex];
        if (!currentQuestion || !currentQuestion.isActive) {
            return res.json({ question: null, timeRemaining: 0 });
        }

        const timeElapsed = currentQuestion.startTime
            ? Math.floor(
                  (Date.now() - currentQuestion.startTime.getTime()) / 1000,
              )
            : 0;
        const timeRemaining = Math.max(
            0,
            currentQuestion.timeLimit - timeElapsed,
        );

        res.json({
            question: {
                id: currentQuestion.id,
                text: currentQuestion.text,
                options: currentQuestion.options,
                timeLimit: currentQuestion.timeLimit,
            },
            timeRemaining,
        });
    } catch (error) {
        console.error("Error fetching current question:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch current question",
        });
    }
};
