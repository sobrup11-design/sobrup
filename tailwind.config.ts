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
          50: "#EAF7F0",
          100: "#CDEEDD",
          200: "#9EDDC0",
          300: "#68C69E",
          400: "#3EAD82",
          500: "#1E9468",      // primary brand — brighter, fresher green
          600: "#17795B",
          700: "#146143",
          800: "#124D37",      // hero background — lighter/friendlier than before
          900: "#0F3A2A",
        },
        gold: {
          100: "#FFF0CC",
          300: "#FFD980",
          500: "#F5B942",      // accent — warmer, more golden-yellow
          600: "#DB9F27",
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
