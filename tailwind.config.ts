import type { Config } from "tailwindcss";

// Google Stitch v1.0 Design Specification
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // GYM X Dribbble Design Theme Palette (Exact Sampled Colors)
        background: {
          DEFAULT: "#08080a", // Obsidian Void Black
          surface: "#111114", // Dark Matte Carbon
          elevated: "#18181d", // Elevated Card Surface
          glass: "rgba(17, 17, 20, 0.85)",
        },
        gymx: {
          bg: "#08080a",
          surface: "#111114",
          elevated: "#18181d",
          border: "#26262b",
          orange: "#ee4d00", // Signature Fiery Orange
          flame: "#ff5500", // Bright Flame
          glow: "rgba(238, 77, 0, 0.4)",
          text: "#ffffff",
          muted: "#9ca3af",
        },
        card: {
          DEFAULT: "#111114",
          hover: "#18181d",
          border: "#26262b",
        },
        brand: {
          primary: "#ee4d00",
          orange: "#ee4d00",
          flame: "#ff5500",
          glow: "rgba(238, 77, 0, 0.4)",
          accent: "#ee4d00",
          cyan: "#ee4d00",
          blue: "#ee4d00",
          emerald: "#ee4d00",
          amber: "#ee4d00",
          rose: "#ee4d00",
          purple: "#ee4d00",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#26262b",
          900: "#111114",
          950: "#08080a",
        },
      },
      borderRadius: {
        button: "8px",
        card: "12px",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "stitch-btn": "0 4px 14px 0 rgba(56, 189, 248, 0.25)",
        "stitch-card": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        "glow-cyan": "0 0 24px -2px rgba(56, 189, 248, 0.45)",
        "glow-emerald": "0 0 24px -2px rgba(16, 185, 129, 0.45)",
        "glass-card": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
