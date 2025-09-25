import React, { useState } from "react";
import { Button } from "../common/Button";

interface CreatePollProps {
    onSubmit: (title: string) => void;
}

export const CreatePoll: React.FC<CreatePollProps> = ({ onSubmit }) => {
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            onSubmit(title.trim());
            setTitle("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create New Poll
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Poll Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title for your poll"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent outline-none transition-colors"
                        required
                    />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">
                        What happens next?
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Your poll will be created with a unique ID</li>
                        <li>• Students can join using this ID</li>
                        <li>• You can add questions and start the session</li>
                        <li>• View real-time results as students respond</li>
                    </ul>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    loading={isSubmitting}
                    disabled={!title.trim()}
                >
                    Create Poll
                </Button>
            </form>
        </div>
    );
};
