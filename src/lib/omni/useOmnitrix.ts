// src/lib/omni/useOmnitrix.ts
// FULL FILE — tiny FSM hook for the Omnitrix transform cycle.

import { useCallback, useEffect, useRef, useState } from "react";

export type OmniState = "browsing" | "charging" | "transformed" | "cooldown";
export type OmniTimes = {
  chargeMs: number;
  transformedMs: number;
  cooldownMs: number;
};

export function useOmnitrix(times: Partial<OmniTimes> = {}) {
  const cfg: OmniTimes = {
    chargeMs: times.chargeMs ?? 1400,
    transformedMs: times.transformedMs ?? 2200,
    cooldownMs: times.cooldownMs ?? 1200,
  };

  const [state, setState] = useState<OmniState>("browsing");
  const [progress, setProgress] = useState(0); // 0..1 for the active phase
  const raf = useRef<number | null>(null);
  const phaseStart = useRef<number>(0);

  const stop = () => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
  };

  const runPhase = useCallback((dur: number, next: OmniState) => {
    stop();
    phaseStart.current = performance.now();
    const tick = () => {
      const t = performance.now() - phaseStart.current;
      const p = Math.min(1, t / dur);
      setProgress(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setState(next);
        setProgress(0);
      }
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  const trigger = useCallback(() => {
    if (state !== "browsing") return;
    setState("charging");
    runPhase(cfg.chargeMs, "transformed");
  }, [state, runPhase, cfg.chargeMs]);

  // auto advance transformed -> cooldown -> browsing
  useEffect(() => {
    if (state === "transformed") runPhase(cfg.transformedMs, "cooldown");
    if (state === "cooldown") runPhase(cfg.cooldownMs, "browsing");
    return stop;
  }, [state, runPhase, cfg.transformedMs, cfg.cooldownMs]);

  return { state, progress, trigger, isBusy: state !== "browsing" };
}
