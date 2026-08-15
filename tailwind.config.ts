import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1c1712",
        cream: "#f6f0e6",
        paper: "#fffaf3",
        gold: {
          DEFAULT: "#c4a36a",
          deep: "#9a7844",
          pale: "#e8d7b5",
        },
        rose: "#a45c66",
        sage: "#6b7f6a",
        wine: "#6b2d3c",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        soft: "0 20px 50px -24px rgba(28, 23, 18, 0.35)",
        phone: "0 30px 80px -20px rgba(28, 23, 18, 0.45)",
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
