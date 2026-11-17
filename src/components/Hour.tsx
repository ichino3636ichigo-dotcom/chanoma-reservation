import { useState } from "react";
import { clamp, useScrollFrame } from "./useScroll";

/**
 * "The hour": a thin rail on the right that reads 17:00 → 17:59 as you scroll
 * the page. It also warms the paper colour through the middle of the page.
 */
export default function Hour() {
  const [prog, setProg] = useState(0);
  const [on, setOn] = useState(false);

  useScrollFrame((y) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = clamp(max > 0 ? y / max : 0);
    setProg(p);
    setOn(y > innerHeight * 0.7);
    document.body.classList.toggle("dusk", p > 0.12 && p < 0.86);
  });

  const mins = String(Math.floor(prog * 59)).padStart(2, "0");

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-1/2 right-[calc(var(--gut)*.55)] z-38 hidden -translate-y-1/2 flex-col items-center gap-3.5 transition-opacity duration-[2s] ease-breath min-[901px]:flex ${
        on ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="text-[0.62rem] tracking-[0.26em] text-ink-38 tabular-nums [writing-mode:vertical-rl]">
        17:{mins}
      </span>
      <div className="relative h-[min(34vh,300px)] w-px bg-hair">
        <span className="absolute -left-[3px] h-px w-[7px] bg-bronze" style={{ top: `${prog * 100}%` }} />
      </div>
    </div>
  );
}
