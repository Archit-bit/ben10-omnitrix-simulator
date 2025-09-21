"use client";

import useOmnitrixStore from "@/lib/store";

const TimerDisplay = () => {
  const { currentState, transformationTimer, cooldownTimer } =
    useOmnitrixStore();

  if (currentState !== "transforming" && currentState !== "cooldown")
    return null;

  const timer =
    currentState === "transforming" ? transformationTimer : cooldownTimer;
  const label = currentState === "transforming" ? "Transforming" : "Cooldown";

  return (
    <div className="absolute bottom-0 left-0 right-0 text-center text-white text-sm bg-black bg-opacity-50 py-1">
      <div>
        {label}: {timer}s
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
        <div
          className="bg-green-500 h-1 rounded-full transition-all"
          style={{
            width: `${
              (timer / (currentState === "transforming" ? 60 : 30)) * 100
            }%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TimerDisplay;
