"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useOmnitrix } from "@/lib/omni/useOmnitrix";
import { useSfx } from "@/components/fx/Sfx";

type Alien = { id: string; name: string; icon?: string };
type Props = { aliens: Alien[]; onConfirm?: (id: string) => void };

const SIZE = 480;
const R = { outer: 200, bezel: 172, ring: 150, inner: 118, oled: 86 };

export default function OmnitrixDial({ aliens, onConfirm }: Props) {
  const [idx, setIdx] = useState(0);
  const angle = useMotionValue(0);

  const prev = () => setIdx((i) => (i - 1 + aliens.length) % aliens.length);
  const next = () => setIdx((i) => (i + 1) % aliens.length);

  // selection rotation
  useEffect(() => {
    const per = 360 / Math.max(aliens.length || 1, 1);
    animate(angle, idx * per, { duration: 0.38, ease: [0.22, 0.61, 0.36, 1] });
  }, [idx, aliens.length, angle]);

  // FSM for transform
  const omni = useOmnitrix({
    chargeMs: 1300,
    transformedMs: 1800,
    cooldownMs: 1000,
  });

  // SFX (optional)
  const sfx = useSfx({
    charge: "/sfx/charge.mp3",
    transform: "/sfx/transform.mp3",
    ready: "/sfx/ready.mp3",
  });

  // sounds on phase edges
  useEffect(() => {
    if (omni.state === "charging") sfx.play("charge");
    if (omni.state === "transformed") sfx.play("transform");
    if (omni.state === "browsing") sfx.play("ready");
  }, [omni.state]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (omni.isBusy) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Enter") handleTransform();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [omni.isBusy]);

  const handleTransform = () => {
    if (omni.isBusy) return;
    onConfirm?.(aliens[idx]?.id);
    omni.trigger();
  };

  const ticks = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => ({
        a: (i / 72) * 360,
        big: i % 6 === 0,
      })),
    []
  );

  const rotation = useTransform(angle, (a) => `rotate(${a}deg)`);
  const current = aliens[idx];

  // hourglass geometry
  const g = R.oled - 22;
  const curve = g * 0.9;
  const hourglassGreen =
    `M 0 ${-g} C ${curve} ${-g * 0.4}, ${curve} ${g * 0.4}, 0 ${g} ` +
    `C ${-curve} ${g * 0.4}, ${-curve} ${-g * 0.4}, 0 ${-g} Z`;
  const hourglassCut =
    `M 0 ${-g} C ${-curve} ${-g * 0.4}, ${-curve} ${g * 0.4}, 0 ${g} ` +
    `C ${curve} ${g * 0.4}, ${curve} ${-g * 0.4}, 0 ${-g} Z`;

  // animation helpers
  const chargeGlow = omni.state === "charging" ? 1 + omni.progress * 0.5 : 1;
  const ringSpin = omni.state === "charging" ? omni.progress * 180 : 0;
  const flash = omni.state === "transformed" ? 1 - omni.progress : 0;

  return (
    <div className="relative w-[480px] h-[480px] select-none">
      {/* aura */}
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          boxShadow: `0 0 ${140 * chargeGlow}px ${
            40 * chargeGlow
          }px rgba(0,255,102,.22)`,
        }}
      />

      <motion.svg
        width={SIZE}
        height={SIZE}
        viewBox={[-SIZE / 2, -SIZE / 2, SIZE, SIZE].join(" ")}
        className="rounded-full"
        aria-label="Omnitrix dial"
        role="group"
      >
        <defs>
          <radialGradient id="outerGlow" r="85%">
            <stop offset="0%" stopColor="var(--color-neon-lime)" />
            <stop offset="68%" stopColor="var(--color-neon-green)" />
            <stop offset="100%" stopColor="#0b0b0b" />
          </radialGradient>
          <linearGradient id="ceramic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#dfe3ea" />
          </linearGradient>
          <radialGradient id="darkRing" r="85%">
            <stop offset="0%" stopColor="#14221a" />
            <stop offset="100%" stopColor="#0a1410" />
          </radialGradient>
          <linearGradient id="tickGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe890" />
            <stop offset="100%" stopColor="#ffc107" />
          </linearGradient>
        </defs>

        {/* outer ring */}
        <circle r={R.outer} fill="url(#outerGlow)" />

        {/* lugs */}
        {([0, 90, 180, 270] as const).map((a) => (
          <g key={a} transform={`rotate(${a}) translate(0, -${R.outer + 8})`}>
            <rect
              x={-18}
              y={-36}
              width={36}
              height={52}
              rx={8}
              fill="#0a0f0c"
              stroke="#0c140f"
              strokeWidth="2"
            />
            <circle cx={0} cy={-18} r={3.5} fill="#262c28" />
            <circle cx={0} cy={10} r={3.5} fill="#262c28" />
          </g>
        ))}

        {/* bezel */}
        <circle
          r={R.bezel}
          fill="url(#ceramic)"
          stroke="#0f1215"
          strokeWidth="2"
        />

        {/* notch */}
        <polygon
          points={`0,-${R.outer + 10} -9,-${R.outer - 12} 9,-${R.outer - 12}`}
          fill="var(--color-neon-lime)"
          stroke="rgba(0,0,0,.55)"
          strokeWidth="2"
        />

        {/* tick ring */}
        <circle
          r={R.ring}
          fill="url(#darkRing)"
          stroke="rgba(0,255,110,.35)"
          strokeWidth="2"
        />

        <motion.g
          style={{ transformOrigin: "0 0", transformBox: "fill-box" }}
          animate={{ rotate: ringSpin }}
          transition={{ type: "tween", ease: "linear", duration: 0 }}
        >
          {ticks.map((t, i) => (
            <line
              key={i}
              x1="0"
              y1={-R.ring + 4}
              x2="0"
              y2={-R.ring + (t.big ? 28 : 18)}
              stroke={t.big ? "url(#tickGrad)" : "#ffe289"}
              strokeWidth={t.big ? 3 : 1.6}
              transform={`rotate(${t.a})`}
              opacity={t.big ? 0.95 : 0.72}
            />
          ))}
        </motion.g>

        {/* inner ring */}
        <circle
          r={R.inner}
          fill="#0d1914"
          stroke="rgba(0,255,110,.25)"
          strokeWidth="2"
        />

        {/* OLED */}
        <g>
          <circle r={R.oled} fill="#0b1511" className="inner-shadow" />
          <foreignObject
            x={-R.oled}
            y={-R.oled}
            width={R.oled * 2}
            height={R.oled * 2}
          >
            <div className="scanlines w-full h-full rounded-full" />
          </foreignObject>
        </g>

        {/* hourglass core */}
        <g>
          <circle
            r={R.oled - 10}
            fill="none"
            stroke={`rgba(0,255,110,${0.35 + omni.progress * 0.4})`}
            strokeWidth="4"
          />
          <motion.path
            d={hourglassGreen}
            fill="rgba(0,255,102,.9)"
            style={{ transformOrigin: "0px 0px" }}
            animate={{
              scale: omni.state === "charging" ? 1 + omni.progress * 0.05 : 1,
            }}
          />
          <path d={hourglassCut} fill="#0b1511" />
          <circle
            r={R.oled - 10}
            fill="none"
            stroke="rgba(0,0,0,.65)"
            strokeWidth="2"
          />
        </g>

        {/* flash on transform */}
        {flash > 0 && (
          <circle r={R.outer} fill={`rgba(255,255,255,${0.25 * flash})`} />
        )}

        {/* breathing highlight rim */}
        <circle
          r={R.bezel - 6}
          fill="none"
          stroke="var(--color-neon-green)"
          strokeOpacity=".45"
          strokeWidth="2"
          className="pulse"
        />
      </motion.svg>

      {/* controls */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <button
          onClick={prev}
          disabled={omni.isBusy}
          className="px-3 py-2 rounded-xl bg-[var(--color-omni-graphite)]/90 enabled:hover:scale-105 transition disabled:opacity-50"
          title="Previous (←)"
          aria-label="Previous"
        >
          ◀
        </button>

        <button
          onClick={handleTransform}
          disabled={omni.isBusy}
          className="px-6 py-2 rounded-xl bg-[var(--color-neon-green)] text-black font-semibold shadow-[var(--shadow-glow)] enabled:hover:scale-105 active:scale-95 transition disabled:opacity-60"
          title="Transform (Enter)"
          aria-label="Transform"
        >
          {omni.state === "browsing" && "Transform"}
          {omni.state === "charging" &&
            `Charging ${Math.round(omni.progress * 100)}%`}
          {omni.state === "transformed" && "Transformed!"}
          {omni.state === "cooldown" && "Cooling..."}
        </button>

        <button
          onClick={next}
          disabled={omni.isBusy}
          className="px-3 py-2 rounded-xl bg-[var(--color-omni-graphite)]/90 enabled:hover:scale-105 transition disabled:opacity-50"
          title="Next (→)"
          aria-label="Next"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
