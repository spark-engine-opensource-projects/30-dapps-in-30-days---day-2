/** @type {import('tailwindcss').Config} */
module.exports = {
  // You can switch darkMode to 'media' or 'class' if you plan to support dark mode
  darkMode: false,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors that mimic your styled-components palette
        primary: "#FFC107",       // Amber
        secondary: "#673AB7",     // Deep Purple
        accent: "#8BC34A",        // Light Green
        dark: "#333333",
        light: "#f9f9f9",
        background: "#fafafa",
        border: "#e0e0e0",
        text: "#555555",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        // Use Inter as your primary sans-serif font
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Custom shadow utilities that might replace some of your styled shadow rules
        soft: "0 4px 6px rgba(0, 0, 0, 0.1)",
        hard: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      // You can add additional spacing, borderRadius, or other theme extensions as needed
    },
  },
  plugins: [],
};
