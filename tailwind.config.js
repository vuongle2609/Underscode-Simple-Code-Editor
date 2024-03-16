/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgSecondary: "#282c34",
        bgMain: "#21252b",
        bgButtonHover: "#33373b",
        bgButton: "#3a3f44",
        textSecondary: "#6e7178",
      },
    },
  },
  plugins: [],
};
