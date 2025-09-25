import { Home, Wifi, WifiOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { AnswerQuestion } from "../components/student/AnswerQuestion";
import { JoinPoll } from "../components/student/JoinPoll";
import { ResultsView } from "../components/student/ResultsView";
import { WaitingRoom } from "../components/student/WaitingRoom";
import { useSocket } from "../hooks/useSocket";
import type { RootState } from "../store";
import {
    useGetCurrentQuestionQuery,
    useJoinPollMutation,
    useSubmitAnswerMutation,
} from "../store/api/pollApi";
import { setCurrentQuestion, setStudentName } from "../store/slices/pollSlice";
import { setNotification } from "../store/slices/uiSlice";

export const StudentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentQuestion, timeRemaining, studentName } = useSelector(
        (state: RootState) => state.poll,
    );
    const { isConnected } = useSelector((state: RootState) => state.ui);

    const [pollId, setPollId] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [joinPoll] = useJoinPollMutation();
    const [submitAnswer] = useSubmitAnswerMutation();

    const { data: questionData, refetch: refetchQuestion } =
        useGetCurrentQuestionQuery(pollId, {
            skip: !pollId || !isJoined,
            pollingInterval: 2000,
        });

    useSocket(pollId, studentName);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlPollId = urlParams.get("pollId");
        if (urlPollId) {
            setPollId(urlPollId);
        }
    }, [location]);

    useEffect(() => {
        if (questionData?.question && !currentQuestion) {
            dispatch(setCurrentQuestion(questionData.question));
            setHasAnswered(false);
            setShowResults(false);
        }
    }, [questionData, dispatch, currentQuestion]);

    useEffect(() => {
        if (!currentQuestion && hasAnswered) {
            setShowResults(true);
        }
    }, [currentQuestion, hasAnswered]);

    const handleJoin = async (name: string, id: string) => {
        try {
            await joinPoll({
                pollId: id,
                studentName: name,
            }).unwrap();

            dispatch(setStudentName(name));
            setPollId(id);
            setIsJoined(true);

            dispatch(
                setNotification({
                    message: "Successfully joined the poll!",
                    type: "success",
                }),
            );

            refetchQuestion();
        } catch (error: any) {
            dispatch(
                setNotification({
                    message: error?.data?.error || "Failed to join poll",
                    type: "error",
                }),
            );
        }
    };

    const handleSubmitAnswer = async (selectedOption: number) => {
        if (!currentQuestion || !pollId || !studentName) return;

        try {
            await submitAnswer({
                pollId,
                questionId: currentQuestion.id,
                studentName,
                selectedOption,
            }).unwrap();

            setHasAnswered(true);

            dispatch(
                setNotification({
                    message: "Answer submitted successfully!",
                    type: "success",
                }),
            );
        } catch (error: any) {
            dispatch(
                setNotification({
                    message: error?.data?.error || "Failed to submit answer",
                    type: "error",
                }),
            );
        }
    };

    const goHome = () => {
        navigate("/");
    };

    const renderContent = () => {
        if (!isJoined) {
            return <JoinPoll onJoin={handleJoin} initialPollId={pollId} />;
        }

        if (currentQuestion && !hasAnswered) {
            return (
                <AnswerQuestion
                    question={currentQuestion}
                    timeRemaining={timeRemaining}
                    onSubmit={handleSubmitAnswer}
                />
            );
        }

        if (showResults) {
            return <ResultsView />;
        }

        return <WaitingRoom />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-purple to-secondary-purple">
            <nav className="bg-white/10 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold text-white">
                                Student View
                            </h1>
                            {isJoined && (
                                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
                                    {isConnected ? (
                                        <Wifi
                                            size={16}
                                            className="text-green-300"
                                        />
                                    ) : (
                                        <WifiOff
                                            size={16}
                                            className="text-red-300"
                                        />
                                    )}
                                    <span className="text-white text-sm">
                                        {isConnected
                                            ? "Connected"
                                            : "Reconnecting..."}
                                    </span>
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

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="mx-auto">{renderContent()}</Card>
            </div>
        </div>
    );
};
