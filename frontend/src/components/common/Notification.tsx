import { CheckCircle, Info, X, XCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { clearNotification } from "../../store/slices/uiSlice";

export const Notification: React.FC = () => {
    const dispatch = useDispatch();
    const notification = useSelector(
        (state: RootState) => state.ui.notification,
    );

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                dispatch(clearNotification());
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [notification, dispatch]);

    if (!notification) return null;

    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
    };

    const bgColors = {
        success: "bg-success-green",
        error: "bg-error-red",
        info: "bg-blue-500",
    };

    const Icon = icons[notification.type];

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColors[notification.type]} max-w-sm`}
        >
            <Icon size={20} className="mr-3 flex-shrink-0" />
            <span className="flex-1">{notification.message}</span>
            <button
                onClick={() => dispatch(clearNotification())}
                className="ml-3 flex-shrink-0 hover:opacity-80"
            >
                <X size={18} />
            </button>
        </div>
    );
};
