/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                void: '#06060e',
                deep: '#0a0a18',
                surface: '#111128',
                muted: '#1a1a3e',
                accent: '#7B61FF',
                'accent-glow': '#9d85ff',
                ghost: '#c8c2f0',
                ivory: '#eeeaf6',
            },
            fontFamily: {
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
                display: ['"Playfair Display"', 'Georgia', 'serif'],
                serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
                body: ['"EB Garamond"', 'Georgia', 'serif'],
                mono: ['"Fira Code"', 'monospace'],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            }
        },
    },
    plugins: [],
}
