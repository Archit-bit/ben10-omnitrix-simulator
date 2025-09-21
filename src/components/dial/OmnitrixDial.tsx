"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import useOmnitrixStore from "@/lib/store";
import { dispatchEvent } from "@/lib/fsm";
import Glow from "../fx/Glow";
import { Alien } from "@/types/alien";

const OmnitrixDial = () => {
  const { aliens, currentState, selectedAlienId } = useOmnitrixStore();
  const rotation = useMotionValue(0);
  const x = useTransform(rotation, [0, 360], [0, 1]);
  const scale = useTransform(x, [-0.5, 0.5], [0.95, 1.05]);

  const dialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentState !== "browsing") return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          rotateDial("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          rotateDial("right");
          break;
        case "Enter":
          e.preventDefault();
          dispatchEvent({ type: "CONFIRM_SELECTION" });
          break;
        case "Escape":
          e.preventDefault();
          dispatchEvent({ type: "DEACTIVATE_DIAL" });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentState]);

  const rotateDial = (direction: "left" | "right") => {
    const step = 360 / aliens.length;
    const current = rotation.get();
    const newRotation = direction === "left" ? current + step : current - step;
    rotation.set(newRotation % 360);

    const currentIndex = aliens.findIndex(
      (a: Alien) => a.id === selectedAlienId
    );
    const newIndex =
      direction === "left"
        ? (currentIndex + 1) % aliens.length
        : (currentIndex - 1 + aliens.length) % aliens.length;
    const newAlienId = aliens[newIndex]?.id || aliens[0].id;
    dispatchEvent({ type: "ROTATE_DIAL", alienId: newAlienId });
  };

  if (currentState === "idle") {
    return (
      <Glow intensity="soft" color="cyan">
        <motion.div
          className="relative w-64 h-64 rounded-full bg-omnitrix-black border-4 border-neon-cyan breathing-glow cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatchEvent({ type: "ACTIVATE_DIAL" })}
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan to-neon-lime opacity-20" />

          {/* Inner Safety Ring */}
          <div className="absolute inset-8 rounded-full bg-omnitrix-graphite border-2 border-gold-bezel" />

          {/* Center OLED */}
          <div className="absolute inset-16 rounded-full bg-black border-2 border-neon-green omnitrix-oled flex items-center justify-center">
            <div className="text-neon-green font-orbitron font-bold text-xl">
              OMNITRIX
            </div>
          </div>

          {/* Notch */}
          <div className="notch" />
        </motion.div>
      </Glow>
    );
  }

  return (
    <Glow intensity="strong" color="green">
      <motion.div
        className="relative w-64 h-64 rounded-full bg-omnitrix-black border-4 border-neon-green pulse-glow cursor-pointer"
        style={{ scale }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onDoubleClick={() => dispatchEvent({ type: "DEACTIVATE_DIAL" })}
      >
        {/* Outer Ring with Gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-green via-neon-lime to-neon-cyan" />

        {/* Tick Marks */}
        {Array.from({ length: 72 }, (_, i) => {
          const angle = (i / 72) * 360;
          const isThick = i % 5 === 0;
          const thickness = isThick ? "thick" : "thin";

          return (
            <motion.div
              key={i}
              className={`tick-mark ${thickness}`}
              style={{
                left: "50%",
                top: "4px",
                transform: `translateX(-50%) rotate(${angle}deg)`,
              }}
            />
          );
        })}

        {/* Inner Safety Ring */}
        <div className="absolute inset-8 rounded-full bg-omnitrix-graphite border-2 border-gold-bezel shadow-inner" />

        {/* Rotating Dial */}
        <motion.div
          className="absolute inset-8 rounded-full flex items-center justify-center"
          style={{ rotate: rotation }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Alien Silhouettes */}
          {aliens.map((alien: Alien, index: number) => (
            <motion.div
              key={alien.id}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                selectedAlienId === alien.id
                  ? "ring-2 ring-gold-bezel"
                  : "opacity-60"
              }`}
              style={{
                transform: `rotate(${
                  index * (360 / aliens.length)
                }deg) translateY(-60px) rotate(-${
                  index * (360 / aliens.length)
                }deg)`,
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() =>
                dispatchEvent({ type: "ROTATE_DIAL", alienId: alien.id })
              }
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-neon-cyan to-neon-lime flex items-center justify-center text-black font-bold text-xs shadow-neon-glow">
                {alien.name.charAt(0)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Center OLED */}
        <div className="absolute inset-16 rounded-full bg-black border-2 border-neon-green omnitrix-oled flex flex-col items-center justify-center relative z-10">
          <div className="text-neon-green font-orbitron font-bold text-sm mb-1">
            ACTIVE
          </div>
          <div className="text-xs opacity-75">SELECT ALIEN</div>
        </div>

        {/* Confirm Button */}
        {currentState === "browsing" && (
          <motion.button
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gold-bezel rounded-full flex items-center justify-center shadow-lg ring-2 ring-neon-lime"
            onClick={() => dispatchEvent({ type: "CONFIRM_SELECTION" })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="text-black font-bold text-sm">OK</div>
          </motion.button>
        )}

        {/* Notch */}
        <div className="notch" />
      </motion.div>
    </Glow>
  );
};

export default OmnitrixDial;
