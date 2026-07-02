import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF7",     // warm paper background
        ink: "#17241F",        // near-black deep pine, primary text
        pine: {
          50: "#EEF3EF",
          100: "#D9E5DD",
          200: "#B3CCBB",
          300: "#8CB299",
          400: "#5C9276",
          500: "#2F6F5A",      // primary brand
          600: "#255A49",
          700: "#1D4739",
          800: "#15352A",
          900: "#0E241C",
        },
        gold: {
          100: "#F6E9CC",
          300: "#E8C787",
          500: "#C99A3D",      // accent, used sparingly (CTAs, badges)
          600: "#A87C2A",
        },
        mist: "#EFF3EF",       // soft card background
        line: "#DEE5DE",       // hairline borders
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      backgroundImage: {
        contour:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
