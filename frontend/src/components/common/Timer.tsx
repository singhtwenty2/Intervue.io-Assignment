import { Clock } from "lucide-react";
import React from "react";

interface TimerProps {
    timeRemaining: number;
    totalTime: number;
    size?: "sm" | "md" | "lg";
}

export const Timer: React.FC<TimerProps> = ({
    timeRemaining,
    totalTime,
    size = "md",
}) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const percentage = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;
    const isLowTime = percentage < 25;

    const sizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <div className={`flex items-center space-x-2 ${sizeClasses[size]}`}>
            <Clock
                size={iconSizes[size]}
                className={isLowTime ? "text-error-red" : "text-gray-600"}
            />
            <span
                className={`font-mono font-semibold ${isLowTime ? "text-error-red" : "text-gray-900"}`}
            >
                {formatTime(timeRemaining)}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                        isLowTime
                            ? "bg-error-red"
                            : percentage < 50
                              ? "bg-yellow-500"
                              : "bg-success-green"
                    }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
