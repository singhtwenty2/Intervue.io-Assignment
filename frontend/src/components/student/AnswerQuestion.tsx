import { CheckCircle } from "lucide-react";
import React, { useState } from "react";
import type { Question } from "../../types";
import { Button } from "../common/Button";
import { Timer } from "../common/Timer";

interface AnswerQuestionProps {
    question: Question;
    timeRemaining: number;
    onSubmit: (selectedOption: number) => void;
}

export const AnswerQuestion: React.FC<AnswerQuestionProps> = ({
    question,
    timeRemaining,
    onSubmit,
}) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (selectedOption === null) return;

        setIsSubmitting(true);
        try {
            await onSubmit(selectedOption);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <Timer
                    timeRemaining={timeRemaining}
                    totalTime={question.timeLimit}
                    size="lg"
                />
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {question.text}
                </h2>
                <p className="text-sm text-gray-500">
                    Select your answer below:
                </p>
            </div>

            <div className="space-y-3 mb-8">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedOption(index)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                            selectedOption === index
                                ? "border-primary-purple bg-primary-purple text-white"
                                : "border-gray-200 hover:border-primary-purple hover:bg-primary-purple/5"
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                                    selectedOption === index
                                        ? "bg-white text-primary-purple"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {String.fromCharCode(65 + index)}
                            </div>
                            <span className="flex-1">{option}</span>
                            {selectedOption === index && (
                                <CheckCircle size={20} className="text-white" />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full"
                disabled={selectedOption === null || timeRemaining <= 0}
                loading={isSubmitting}
            >
                {selectedOption === null ? "Select an answer" : "Submit Answer"}
            </Button>

            {timeRemaining <= 0 && (
                <div className="mt-4 text-center">
                    <p className="text-red-600 font-medium">
                        Time's up! You can no longer submit an answer.
                    </p>
                </div>
            )}
        </div>
    );
};
