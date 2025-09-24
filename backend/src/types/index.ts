export interface IAnswer {
    studentName: string;
    selectedOption: number;
    submittedAt: Date;
}

export interface IQuestion {
    id: string;
    text: string;
    options: string[];
    answers: IAnswer[];
    isActive: boolean;
    startTime?: Date;
    endTime?: Date;
    timeLimit: number;
}

export interface IPoll {
    _id?: string;
    teacherId: string;
    title: string;
    createdAt: Date;
    isActive: boolean;
    currentQuestionIndex: number;
    questions: IQuestion[];
    participants: string[];
}

export interface ISession {
    _id?: string;
    pollId: string;
    studentName: string;
    socketId: string;
    joinedAt: Date;
    isActive: boolean;
}

export interface QuestionResult {
    questionId: string;
    text: string;
    options: string[];
    results: Array<{
        option: string;
        count: number;
        percentage: number;
        students: string[];
    }>;
    totalResponses: number;
    totalParticipants: number;
}

export interface SocketData {
    pollId?: string;
    role?: "teacher" | "student";
    studentName?: string;
}
