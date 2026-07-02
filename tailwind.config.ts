import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        ink: "#111110",
        paper: "#F7F4F0",
        clay: "#BF4A2B",
        ash: "#8A857E",
        "ash-light": "#C4C0BB",
        rule: "#E2DDD8",
        moss: "#4A7C59",
      },
      letterSpacing: {
        "tight-display": "-0.04em",
        "loose-body": "0.025em",
      },
    },
  },
  plugins: [],
};

export default config;
