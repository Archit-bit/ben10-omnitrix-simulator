"use client";

import { motion, MotionProps } from "framer-motion";

interface GlowProps extends MotionProps {
  children: React.ReactNode;
  intensity?: "soft" | "strong";
  color?: "green" | "cyan" | "lime";
}

const Glow = ({
  children,
  intensity = "soft",
  color = "green",
  ...props
}: GlowProps) => {
  const glowClass =
    intensity === "strong" ? "shadow-neon-glow-strong" : "shadow-neon-glow";
  const colorClass =
    color === "cyan"
      ? "shadow-neon-cyan-glow"
      : color === "lime"
      ? "shadow-[0_0_5px_#39ff14,0_0_10px_#39ff14]"
      : "";

  return (
    <motion.div className={`relative ${glowClass} ${colorClass}`} {...props}>
      {children}
    </motion.div>
  );
};

export default Glow;
