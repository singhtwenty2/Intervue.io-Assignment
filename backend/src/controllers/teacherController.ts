import { Request, Response } from "express";
import Poll from "../models/poll";
import {
    calculateResults,
    generatePollId,
    generateQuestionId,
    validatePollTitle,
    validateQuestion,
} from "../utils/helpers";

export const createPoll = async (req: Request, res: Response) => {
    try {
        const { title, teacherId } = req.body;

        if (!validatePollTitle(title)) {
            return res.status(400).json({
                success: false,
                error: "Poll title must be between 3 and 100 characters",
            });
        }

        const poll = new Poll({
            teacherId: teacherId || generatePollId(),
            title,
            isActive: true,
            questions: [],
            participants: [],
        });

        await poll.save();

        res.status(201).json({
            success: true,
            pollId: poll._id,
            accessCode: poll._id?.toString(),
        });
    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create poll",
        });
    }
};

export const getPoll = async (req: Request, res: Response) => {
    try {
        const { pollId } = req.params;
        const poll = await Poll.findById(pollId);

        if (!poll) {
            return res
                .status(404)
                .json({ success: false, error: "Poll not found" });
        }

        const activeStudents = poll.participants;

        res.json({
            poll: {
                _id: poll._id,
                title: poll.title,
                createdAt: poll.createdAt,
                isActive: poll.isActive,
                currentQuestionIndex: poll.currentQuestionIndex,
                questions: poll.questions,
                participants: poll.participants,
            },
            activeStudents,
        });
    } catch (error) {
        console.error("Error fetching poll:", error);
        res.status(500).json({ success: false, error: "Failed to fetch poll" });
    }
};

export const addQuestion = async (req: Request, res: Response) => {
    try {
        const { pollId } = req.params;
        const { text, options, timeLimit = 60 } = req.body;

        if (!validateQuestion(text, options)) {
            return res.status(400).json({
                success: false,
                error: "Invalid question format",
            });
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res
                .status(404)
                .json({ success: false, error: "Poll not found" });
        }

        const questionId = generateQuestionId();
        const question = {
            id: questionId,
            text,
            options,
            answers: [],
            isActive: false,
            timeLimit,
        };

        poll.questions.push(question);
        await poll.save();

        res.status(201).json({
            success: true,
            questionId,
        });
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({
            success: false,
            error: "Failed to add question",
        });
    }
};

export const startQuestion = async (req: Request, res: Response) => {
    try {
        const { pollId, questionId } = req.params;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res
                .status(404)
                .json({ success: false, error: "Poll not found" });
        }

        const questionIndex = poll.questions.findIndex(
            (q) => q.id === questionId,
        );
        if (questionIndex === -1) {
            return res
                .status(404)
                .json({ success: false, error: "Question not found" });
        }

        const hasActiveQuestion = poll.questions.some((q) => q.isActive);
        if (hasActiveQuestion) {
            return res.status(400).json({
                success: false,
                error: "Another question is already active",
            });
        }

        const question = poll.questions[questionIndex];
        question.isActive = true;
        question.startTime = new Date();
        poll.currentQuestionIndex = questionIndex;

        await poll.save();

        res.json({
            success: true,
            startTime: question.startTime,
        });
    } catch (error) {
        console.error("Error starting question:", error);
        res.status(500).json({
            success: false,
            error: "Failed to start question",
        });
    }
};

export const getPollResults = async (req: Request, res: Response) => {
    try {
        const { pollId } = req.params;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res
                .status(404)
                .json({ success: false, error: "Poll not found" });
        }

        const questions = poll.questions.map((question) =>
            calculateResults(question, poll.participants.length),
        );

        res.json({ questions });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch results",
        });
    }
};

export const getPollHistory = async (req: Request, res: Response) => {
    try {
        const { teacherId } = req.query;

        const query = teacherId ? { teacherId } : {};
        const polls = await Poll.find(query).sort({ createdAt: -1 }).limit(50);

        res.json({ polls });
    } catch (error) {
        console.error("Error fetching poll history:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch poll history",
        });
    }
};

export const removeStudent = async (req: Request, res: Response) => {
    try {
        const { pollId, studentName } = req.params;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res
                .status(404)
                .json({ success: false, error: "Poll not found" });
        }

        poll.participants = poll.participants.filter((p) => p !== studentName);

        for (const question of poll.questions) {
            question.answers = question.answers.filter(
                (a) => a.studentName !== studentName,
            );
        }

        await poll.save();

        res.json({ success: true });
    } catch (error) {
        console.error("Error removing student:", error);
        res.status(500).json({
            success: false,
            error: "Failed to remove student",
        });
    }
};
