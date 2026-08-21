/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Newsreader", "serif"],
        sans: ["Manrope", "sans-serif"],
      },
      colors: {
        primary: "#001e14",
        "primary-container": "#153328",
        "on-primary": "#ffffff",
        surface: "#FBF9F5",
        "surface-low": "#F5F3EF",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#F5F3EF",
        "surface-container": "#F0EEE9",
        "surface-container-highest": "#E8E6E0",
        secondary: "#705a49",
        "secondary-container": "#F2DDD4",
        tertiary: "#22170d",
        "on-tertiary": "#ffffff",
        "on-surface": "#1B1C1A",
        "on-surface-variant": "#49463E",
        "outline-variant": "#CCCAC4",
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["2.8rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-sm": ["2.2rem", { lineHeight: "1.2" }],
        "headline-lg": ["2rem", { lineHeight: "1.25" }],
        "headline-md": ["1.75rem", { lineHeight: "1.3" }],
        "headline-sm": ["1.5rem", { lineHeight: "1.35" }],
        "title-lg": ["1.375rem", { lineHeight: "1.4" }],
        "title-md": ["1.125rem", { lineHeight: "1.45" }],
        "title-sm": ["1rem", { lineHeight: "1.5" }],
        "body-lg": ["1.125rem", { lineHeight: "1.5" }],
        "body-md": ["1rem", { lineHeight: "1.5" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "label-lg": ["0.875rem", { lineHeight: "1.25" }],
        "label-md": ["0.75rem", { lineHeight: "1.25", letterSpacing: "0.04em" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.25", letterSpacing: "0.05em" }],
      },
      backdropBlur: {
        archive: "20px",
      },
    },
  },
  plugins: [],
}
