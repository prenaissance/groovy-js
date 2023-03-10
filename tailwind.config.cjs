// eslint-disable-next-line
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          contrast: "var(--primary-contrast)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)",
          contrast: "var(--secondary-contrast)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
          contrast: "var(--accent-contrast)",
        },
      },
      keyframes: {
        "show-up": {
          "0%": { opacity: 0, transform: "translateY(min(100px, 10vw))" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "hide-down": {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(min(100px, 10vw))" },
        },
        "move-text": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "show-up": "show-up 0.3s ease-out",
        "hide-down": "hide-down 0.3s ease-in",
        "move-text": "move-text 10s linear infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-roboto-mono)", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
