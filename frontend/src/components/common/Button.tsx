import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    children,
    loading = false,
    disabled,
    className = "",
    ...props
}) => {
    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

    const variantClasses = {
        primary:
            "bg-primary-purple hover:bg-primary-purple-dark text-white focus:ring-primary-purple",
        secondary:
            "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-300",
        danger: "bg-error-red hover:bg-red-600 text-white focus:ring-error-red",
        success:
            "bg-success-green hover:bg-green-600 text-white focus:ring-success-green",
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

    return (
        <button
            className={combinedClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
};
