import { BarChart3, Copy, Home, Play, Plus, Users } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Timer } from "../components/common/Timer";
import { CreatePoll } from "../components/teacher/CreatePoll";
import { PollResults } from "../components/teacher/PollResults";
import { QuestionForm } from "../components/teacher/QuestionForm";
import { StudentList } from "../components/teacher/StudentList";
import { useSocket } from "../hooks/useSocket";
import type { RootState } from "../store";
import {
    useAddQuestionMutation,
    useCreatePollMutation,
    useGetPollQuery,
    useGetPollResultsQuery,
    useRemoveStudentMutation,
    useStartQuestionMutation,
} from "../store/api/pollApi";
import { setPoll } from "../store/slices/pollSlice";
import { setNotification } from "../store/slices/uiSlice";

export const TeacherDashboard: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentPoll, currentQuestion, timeRemaining, students } =
        useSelector((state: RootState) => state.poll);

    const [activeTab, setActiveTab] = useState<
        "create" | "manage" | "results" | "history"
    >("create");
    const [showQuestionForm, setShowQuestionForm] = useState(false);

    const [createPoll] = useCreatePollMutation();
    const [addQuestion] = useAddQuestionMutation();
    const [startQuestion] = useStartQuestionMutation();
    const [removeStudent] = useRemoveStudentMutation();

    const { data: pollData } = useGetPollQuery(currentPoll?.id || "", {
        skip: !currentPoll?.id,
    });

    const { data: resultsData } = useGetPollResultsQuery(
        currentPoll?.id || "",
        {
            skip: !currentPoll?.id,
        },
    );

    useSocket(currentPoll?.id || null);

    const handleCreatePoll = async (title: string) => {
        try {
            const result = await createPoll({
                title,
                teacherId: `teacher_${Date.now()}`,
            }).unwrap();

            dispatch(
                setNotification({
                    message: "Poll created successfully!",
                    type: "success",
                }),
            );

            dispatch(
                setPoll({
                    id: result.pollId,
                    teacherId: `teacher_${Date.now()}`,
                    title,
                    createdAt: new Date().toISOString(),
                    isActive: true,
                    currentQuestionIndex: 0,
                    questions: [],
                    participants: [],
                }),
            );

            setActiveTab("manage");
        } catch (error: any) {
            dispatch(
                setNotification({
                    message: error?.data?.error || "Failed to create poll",
                    type: "error",
                }),
            );
        }
    };

    const handleAddQuestion = async (questionData: {
        text: string;
        options: string[];
        timeLimit: number;
    }) => {
        if (!currentPoll) return;

        try {
            await addQuestion({
                pollId: currentPoll.id,
                ...questionData,
            }).unwrap();

            dispatch(
                setNotification({
                    message: "Question added successfully!",
                    type: "success",
                }),
            );

            setShowQuestionForm(false);
        } catch (error: any) {
            dispatch(
                setNotification({
                    message: error?.data?.error || "Failed to add question",
                    type: "error",
                }),
            );
        }
    };

    const handleStartQuestion = async (questionId: string) => {
        if (!currentPoll) return;

        try {
            await startQuestion({
                pollId: currentPoll.id,
                questionId,
            }).unwrap();

            dispatch(
                setNotification({
                    message: "Question started!",
                    type: "success",
                }),
            );
        } catch (error: any) {
            dispatch(
                setNotification({
                    message: error?.data?.error || "Failed to start question",
                    type: "error",
                }),
            );
        }
    };

    const handleRemoveStudent = async (studentName: string) => {
        if (!currentPoll) return;

        try {
            await removeStudent({
                pollId: currentPoll.id,
                studentName,
            }).unwrap();

            dispatch(
                setNotification({
                    message: "Student removed successfully!",
                    type: "success",
                }),
            );
        } catch (error: any) {
            dispatch(
                setNotification({
                    message: error?.data?.error || "Failed to remove student",
                    type: "error",
                }),
            );
        }
    };

    const copyPollId = () => {
        if (currentPoll?.id) {
            navigator.clipboard.writeText(currentPoll.id);
            dispatch(
                setNotification({
                    message: "Poll ID copied to clipboard!",
                    type: "success",
                }),
            );
        }
    };

    const goHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold text-gray-900">
                                Teacher Dashboard
                            </h1>
                            {currentPoll && (
                                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
                                    <span className="text-sm text-gray-600">
                                        Poll ID:
                                    </span>
                                    <span className="font-mono font-semibold">
                                        {currentPoll.id}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={copyPollId}
                                    >
                                        <Copy size={14} />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Button variant="secondary" onClick={goHome}>
                            <Home size={16} className="mr-2" />
                            Home
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <nav className="flex space-x-8">
                        {[
                            { key: "create", label: "Create Poll", icon: Plus },
                            { key: "manage", label: "Manage Poll", icon: Play },
                            {
                                key: "results",
                                label: "Results",
                                icon: BarChart3,
                            },
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`flex items-center space-x-2 px-3 py-2 font-medium text-sm rounded-md ${
                                    activeTab === key
                                        ? "bg-primary-purple text-white"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <Icon size={16} />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        {activeTab === "create" && (
                            <Card>
                                <CreatePoll onSubmit={handleCreatePoll} />
                            </Card>
                        )}

                        {activeTab === "manage" && currentPoll && (
                            <div className="space-y-6">
                                <Card>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">
                                            Poll Management
                                        </h3>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <Users
                                                    size={16}
                                                    className="text-gray-500"
                                                />
                                                <span className="text-sm text-gray-600">
                                                    {students.length} students
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {currentQuestion ? (
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2">
                                                Current Question:
                                            </h4>
                                            <p className="mb-3">
                                                {currentQuestion.text}
                                            </p>
                                            <Timer
                                                timeRemaining={timeRemaining}
                                                totalTime={
                                                    currentQuestion.timeLimit
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 mb-4">
                                                No active question
                                            </p>
                                            <Button
                                                onClick={() =>
                                                    setShowQuestionForm(true)
                                                }
                                            >
                                                <Plus
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                Add Question
                                            </Button>
                                        </div>
                                    )}
                                </Card>

                                {showQuestionForm && (
                                    <Card>
                                        <QuestionForm
                                            onSubmit={handleAddQuestion}
                                            onCancel={() =>
                                                setShowQuestionForm(false)
                                            }
                                        />
                                    </Card>
                                )}

                                {pollData?.poll.questions &&
                                    pollData.poll.questions.length > 0 && (
                                        <Card>
                                            <h3 className="text-lg font-semibold mb-4">
                                                Questions
                                            </h3>
                                            <div className="space-y-3">
                                                {pollData.poll.questions.map(
                                                    (question, index) => (
                                                        <div
                                                            key={question.id}
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div>
                                                                <span className="text-sm text-gray-500">
                                                                    Q{index + 1}
                                                                    :
                                                                </span>
                                                                <span className="ml-2">
                                                                    {
                                                                        question.text
                                                                    }
                                                                </span>
                                                            </div>
                                                            {!question.isActive &&
                                                                !currentQuestion && (
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleStartQuestion(
                                                                                question.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Play
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="mr-1"
                                                                        />
                                                                        Start
                                                                    </Button>
                                                                )}
                                                            {question.isActive && (
                                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                                    Active
                                                                </span>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </Card>
                                    )}
                            </div>
                        )}

                        {activeTab === "results" && currentPoll && (
                            <Card>
                                <PollResults
                                    results={resultsData?.questions || []}
                                />
                            </Card>
                        )}

                        {activeTab === "create" && !currentPoll && (
                            <div className="text-center py-12">
                                <Plus
                                    size={48}
                                    className="mx-auto text-gray-400 mb-4"
                                />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Create Your First Poll
                                </h3>
                                <p className="text-gray-500">
                                    Get started by creating a new poll for your
                                    students.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4">
                        {currentPoll && (
                            <Card>
                                <StudentList
                                    students={students}
                                    onRemoveStudent={handleRemoveStudent}
                                />
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
