import { BarChart3, Users } from "lucide-react";
import React from "react";
import type { QuestionResult } from "../../types";

interface PollResultsProps {
    results: QuestionResult[];
}

export const PollResults: React.FC<PollResultsProps> = ({ results }) => {
    if (results.length === 0) {
        return (
            <div className="text-center py-8">
                <BarChart3 size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No results available yet</p>
                <p className="text-sm text-gray-400 mt-1">
                    Results will appear after questions are completed
                </p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 size={20} className="mr-2" />
                Poll Results
            </h3>

            <div className="space-y-8">
                {results.map((result, questionIndex) => (
                    <div
                        key={result.questionId}
                        className="bg-white border rounded-lg p-6"
                    >
                        <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">
                                Question {questionIndex + 1}:{" "}
                                {result.questionText}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500">
                                <Users size={14} className="mr-1" />
                                {result.totalResponses} response
                                {result.totalResponses !== 1 ? "s" : ""}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {result.results.map((option, optionIndex) => (
                                <div key={optionIndex} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="flex-shrink-0 w-6 h-6 bg-primary-purple text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                {String.fromCharCode(
                                                    65 + optionIndex,
                                                )}
                                            </span>
                                            <span className="font-medium">
                                                {option.option}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">
                                                {option.count} votes
                                            </span>
                                            <span className="font-bold text-primary-purple">
                                                {option.percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-primary-purple h-3 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${option.percentage}%`,
                                            }}
                                        />
                                    </div>

                                    {option.students.length > 0 && (
                                        <div className="ml-8">
                                            <details className="text-sm">
                                                <summary className="text-gray-500 cursor-pointer hover:text-gray-700">
                                                    View students (
                                                    {option.students.length})
                                                </summary>
                                                <div className="mt-2 space-y-1">
                                                    {option.students.map(
                                                        (student) => (
                                                            <div
                                                                key={student}
                                                                className="text-gray-600 ml-4"
                                                            >
                                                                • {student}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </details>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {result.totalResponses === 0 && (
                            <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                                No responses received for this question
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
