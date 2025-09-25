import { useCallback, useEffect, useState } from "react";

export const useTimer = (initialTime: number, onComplete?: () => void) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);

    const start = useCallback(() => {
        setIsActive(true);
    }, []);

    const stop = useCallback(() => {
        setIsActive(false);
    }, []);

    const reset = useCallback(
        (newTime: number = initialTime) => {
            setTimeRemaining(newTime);
            setIsActive(false);
        },
        [initialTime],
    );

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    if (prevTime <= 1) {
                        setIsActive(false);
                        onComplete?.();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive, timeRemaining, onComplete]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return {
        timeRemaining,
        isActive,
        start,
        stop,
        reset,
        formatTime: formatTime(timeRemaining),
    };
};
