import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      colors: {
        ink: { 950: "#05060a", 900: "#0c0e14", 800: "#141824", 700: "#1e2436" },
        neon: {
          violet: "#a78bfa",
          fuchsia: "#e879f9",
          cyan: "#22d3ee",
          lime: "#bef264",
        },
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)",
        "conic-glow":
          "conic-gradient(from 180deg at 50% 50%, rgba(167,139,250,0.35) 0deg, rgba(236,72,153,0.2) 120deg, rgba(34,211,238,0.25) 240deg, rgba(167,139,250,0.35) 360deg)",
        "hero-radial":
          "radial-gradient(ellipse 80% 60% at 50% -30%, rgba(139,92,246,0.45), transparent), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(236,72,153,0.2), transparent), radial-gradient(ellipse 50% 40% at 0% 20%, rgba(34,211,238,0.15), transparent)",
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(167, 139, 250, 0.55)",
        card: "0 24px 80px -32px rgba(0, 0, 0, 0.65)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0,0) rotate(0deg)" },
          "33%": { transform: "translate(3%, -2%) rotate(1deg)" },
          "66%": { transform: "translate(-2%, 2%) rotate(-0.5deg)" },
        },
        pulsebar: {
          "0%, 100%": { transform: "scaleY(0.35)", opacity: "0.7" },
          "50%": { transform: "scaleY(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        pulsebar: "pulsebar 1.4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
