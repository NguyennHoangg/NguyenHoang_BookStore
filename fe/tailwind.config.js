/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      // Primary Archive Palette
      primary: "#001e14",
      "primary-container": "#153328",
      "on-primary": "#ffffff",
      
      // Surface & Elevation
      surface: "#FBF9F5",
      "surface-low": "#F5F3EF",
      "surface-container-lowest": "#ffffff",
      "surface-container-low": "#F5F3EF",
      "surface-container": "#F0EEE9",
      "surface-container-highest": "#E8E6E0",
      
      // Secondary & Tertiary Accents
      secondary: "#705a49",
      "secondary-container": "#F2DDD4",
      tertiary: "#22170d",
      "on-tertiary": "#ffffff",
      
      // Semantic Colors
      "on-surface": "#1B1C1A",
      "on-surface-variant": "#49463E",
      "outline-variant": "#CCCAC4",
      error: "#ba1a1a",
      
      // Supporting colors
      white: "#ffffff",
      black: "#000000",
      transparent: "transparent",
    },
    fontFamily: {
      serif: ["Newsreader", "serif"],
      sans: ["Manrope", "sans-serif"],
    },
    fontSize: {
      // Display sizes
      "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      "display-md": ["2.8rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      "display-sm": ["2.2rem", { lineHeight: "1.2" }],
      
      // Headline sizes
      "headline-lg": ["2rem", { lineHeight: "1.25" }],
      "headline-md": ["1.75rem", { lineHeight: "1.3" }],
      "headline-sm": ["1.5rem", { lineHeight: "1.35" }],
      
      // Title sizes
      "title-lg": ["1.375rem", { lineHeight: "1.4" }],
      "title-md": ["1.125rem", { lineHeight: "1.45" }],
      "title-sm": ["1rem", { lineHeight: "1.5" }],
      
      // Body sizes
      "body-lg": ["1.125rem", { lineHeight: "1.5" }],
      "body-md": ["1rem", { lineHeight: "1.5" }],
      "body-sm": ["0.875rem", { lineHeight: "1.5" }],
      
      // Label sizes
      "label-lg": ["0.875rem", { lineHeight: "1.25" }],
      "label-md": ["0.75rem", { lineHeight: "1.25", letterSpacing: "0.04em" }],
      "label-sm": ["0.6875rem", { lineHeight: "1.25", letterSpacing: "0.05em" }],
      
      // Legacy support
      xs: ["12px", { lineHeight: "16px" }],
      sm: ["14px", { lineHeight: "20px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "28px" }],
      xl: ["20px", { lineHeight: "28px" }],
      "2xl": ["24px", { lineHeight: "32px" }],
      "3xl": ["30px", { lineHeight: "36px" }],
    },
    spacing: {
      0: "0",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      10: "40px",
      12: "48px",
      16: "64px",
      20: "80px",
      24: "96px",
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "32px",
      xl: "64px",
    },
    borderRadius: {
      none: "0px",
      sm: "2px",
      base: "4px",
      md: "8px",
      lg: "12px",
      default: "0px",
    },
    boxShadow: {
      none: "none",
      sm: "0 2px 8px rgba(27, 28, 26, 0.06)",
      md: "0 4px 16px rgba(27, 28, 26, 0.08)",
      lg: "0 12px 32px rgba(27, 28, 26, 0.1)",
      xl: "0 20px 48px rgba(27, 28, 26, 0.12)",
      // Ambient shadows for high-end feel
      ambient: "0 30px 60px rgba(27, 28, 26, 0.04)",
      hover: "0 8px 24px rgba(27, 28, 26, 0.06)",
    },
    extend: {
      fontWeight: {
        regular: "400",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      backdropBlur: {
        archive: "20px",
      },
      opacity: {
        ghost: "0.15",
        subtle: "0.05",
      },
    },
  },
  plugins: [],
}
