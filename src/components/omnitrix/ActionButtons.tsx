"use client";

import { motion } from "framer-motion";
import useOmnitrixStore from "@/lib/store";
import { dispatchEvent } from "@/lib/fsm";

const ActionButtons = () => {
  const { currentState, selectedAlienId, transformedAlienId } =
    useOmnitrixStore();

  const handleTransform = () => {
    if (currentState === "selecting" && selectedAlienId) {
      dispatchEvent({ type: "INITIATE_TRANSFORM" });
    }
  };

  const handleDetransform = () => {
    if (currentState === "transforming" || currentState === "cooldown") {
      dispatchEvent({ type: "DETRANSFORM" });
    }
  };

  if (currentState === "idle" || currentState === "browsing") return null;

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 mt-4">
      {currentState === "selecting" && (
        <motion.button
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg"
          onClick={handleTransform}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Transform
        </motion.button>
      )}

      {(currentState === "transforming" || currentState === "cooldown") &&
        transformedAlienId && (
          <motion.button
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg"
            onClick={handleDetransform}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Detransform
          </motion.button>
        )}
    </div>
  );
};

export default ActionButtons;
