import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Poll, Question, QuestionResult } from "../../types";

const baseUrl = "https://intervueio-assignment-production.up.railway.app";

export const pollApi = createApi({
    reducerPath: "pollApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api`,
    }),
    tagTypes: ["Poll", "Question", "Results"],
    endpoints: (builder) => ({
        createPoll: builder.mutation<
            { success: boolean; pollId: string },
            { title: string; teacherId: string }
        >({
            query: (body) => ({
                url: "/teacher/poll",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Poll"],
        }),

        getPoll: builder.query<{ poll: Poll }, string>({
            query: (pollId) => `/teacher/poll/${pollId}`,
            providesTags: ["Poll"],
        }),

        addQuestion: builder.mutation<
            { success: boolean; questionId: string },
            {
                pollId: string;
                text: string;
                options: string[];
                timeLimit: number;
            }
        >({
            query: ({ pollId, ...body }) => ({
                url: `/teacher/poll/${pollId}/question`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Poll", "Question"],
        }),

        startQuestion: builder.mutation<
            { success: boolean; startTime: string },
            { pollId: string; questionId: string }
        >({
            query: ({ pollId, questionId }) => ({
                url: `/teacher/poll/${pollId}/question/${questionId}/start`,
                method: "POST",
            }),
            invalidatesTags: ["Question"],
        }),

        joinPoll: builder.mutation<
            { success: boolean; studentId: string },
            { pollId: string; studentName: string }
        >({
            query: (body) => ({
                url: "/student/join",
                method: "POST",
                body,
            }),
        }),

        getCurrentQuestion: builder.query<
            { question: Question | null; timeRemaining: number },
            string
        >({
            query: (pollId) => `/student/poll/${pollId}/current-question`,
        }),

        submitAnswer: builder.mutation<
            { success: boolean },
            {
                pollId: string;
                questionId: string;
                studentName: string;
                selectedOption: number;
            }
        >({
            query: (body) => ({
                url: "/student/answer",
                method: "POST",
                body,
            }),
        }),

        getPollResults: builder.query<{ questions: QuestionResult[] }, string>({
            query: (pollId) => `/teacher/poll/${pollId}/results`,
            providesTags: ["Results"],
        }),

        getPollHistory: builder.query<{ polls: Poll[] }, string>({
            query: (teacherId) => `/teacher/polls?teacherId=${teacherId}`,
            providesTags: ["Poll"],
        }),

        removeStudent: builder.mutation<
            { success: boolean },
            { pollId: string; studentName: string }
        >({
            query: ({ pollId, studentName }) => ({
                url: `/teacher/poll/${pollId}/student/${studentName}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useCreatePollMutation,
    useGetPollQuery,
    useAddQuestionMutation,
    useStartQuestionMutation,
    useJoinPollMutation,
    useGetCurrentQuestionQuery,
    useSubmitAnswerMutation,
    useGetPollResultsQuery,
    useGetPollHistoryQuery,
    useRemoveStudentMutation,
} = pollApi;
