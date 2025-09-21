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
        "omni-black": "var(--color-omni-black)",
        "omni-graphite": "var(--color-omni-graphite)",
        "neon-green": "var(--color-neon-green)",
        "neon-lime": "var(--color-neon-lime)",
        "neon-cyan": "var(--color-neon-cyan)",
        "gold-bezel": "var(--color-gold-bezel)",
        "omni-white": "var(--color-omni-white)",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-soft": "var(--shadow-glow-soft)",
      },
      animation: {
        "omni-pulse": "omni-pulse 2.2s ease-in-out infinite",
        scanline: "scanline 0.1s linear infinite",
        breathing: "breathing 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
