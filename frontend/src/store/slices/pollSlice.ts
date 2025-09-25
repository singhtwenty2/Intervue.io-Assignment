import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Poll, Question, QuestionResult, Student } from "../../types";

interface PollState {
    currentPoll: Poll | null;
    currentQuestion: Question | null;
    pollResults: QuestionResult[];
    students: Student[];
    isTeacher: boolean;
    timeRemaining: number;
    pollHistory: Poll[];
    studentName: string;
}

const initialState: PollState = {
    currentPoll: null,
    currentQuestion: null,
    pollResults: [],
    students: [],
    isTeacher: false,
    timeRemaining: 0,
    pollHistory: [],
    studentName: "",
};

const pollSlice = createSlice({
    name: "poll",
    initialState,
    reducers: {
        setPoll: (state, action: PayloadAction<Poll>) => {
            state.currentPoll = action.payload;
        },
        setCurrentQuestion: (state, action: PayloadAction<Question | null>) => {
            state.currentQuestion = action.payload;
            if (action.payload) {
                state.timeRemaining = action.payload.timeLimit;
            }
        },
        updateTimeRemaining: (state, action: PayloadAction<number>) => {
            state.timeRemaining = action.payload;
        },
        addStudent: (state, action: PayloadAction<Student>) => {
            const existingIndex = state.students.findIndex(
                (s) => s.name === action.payload.name,
            );
            if (existingIndex >= 0) {
                state.students[existingIndex] = action.payload;
            } else {
                state.students.push(action.payload);
            }
        },
        removeStudent: (state, action: PayloadAction<string>) => {
            state.students = state.students.filter(
                (s) => s.name !== action.payload,
            );
        },
        updatePollResults: (state, action: PayloadAction<QuestionResult>) => {
            const index = state.pollResults.findIndex(
                (r) => r.questionId === action.payload.questionId,
            );
            if (index >= 0) {
                state.pollResults[index] = action.payload;
            } else {
                state.pollResults.push(action.payload);
            }
        },
        setIsTeacher: (state, action: PayloadAction<boolean>) => {
            state.isTeacher = action.payload;
        },
        setPollHistory: (state, action: PayloadAction<Poll[]>) => {
            state.pollHistory = action.payload;
        },
        setStudentName: (state, action: PayloadAction<string>) => {
            state.studentName = action.payload;
        },
        resetPoll: (state) => {
            state.currentPoll = null;
            state.currentQuestion = null;
            state.pollResults = [];
            state.students = [];
            state.timeRemaining = 0;
            state.studentName = "";
        },
    },
});

export const {
    setPoll,
    setCurrentQuestion,
    updateTimeRemaining,
    addStudent,
    removeStudent,
    updatePollResults,
    setIsTeacher,
    setPollHistory,
    setStudentName,
    resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;
