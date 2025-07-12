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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#09c5d8",
        p_black: "#1E1E1E",
        bg_gray: "#f3f4f6",
        secondary: "#749BC2",
        light_primary: "#e6f9fb",
      },
    },
  },
  plugins: [],
};
export default config;
