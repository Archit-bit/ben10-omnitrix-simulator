"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import useOmnitrixStore from "@/lib/store";
import { dispatchEvent } from "@/lib/fsm";
import { Alien } from "@/types/alien";
import Image from "next/image";

const DialMechanism = () => {
  const { aliens, currentState, selectedAlienId } = useOmnitrixStore();
  const [rotation, setRotation] = useState(0);

  const handleRotate = (direction: "left" | "right") => {
    if (currentState !== "browsing") return;

    const step = 360 / aliens.length;
    const newRotation =
      direction === "left" ? rotation + step : rotation - step;
    setRotation(newRotation % 360);

    // Cycle through aliens
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

  const handleConfirm = () => {
    if (currentState === "browsing") {
      dispatchEvent({ type: "CONFIRM_SELECTION" });
    }
  };

  if (currentState === "idle") return null;

  return (
    <motion.div
      className="absolute inset-0 rounded-full flex items-center justify-center"
      animate={{ rotate: rotation }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="w-full h-full flex items-center justify-center">
        {aliens.map((alien: Alien, index: number) => (
          <motion.div
            key={alien.id}
            className={`absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              selectedAlienId === alien.id
                ? "ring-2 ring-yellow-400"
                : "opacity-50"
            }`}
            style={{
              transform: `rotate(${
                index * (360 / aliens.length)
              }deg) translateY(-80px) rotate(-${
                index * (360 / aliens.length)
              }deg)`,
            }}
            whileHover={{ scale: 1.2 }}
            onClick={() =>
              dispatchEvent({ type: "ROTATE_DIAL", alienId: alien.id })
            }
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
              {alien.name.charAt(0)}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Confirm Button in Center */}
      {currentState === "browsing" && (
        <motion.button
          className="absolute bottom-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
          onClick={handleConfirm}
          whileTap={{ scale: 0.9 }}
        >
          <div className="text-black font-bold">OK</div>
        </motion.button>
      )}
    </motion.div>
  );
};

export default DialMechanism;
