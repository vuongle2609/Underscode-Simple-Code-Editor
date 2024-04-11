/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgSecondary: "#282c34",
        bgMain: "#21252b",
        bgButtonHover: "#2c313a",
        bgButton: "#3a3f44",
        textMain: "#d1dadb",
        textSecondary: "#a7aebb",
      },
      boxShadow: {
        menu: "rgba(0,_0,_0,_0.24)_0px_3px_8px",
      },
    },
  },
  plugins: [],
};
