import { ArrowRight, Users } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../common/Button";

interface JoinPollProps {
    onJoin: (name: string, pollId: string) => void;
    initialPollId?: string;
}

export const JoinPoll: React.FC<JoinPollProps> = ({
    onJoin,
    initialPollId = "",
}) => {
    const [name, setName] = useState("");
    const [pollId, setPollId] = useState(initialPollId);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !pollId.trim()) return;

        setIsSubmitting(true);
        try {
            await onJoin(name.trim(), pollId.trim());
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid = name.trim() && pollId.trim();

    return (
        <div className="text-center">
            <div className="bg-primary-purple rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Users size={32} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Poll</h2>
            <p className="text-gray-600 mb-8">
                Enter your name and poll ID to participate in the live session
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2 text-left"
                    >
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent outline-none transition-colors"
                        required
                        maxLength={50}
                    />
                </div>

                <div>
                    <label
                        htmlFor="pollId"
                        className="block text-sm font-medium text-gray-700 mb-2 text-left"
                    >
                        Poll ID
                    </label>
                    <input
                        type="text"
                        id="pollId"
                        value={pollId}
                        onChange={(e) => setPollId(e.target.value)}
                        placeholder="Enter the poll ID provided by your teacher"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent outline-none transition-colors font-mono"
                        required
                    />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-left">
                    <h3 className="font-medium text-blue-900 mb-1">
                        Before joining:
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>
                            • Make sure you have the correct poll ID from your
                            teacher
                        </li>
                        <li>
                            • Use your real name so your teacher can identify
                            you
                        </li>
                        <li>• Keep this page open during the entire session</li>
                    </ul>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full group"
                    loading={isSubmitting}
                    disabled={!isValid}
                >
                    Join Poll
                    <ArrowRight
                        size={20}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                </Button>
            </form>
        </div>
    );
};
