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
      borderRadius: {
        shell: "22px",
        panel: "1rem",
      },
      colors: {
        ink: { 950: "#05060a", 900: "#0c0e14", 800: "#141824", 700: "#1e2436" },
        neon: {
          violet: "#a78bfa",
          fuchsia: "#e879f9",
          cyan: "#22d3ee",
          lime: "#bef264",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)",
        "conic-glow":
          "conic-gradient(from 180deg at 50% 50%, rgba(167,139,250,0.35) 0deg, rgba(236,72,153,0.2) 120deg, rgba(34,211,238,0.25) 240deg, rgba(167,139,250,0.35) 360deg)",
        "hero-radial":
          "radial-gradient(ellipse 80% 60% at 50% -30%, rgba(139,92,246,0.45), transparent), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(236,72,153,0.2), transparent), radial-gradient(ellipse 50% 40% at 0% 20%, rgba(34,211,238,0.15), transparent)",
        "grad-header":
          "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(236,72,153,0.1) 45%, rgba(34,211,238,0.08) 100%)",
      },
      boxShadow: {
        glow:
          "0 0 0 1px rgba(139, 92, 246, 0.25), 0 20px 60px -30px rgba(139, 92, 246, 0.45)",
        soft: "0 10px 40px -20px rgba(15, 23, 42, 0.25)",
        panel: "0 12px 36px -18px rgba(15, 23, 42, 0.22)",
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
        "float-a": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(8%, 6%) scale(1.06)" },
        },
        "float-b": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-10%, 4%) scale(1.05)" },
        },
        "float-c": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(4%, -8%) scale(1.08)" },
        },
        "border-shine": {
          "0%, 100%": { opacity: "0.9", filter: "hue-rotate(0deg)" },
          "50%": { opacity: "1", filter: "hue-rotate(25deg)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "tilt": {
          "0%, 50%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(0.7deg)" },
          "75%": { transform: "rotate(-0.7deg)" },
        },
        "ping-slow": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.18)", opacity: "0.35" },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        pulsebar: "pulsebar 1.4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "float-a": "float-a 22s ease-in-out infinite",
        "float-b": "float-b 26s ease-in-out infinite",
        "float-c": "float-c 30s ease-in-out infinite",
        "border-shine": "border-shine 8s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        "tilt": "tilt 9s ease-in-out infinite",
        "ping-slow": "ping-slow 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
