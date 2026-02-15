/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "hsl(245, 58%, 51%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                background: "#F7F6F3",
                text: "#111111",
                accent: "#8B0000",
                success: {
                    DEFAULT: "#2D5A27",
                    light: "#E7F3E2",
                },
                warning: {
                    DEFAULT: "#8B6F00",
                    light: "#FFF9E6",
                },
            },
            fontFamily: {
                serif: ["'Playfair Display'", "serif"],
                sans: ["Inter", "sans-serif"],
            },
            spacing: {
                '8': '8px',
                '16': '16px',
                '24': '24px',
                '32': '32px',
                '40': '40px',
                '64': '64px',
                '80': '80px',
            },
            fontSize: {
                '10': '10px',
                '12': '12px',
                '14': '14px',
                '16': '16px',
                '18': '18px',
                '20': '20px',
                '24': '24px',
                '32': '32px',
                '40': '40px',
                '56': '56px',
            }
        },
    },
    plugins: [],
}
