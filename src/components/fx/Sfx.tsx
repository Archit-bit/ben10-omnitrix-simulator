// src/components/fx/Sfx.tsx
// FULL FILE — minimal SFX helper; safe if files are missing.

"use client";
import { useEffect, useMemo } from "react";

type Map = Partial<Record<"charge" | "transform" | "ready", string>>;

export function useSfx(urls: Map = {}) {
  const sounds = useMemo(() => {
    // lazy require to avoid SSR issues if howler isn't installed
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { Howl } = require("howler");
      return {
        charge: urls.charge
          ? new Howl({ src: [urls.charge], volume: 0.5 })
          : null,
        transform: urls.transform
          ? new Howl({ src: [urls.transform], volume: 0.6 })
          : null,
        ready: urls.ready ? new Howl({ src: [urls.ready], volume: 0.5 }) : null,
      };
    } catch {
      return { charge: null, transform: null, ready: null };
    }
  }, [urls.charge, urls.transform, urls.ready]);

  const play = (key: keyof Map) => {
    const s = sounds[key];
    if (s && s.play) s.play();
  };

  // free howls on unmount
  useEffect(
    () => () => {
      Object.values(sounds).forEach((s: any) => s?.unload && s.unload());
    },
    [sounds]
  );

  return { play };
}
