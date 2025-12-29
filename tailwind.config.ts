import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"] ,
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f3f6ff",
          100: "#e5ecff",
          200: "#c4d4ff",
          300: "#9bb8ff",
          400: "#6a92ff",
          500: "#3a68fb",
          600: "#224ad8",
          700: "#1232a9",
          800: "#0f2a86",
          900: "#0f266e"
        },
        accent: "#16A34A"
      }
    }
  },
  plugins: []
};

export default config;
