"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import useOmnitrixStore from "@/lib/store";
import {
  dispatchEvent,
  startTransformationTimer,
  startCooldownTimer,
} from "@/lib/fsm";
import AlienDisplay from "./AlienDisplay.tsx";
import DialMechanism from "./DialMechanism.tsx";
import ActionButtons from "./ActionButtons.tsx";
import TimerDisplay from "./TimerDisplay.tsx";

const OmnitrixShell = () => {
  const {
    loadAliens,
    currentState,
    transformationTimer,
    cooldownTimer,
    selectedAlienId,
    transformedAlienId,
  } = useOmnitrixStore();

  useEffect(() => {
    loadAliens();
  }, [loadAliens]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentState === "transforming" && transformationTimer > 0) {
      interval = startTransformationTimer();
    } else if (currentState === "cooldown" && cooldownTimer > 0) {
      interval = startCooldownTimer();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentState, transformationTimer, cooldownTimer]);

  const handleActivateDial = () => {
    if (currentState === "idle") {
      dispatchEvent({ type: "ACTIVATE_DIAL" });
    }
  };

  const handleDeactivateDial = () => {
    if (currentState === "browsing" || currentState === "selecting") {
      dispatchEvent({ type: "DEACTIVATE_DIAL" });
    }
  };

  return (
    <motion.div
      className="relative w-64 h-64 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
      initial={{ scale: 0.8, rotate: 0 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleActivateDial}
      onDoubleClick={handleDeactivateDial}
    >
      {/* Omnitrix Core */}
      <div className="relative w-48 h-48 bg-black rounded-full border-4 border-yellow-400 flex items-center justify-center">
        {/* Dial Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white">
          <DialMechanism />
        </div>

        {/* Center Display */}
        <div className="w-32 h-32 bg-green-600 rounded-full flex flex-col items-center justify-center relative z-10">
          {currentState === "idle" ? (
            <div className="text-white text-lg font-bold">OMNITRIX</div>
          ) : (
            <AlienDisplay alienId={transformedAlienId || selectedAlienId} />
          )}
          <TimerDisplay />
        </div>
      </div>

      {/* Action Buttons */}
      {currentState !== "idle" && <ActionButtons />}
    </motion.div>
  );
};

export default OmnitrixShell;
