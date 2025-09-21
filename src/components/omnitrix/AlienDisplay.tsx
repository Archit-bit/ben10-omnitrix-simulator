"use client";

import Image from "next/image";
import useOmnitrixStore from "@/lib/store";
import { Alien } from "@/types/alien";

interface AlienDisplayProps {
  alienId: string | null;
}

const AlienDisplay = ({ alienId }: AlienDisplayProps) => {
  const { aliens } = useOmnitrixStore();
  const alien = aliens.find((a: Alien) => a.id === alienId);

  if (!alien) {
    return (
      <div className="text-white text-center">
        <div className="w-16 h-16 bg-gray-500 rounded-full mb-2"></div>
        <div>Select an Alien</div>
      </div>
    );
  }

  return (
    <div className="text-white text-center">
      <div className="w-16 h-16 relative mb-2">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
          {alien.name.charAt(0)}
        </div>
      </div>
      <div className="font-bold">{alien.name}</div>
      <div className="text-xs opacity-75">{alien.species}</div>
    </div>
  );
};

export default AlienDisplay;
