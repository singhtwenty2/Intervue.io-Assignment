export interface Poll {
    id: string;
    teacherId: string;
    title: string;
    createdAt: string;
    isActive: boolean;
    currentQuestionIndex: number;
    questions: Question[];
    participants: string[];
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    answers: Answer[];
    isActive: boolean;
    startTime: string;
    endTime?: string;
    timeLimit: number;
}

export interface Answer {
    studentName: string;
    selectedOption: number;
    submittedAt: string;
}

export interface QuestionResult {
    questionId: string;
    questionText: string;
    options: string[];
    results: {
        option: string;
        count: number;
        percentage: number;
        students: string[];
    }[];
    totalResponses: number;
}

export interface Student {
    name: string;
    joinedAt: string;
    hasAnswered: boolean;
    isConnected: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
