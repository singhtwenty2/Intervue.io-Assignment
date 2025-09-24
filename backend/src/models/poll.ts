import mongoose, { Document, Schema } from "mongoose";
import { IAnswer, IPoll, IQuestion } from "../types";

export interface IPollDocument extends Omit<IPoll, "_id">, Document {}

const AnswerSchema = new Schema<IAnswer>({
    studentName: { type: String, required: true },
    selectedOption: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
});

const QuestionSchema = new Schema<IQuestion>({
    id: { type: String, required: true },
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    answers: [AnswerSchema],
    isActive: { type: Boolean, default: false },
    startTime: { type: Date },
    endTime: { type: Date },
    timeLimit: { type: Number, default: 60 },
});

const PollSchema = new Schema<IPollDocument>({
    teacherId: { type: String, required: true },
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    currentQuestionIndex: { type: Number, default: -1 },
    questions: [QuestionSchema],
    participants: [{ type: String }],
});

export default mongoose.model<IPollDocument>("Poll", PollSchema);
