/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#4f46e5',
                    dark: '#4338ca',
                    light: '#6366f1',
                },
                secondary: {
                    DEFAULT: '#10b981',
                    dark: '#059669',
                    light: '#34d399',
                },
            },
        },
    },
    plugins: [],
}
