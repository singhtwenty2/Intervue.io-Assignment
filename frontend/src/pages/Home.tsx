import { ArrowRight, BookOpen, Users } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { resetPoll, setIsTeacher } from "../store/slices/pollSlice";

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pollId, setPollId] = useState("");

    const handleTeacherClick = () => {
        dispatch(resetPoll());
        dispatch(setIsTeacher(true));
        navigate("/teacher");
    };

    const handleStudentClick = () => {
        if (pollId.trim()) {
            dispatch(resetPoll());
            dispatch(setIsTeacher(false));
            navigate(`/student?pollId=${pollId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-purple to-secondary-purple flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Live Polling
                    </h1>
                    <p className="text-xl text-purple-100 mb-8">
                        Create interactive polls and engage your audience in
                        real-time
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="hover:shadow-xl transition-shadow duration-300">
                        <div className="text-center">
                            <div className="bg-primary-purple rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <BookOpen size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                I'm a Teacher
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Create polls, manage questions, and view
                                real-time results from your students.
                            </p>
                            <Button
                                onClick={handleTeacherClick}
                                size="lg"
                                className="w-full group"
                            >
                                Start Teaching
                                <ArrowRight
                                    size={20}
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                />
                            </Button>
                        </div>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow duration-300">
                        <div className="text-center">
                            <div className="bg-secondary-purple rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Users size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                I'm a Student
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Join a poll session using the poll ID provided
                                by your teacher.
                            </p>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter Poll ID"
                                    value={pollId}
                                    onChange={(e) => setPollId(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent outline-none transition-colors"
                                />
                                <Button
                                    onClick={handleStudentClick}
                                    size="lg"
                                    className="w-full group"
                                    disabled={!pollId.trim()}
                                >
                                    Join Poll
                                    <ArrowRight
                                        size={20}
                                        className="ml-2 group-hover:translate-x-1 transition-transform"
                                    />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="text-center mt-12">
                    <p className="text-purple-100">
                        Experience real-time polling with instant results and
                        seamless interaction
                    </p>
                </div>
            </div>
        </div>
    );
};
