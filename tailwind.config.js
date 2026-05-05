export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bosque: {
          50: "#f0f7eb",
          100: "#d6ecc4",
          200: "#aed98a",
          300: "#85c252",
          400: "#5fa832",
          500: "#3d8a1a",
          600: "#2D5A1B",
          700: "#1e3d12",
          800: "#14280c",
          900: "#0a1506",
        },
        crema: "#F5F2EB",
        manteca: "#EDE8DC",
        carbon: "#1C1C1A",
        oliva: "#4A5240",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
