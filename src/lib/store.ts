import { create } from "zustand";
import { Alien } from "@/types/alien";
import aliensData from "@/data/aliens.json";

interface OmnitrixState {
  aliens: Alien[];
  currentState: "idle" | "browsing" | "selecting" | "transforming" | "cooldown";
  selectedAlienId: string | null;
  transformedAlienId: string | null;
  transformationTimer: number;
  cooldownTimer: number;
  isTransformed: boolean;
}

interface OmnitrixActions {
  loadAliens: () => void;
  setCurrentState: (state: OmnitrixState["currentState"]) => void;
  setSelectedAlienId: (id: string | null) => void;
  setTransformedAlienId: (id: string | null) => void;
  setTransformationTimer: (time: number) => void;
  setCooldownTimer: (time: number) => void;
  setIsTransformed: (transformed: boolean) => void;
  resetTimers: () => void;
}

type OmnitrixStore = OmnitrixState & OmnitrixActions;

const useOmnitrixStore = create<OmnitrixStore>((set, get) => ({
  aliens: [],
  currentState: "idle",
  selectedAlienId: null,
  transformedAlienId: null,
  transformationTimer: 0,
  cooldownTimer: 0,
  isTransformed: false,

  loadAliens: () => {
    set({ aliens: aliensData as Alien[] });
  },

  setCurrentState: (state) => set({ currentState: state }),

  setSelectedAlienId: (id) => set({ selectedAlienId: id }),

  setTransformedAlienId: (id) => set({ transformedAlienId: id }),

  setTransformationTimer: (time) => set({ transformationTimer: time }),

  setCooldownTimer: (time) => set({ cooldownTimer: time }),

  setIsTransformed: (transformed) => set({ isTransformed: transformed }),

  resetTimers: () => {
    set({ transformationTimer: 0, cooldownTimer: 0 });
  },
}));

export default useOmnitrixStore;
