import { BarChart3, CheckCircle } from "lucide-react";
import React from "react";

export const ResultsView: React.FC = () => {
    return (
        <div className="text-center py-8">
            <div className="bg-success-green rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle size={32} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Answer Submitted!
            </h2>

            <div className="space-y-3 text-gray-600 mb-8">
                <p>Your answer has been recorded successfully.</p>
                <p>
                    Your teacher will share the results when the question ends.
                </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <BarChart3 size={16} className="text-green-600" />
                    <span className="font-medium text-green-900">
                        What's Next?
                    </span>
                </div>
                <p className="text-sm text-green-700">
                    Wait for your teacher to reveal the results or start the
                    next question
                </p>
            </div>

            <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
                    <div
                        className="w-2 h-2 bg-success-green rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                        className="w-2 h-2 bg-success-green rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
