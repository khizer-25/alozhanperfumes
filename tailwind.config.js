/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Light editorial luxury palette — warm, low-chroma, gold bias.
        alabaster: "#F6F3EC", // page ground
        paper: "#FFFFFF", // surfaces
        ink: "#1C1A17", // near-black text (warm)
        muted: "#6B6459", // secondary text
        line: "#E4DDCF", // hairlines
        gold: {
          DEFAULT: "#9A7B4F", // antique gold accent
          deep: "#6E5533", // hover/active
          soft: "#C9B48C", // tints, borders
        },
        // keep the old token working during migration
        "gold-legacy": "#D4AF37",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Jost"', '"Segoe UI"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.28em",
      },
      maxWidth: {
        content: "1240px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,26,23,0.04), 0 12px 32px -18px rgba(28,26,23,0.18)",
        lift: "0 24px 60px -28px rgba(28,26,23,0.32)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease both",
      },
    },
  },
  plugins: [],
};
