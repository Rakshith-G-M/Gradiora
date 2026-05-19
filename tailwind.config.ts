import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(240 12% 20%)",
        input: "hsl(240 10% 15%)",
        ring: "hsl(268 80% 65%)",
        background: "hsl(232 40% 7%)",
        foreground: "hsl(210 40% 98%)",
        card: "hsl(235 38% 10%)",
        primary: "hsl(263 100% 70%)",
        secondary: "hsl(195 100% 55%)",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      keyframes: {
        glow: { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } }
      },
      animation: {
        glow: "glow 2.5s ease-in-out infinite",
        float: "float 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
