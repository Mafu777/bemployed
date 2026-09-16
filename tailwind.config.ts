import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6f1fb",
          100: "#b5d4f4",
          200: "#85b7eb",
          400: "#378add",
          600: "#185fa5",
          800: "#0c447c",
          900: "#042c53",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
