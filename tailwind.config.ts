import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "omnitrix-black": "#0a0a0a",
        "omnitrix-graphite": "#1a1a1a",
        "neon-green": "#00ff41",
        "neon-lime": "#39ff14",
        "neon-cyan": "#00ffff",
        "gold-bezel": "#ffd700",
      },
      shadows: {
        "neon-glow":
          "0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41, 0 0 20px #00ff41",
        "neon-glow-strong":
          "0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41, 0 0 40px #00ff41",
        "neon-cyan-glow": "0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff",
        "inner-shadow": "inset 0 0 10px rgba(0, 0, 0, 0.5)",
      },
      fontFamily: {
        orbitron: ["Orbitron", "monospace"],
      },
      animation: {
        scanline: "scanline 0.1s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        breathing: "breathing 3s ease-in-out infinite",
      },
      keyframes: {
        scanline: {
          "0%": { boxShadow: "inset 0 0 0 0 rgba(0, 255, 65, 0.1)" },
          "100%": { boxShadow: "inset 0 100% 0 0 rgba(0, 255, 65, 0.1)" },
        },
        "pulse-glow": {
          "0%": { boxShadow: "0 0 5px #00ff41" },
          "100%": { boxShadow: "0 0 20px #00ff41, 0 0 30px #00ff41" },
        },
        breathing: {
          "0%, 100%": { boxShadow: "0 0 10px #00ffff" },
          "50%": { boxShadow: "0 0 20px #00ffff, 0 0 30px #00ffff" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
