/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        noir: "#0A0A0B",
        graphite: "#1B1C20",
        slate: "#2A2C32",
        ash: "#8E9199",
        bone: "#EDEBE6",
        acid: "#C8FF1A",
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Archivo"', "system-ui", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.06em" },
    },
  },
  plugins: [],
};
