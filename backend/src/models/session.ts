import mongoose, { Document, Schema } from "mongoose";
import { ISession } from "../types";

export interface ISessionDocument extends Omit<ISession, "_id">, Document {}

const SessionSchema = new Schema<ISessionDocument>({
    pollId: { type: String, required: true },
    studentName: { type: String, required: true },
    socketId: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
});

SessionSchema.index({ pollId: 1, studentName: 1 }, { unique: true });

export default mongoose.model<ISessionDocument>("Session", SessionSchema);
