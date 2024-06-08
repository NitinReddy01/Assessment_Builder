/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: "#e9fbf0",
                    200: '#d7fac4',
                    500: '#6ab144',
                    800: "#356d18"
                },
                neutral: {
                    100: "#ffffff",
                    300: '#f5f4f4',
                    400: '#ebece9',
                    500: '#dbddd9',
                    600: '#8f978b',
                    700: '#50564d',
                    800: '#161b13'
                },
                success: {
                    800: '#6ab144',
                    200: '#d7fac4'
                },
                error: {
                    800: '#e94b4b',
                    200: '#fde8e8'
                },
                pending: {
                    800: '#e07900',
                    200: '#fff1e1'
                },
                blue: {
                    800: '#4395f5',
                    200: '#e5f1ff',
                    100: 'e5f1ff'
                },
                orange: {
                    800: '#9a3412',
                    200: '#fed7aa',
                    100: '#ffedd5'

                }
            }
        },
    },
    plugins: [],
};