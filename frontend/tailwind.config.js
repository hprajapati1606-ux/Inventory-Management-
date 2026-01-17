/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6', // Blue 500
                secondary: '#64748B', // Slate 500
                accent: '#8B5CF6', // Violet 500
                background: '#F1F5F9', // Slate 100
                surface: '#FFFFFF',
                text: '#1E293B', // Slate 800
            }
        },
    },
    plugins: [],
}
