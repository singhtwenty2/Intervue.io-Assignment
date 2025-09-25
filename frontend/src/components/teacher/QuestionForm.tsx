import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../common/Button";

interface QuestionFormProps {
    onSubmit: (data: {
        text: string;
        options: string[];
        timeLimit: number;
    }) => void;
    onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
    onSubmit,
    onCancel,
}) => {
    const [text, setText] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [timeLimit, setTimeLimit] = useState(60);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validOptions = options.filter((opt) => opt.trim());
        if (!text.trim() || validOptions.length < 2) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                text: text.trim(),
                options: validOptions,
                timeLimit,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid =
        text.trim() && options.filter((opt) => opt.trim()).length >= 2;

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Question
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="question"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Question Text
                    </label>
                    <textarea
                        id="question"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your question here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent outline-none transition-colors resize-none"
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options
                    </label>
                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) =>
                                        updateOption(index, e.target.value)
                                    }
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent outline-none transition-colors"
                                    required
                                />
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="flex-shrink-0 p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {options.length < 6 && (
                        <button
                            type="button"
                            onClick={addOption}
                            className="mt-3 flex items-center text-sm text-primary-purple hover:text-primary-purple-dark"
                        >
                            <Plus size={16} className="mr-1" />
                            Add Option
                        </button>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="timeLimit"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Time Limit (seconds)
                    </label>
                    <select
                        id="timeLimit"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent outline-none transition-colors"
                    >
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                        <option value={90}>1.5 minutes</option>
                        <option value={120}>2 minutes</option>
                        <option value={180}>3 minutes</option>
                        <option value={300}>5 minutes</option>
                    </select>
                </div>

                <div className="flex space-x-3">
                    <Button
                        type="submit"
                        disabled={!isValid}
                        loading={isSubmitting}
                        className="flex-1"
                    >
                        Add Question
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};
