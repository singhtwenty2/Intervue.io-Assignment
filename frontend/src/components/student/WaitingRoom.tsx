import { Clock, Users } from "lucide-react";
import React from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const WaitingRoom: React.FC = () => {
    return (
        <div className="text-center py-8">
            <div className="bg-primary-purple rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Clock size={32} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Waiting for Question
            </h2>

            <div className="flex justify-center mb-6">
                <LoadingSpinner size="md" />
            </div>

            <div className="space-y-3 text-gray-600">
                <p>You've successfully joined the poll!</p>
                <p>Your teacher will start the next question shortly.</p>
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <Users size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-900">
                        Stay Connected
                    </span>
                </div>
                <p className="text-sm text-blue-700">
                    Keep this page open to receive the question when it starts
                </p>
            </div>

            <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary-purple rounded-full animate-bounce"></div>
                    <div
                        className="w-2 h-2 bg-primary-purple rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                        className="w-2 h-2 bg-primary-purple rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
