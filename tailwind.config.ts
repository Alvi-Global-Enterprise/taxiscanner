import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#197DF1",
          50: "#EBF5FF",
          100: "#D6EBFF",
          200: "#ADD6FF",
          300: "#75B8FC",
          400: "#3D9AF5",
          500: "#197DF1",
          600: "#1165D4",
          700: "#0E4FA8",
          800: "#0C3C7E",
          900: "#0A2B5A",
          dark: "#0A192F",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          soft: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(15, 23, 42, 0.08)",
        search: "0 18px 50px rgba(25, 125, 241, 0.14)",
        soft: "0 4px 20px rgba(15, 23, 42, 0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
