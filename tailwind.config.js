/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    900: '#0f172a',
                    800: '#1e293b',
                    100: '#f1f5f9',
                },
                blue: {
                    500: '#3b82f6',
                },
                orange: {
                    500: '#f97316',
                }
            }
        },
    },
    plugins: [],
}
