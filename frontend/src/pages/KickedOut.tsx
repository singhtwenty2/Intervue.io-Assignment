import { Home, UserX } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";

export const KickedOut: React.FC = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <Card className="text-center">
                    <div className="bg-error-red rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                        <UserX size={32} className="text-white" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Removed from Poll
                    </h1>

                    <p className="text-gray-600 mb-6">
                        You have been removed from the poll session by your
                        teacher. This could be due to connection issues or other
                        reasons.
                    </p>

                    <div className="bg-red-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-red-900 mb-2">
                            What can you do?
                        </h3>
                        <ul className="text-sm text-red-700 space-y-1 text-left">
                            <li>
                                • Contact your teacher if this was unexpected
                            </li>
                            <li>• Check your internet connection</li>
                            <li>
                                • Try joining the poll again with a new session
                            </li>
                        </ul>
                    </div>

                    <Button onClick={goHome} size="lg" className="w-full">
                        <Home size={16} className="mr-2" />
                        Go Home
                    </Button>
                </Card>
            </div>
        </div>
    );
};
