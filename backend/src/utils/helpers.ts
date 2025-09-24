import { customAlphabet } from "nanoid";
import { IQuestion, QuestionResult } from "../types";

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

export const generatePollId = (): string => {
    return nanoid();
};

export const generateQuestionId = (): string => {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateResults = (
    question: IQuestion,
    totalParticipants: number,
): QuestionResult => {
    const optionCounts: Map<number, string[]> = new Map();

    question.options.forEach((_, index) => {
        optionCounts.set(index, []);
    });

    question.answers.forEach((answer) => {
        const students = optionCounts.get(answer.selectedOption) || [];
        students.push(answer.studentName);
        optionCounts.set(answer.selectedOption, students);
    });

    const results = question.options.map((option, index) => {
        const students = optionCounts.get(index) || [];
        const count = students.length;
        const percentage =
            totalParticipants > 0
                ? Math.round((count / totalParticipants) * 100)
                : 0;

        return {
            option,
            count,
            percentage,
            students,
        };
    });

    return {
        questionId: question.id,
        text: question.text,
        options: question.options,
        results,
        totalResponses: question.answers.length,
        totalParticipants,
    };
};

export const validatePollTitle = (title: string): boolean => {
    return title.length >= 3 && title.length <= 100;
};

export const validateQuestion = (text: string, options: string[]): boolean => {
    if (text.length < 5 || text.length > 500) return false;
    if (options.length < 2 || options.length > 6) return false;

    for (const option of options) {
        if (option.length < 1 || option.length > 100) return false;
    }

    return true;
};

export const validateStudentName = (name: string): boolean => {
    return (
        name.length >= 2 && name.length <= 50 && /^[a-zA-Z0-9\s]+$/.test(name)
    );
};
