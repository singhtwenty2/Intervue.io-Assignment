/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary-purple": "#8B5CF6",
                "primary-purple-dark": "#7C3AED",
                "secondary-purple": "#A855F7",
                "light-purple": "#EDE9FE",
                "success-green": "#10B981",
                "error-red": "#EF4444",
            },
        },
    },
    plugins: [],
};
