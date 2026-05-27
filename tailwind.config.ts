import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      colors: {
        ink: {
          DEFAULT: "#0b1120",
          900: "#0b1120",
          800: "#111827",
          700: "#1f2937",
          600: "#374151",
          500: "#4b5563",
          400: "#6b7280",
          300: "#9ca3af",
          200: "#d1d5db",
          100: "#e5e7eb",
          50: "#f3f4f6"
        },
        signal: {
          DEFAULT: "#0d9d6e",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#0d9d6e",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b"
        },
        cobalt: {
          DEFAULT: "#3157d5",
          50: "#eef2ff",
          100: "#e0e7ff",
          300: "#a5b4fc",
          500: "#6366f1",
          600: "#4f46e5"
        },
        amber: {
          DEFAULT: "#c37a1e",
          400: "#fbbf24",
          500: "#f59e0b"
        },
        canvas: "#f6f8fb",
        line: "#e6eaf1"
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 12px 40px -12px rgba(16,24,40,0.12)",
        card: "0 1px 0 rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        lift: "0 20px 60px -20px rgba(13,157,110,0.35)",
        glow: "0 0 0 1px rgba(13,157,110,0.25), 0 8px 30px -8px rgba(13,157,110,0.45)"
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(16,24,40,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,24,40,0.045) 1px, transparent 1px)",
        "signal-fade":
          "radial-gradient(80% 120% at 0% 0%, rgba(13,157,110,0.10) 0%, rgba(13,157,110,0) 60%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" }
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(13,157,110,0.45)" },
          "70%": { boxShadow: "0 0 0 10px rgba(13,157,110,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(13,157,110,0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
