import { Alien } from "@/types/alien";
import useOmnitrixStore from "./store";
import { playSound } from "./sounds";

export type OmnitrixState =
  | "idle"
  | "browsing"
  | "selecting"
  | "transforming"
  | "cooldown";

export type OmnitrixEvent =
  | { type: "ACTIVATE_DIAL" }
  | { type: "ROTATE_DIAL"; alienId: string }
  | { type: "CONFIRM_SELECTION" }
  | { type: "INITIATE_TRANSFORM" }
  | { type: "TRANSFORM_COMPLETE" }
  | { type: "DETRANSFORM" }
  | { type: "COOLDOWN_COMPLETE" }
  | { type: "DEACTIVATE_DIAL" };

interface FSMContext {
  aliens: Alien[];
  selectedAlienId: string | null;
  transformedAlienId: string | null;
  transformationTimer: number;
  cooldownTimer: number;
}

const initialContext: FSMContext = {
  aliens: [],
  selectedAlienId: null,
  transformedAlienId: null,
  transformationTimer: 0,
  cooldownTimer: 0,
};

const fsmTransitions: Record<
  OmnitrixState,
  Partial<
    Record<
      OmnitrixEvent["type"],
      {
        state: OmnitrixState;
        context: (ctx: FSMContext, event: OmnitrixEvent) => Partial<FSMContext>;
      }
    >
  >
> = {
  idle: {
    ACTIVATE_DIAL: {
      state: "browsing",
      context: () => ({}),
    },
  },
  browsing: {
    ROTATE_DIAL: {
      state: "browsing",
      context: (ctx, event) => ({
        selectedAlienId: (event as { type: "ROTATE_DIAL"; alienId: string })
          .alienId,
      }),
    },
    CONFIRM_SELECTION: {
      state: "selecting",
      context: (ctx) => ({}),
    },
    DEACTIVATE_DIAL: {
      state: "idle",
      context: () => ({ selectedAlienId: null }),
    },
  },
  selecting: {
    INITIATE_TRANSFORM: {
      state: "transforming",
      context: (ctx) => {
        const alien = ctx.aliens.find((a) => a.id === ctx.selectedAlienId);
        return {
          transformedAlienId: ctx.selectedAlienId,
          transformationTimer: alien?.transformationDuration || 60,
        };
      },
    },
    DEACTIVATE_DIAL: {
      state: "idle",
      context: () => ({ selectedAlienId: null }),
    },
  },
  transforming: {
    TRANSFORM_COMPLETE: {
      state: "cooldown",
      context: (ctx) => ({
        transformationTimer: 0,
        cooldownTimer: 30, // Fixed cooldown of 30 seconds
      }),
    },
    DETRANSFORM: {
      state: "cooldown",
      context: (ctx) => ({
        transformedAlienId: null,
        transformationTimer: 0,
        cooldownTimer: 10, // Shorter cooldown for detransform
      }),
    },
  },
  cooldown: {
    COOLDOWN_COMPLETE: {
      state: "idle",
      context: () => ({
        transformedAlienId: null,
        cooldownTimer: 0,
      }),
    },
  },
};

export const dispatchEvent = (event: OmnitrixEvent) => {
  const store = useOmnitrixStore.getState();
  const currentState = store.currentState;
  const transition = fsmTransitions[currentState]?.[event.type];

  if (transition) {
    const newContext = transition.context(initialContext, event);
    store.setCurrentState(transition.state);
    if (newContext.selectedAlienId !== undefined)
      store.setSelectedAlienId(newContext.selectedAlienId);
    if (newContext.transformedAlienId !== undefined)
      store.setTransformedAlienId(newContext.transformedAlienId);
    if (newContext.transformationTimer !== undefined)
      store.setTransformationTimer(newContext.transformationTimer);
    if (newContext.cooldownTimer !== undefined)
      store.setCooldownTimer(newContext.cooldownTimer);

    // Play SFX based on event
    switch (event.type) {
      case "ROTATE_DIAL":
        playSound("dialRotate");
        break;
      case "CONFIRM_SELECTION":
        playSound("confirmSelection");
        break;
      case "INITIATE_TRANSFORM":
        playSound("transform");
        break;
      case "DETRANSFORM":
        playSound("detransform");
        break;
      case "TRANSFORM_COMPLETE":
        playSound("cooldownStart");
        break;
      case "COOLDOWN_COMPLETE":
        playSound("cooldownComplete");
        break;
    }
  }
};

// Timer management (to be called in useEffect or interval)
export const startTransformationTimer = () => {
  const interval = setInterval(() => {
    const store = useOmnitrixStore.getState();
    if (store.transformationTimer > 0) {
      store.setTransformationTimer(store.transformationTimer - 1);
      if (store.transformationTimer - 1 === 0) {
        dispatchEvent({ type: "TRANSFORM_COMPLETE" });
        clearInterval(interval);
      }
    }
  }, 1000);
  return interval;
};

export const startCooldownTimer = () => {
  const interval = setInterval(() => {
    const store = useOmnitrixStore.getState();
    if (store.cooldownTimer > 0) {
      store.setCooldownTimer(store.cooldownTimer - 1);
      if (store.cooldownTimer - 1 === 0) {
        dispatchEvent({ type: "COOLDOWN_COMPLETE" });
        clearInterval(interval);
      }
    }
  }, 1000);
  return interval;
};
