import { useRef, type ReactNode } from "react";
import { clamp, prefersReducedMotion, useScrollFrame } from "./useScroll";

/**
 * Arrival: the river photo stays pinned for one extra screen while it slowly
 * zooms out and the title fades away.
 */
export default function Hero({ image, children }: { image: ReactNode; children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const type = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);

  useScrollFrame((y) => {
    if (prefersReducedMotion() || !section.current) return;
    const p = clamp(y / (section.current.offsetHeight - innerHeight));
    if (img.current) img.current.style.transform = `scale(${(1.16 - p * 0.16).toFixed(4)})`;
    if (type.current) type.current.style.opacity = String(clamp(1 - p * 1.9));
    if (hint.current) hint.current.style.opacity = p > 0.06 ? "0" : "";
  });

  return (
    <section ref={section} id="arrival" aria-label="Arrival" className="h-[200vh] motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:relative">
        <div ref={img} className="absolute inset-0 scale-[1.16] will-change-transform motion-reduce:scale-100">
          {image}
        </div>
        {/* veil: dark on the left (desktop) / top and bottom (mobile) so the type reads */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(24_22_20/.42)_0%,rgb(24_22_20/.22)_38%,rgb(24_22_20/.30)_62%,rgb(24_22_20/.60)_100%)] md:bg-[linear-gradient(90deg,rgb(24_22_20/.74)_0%,rgb(24_22_20/.42)_42%,rgb(24_22_20/.06)_72%,transparent_100%),linear-gradient(180deg,transparent_55%,rgb(24_22_20/.45)_100%)]" />
        <div ref={type} className="absolute inset-0 grid-12 content-center px-gut text-paper">
          <div className="col-span-full md:col-[2/span_7]">{children}</div>
        </div>
        <p
          ref={hint}
          className="animate-breathe absolute bottom-[42px] left-(--gut) z-2 text-[0.62rem] tracking-[0.42em] text-paper/60 uppercase"
        >
          Scroll
        </p>
      </div>
    </section>
  );
}
