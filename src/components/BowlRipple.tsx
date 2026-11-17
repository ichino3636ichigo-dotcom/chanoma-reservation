import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useScroll";

/** Faint rings spread across the bowl photo wherever the pointer moves. */
export default function BowlRipple() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const host = cv?.closest(".photo") as HTMLElement | null;
    const ctx = cv?.getContext("2d");
    if (!cv || !host || !ctx || prefersReducedMotion()) return;

    const dpr = devicePixelRatio || 1;
    let W = 0,
      H = 0,
      last = 0,
      live = false;
    let rings: { x: number; y: number; t: number }[] = [];

    const fit = () => {
      const r = cv.getBoundingClientRect();
      W = cv.width = r.width * dpr;
      H = cv.height = r.height * dpr;
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      rings = rings.filter((r) => r.t < 1);
      for (const r of rings) {
        r.t += 0.006;
        const e = 1 - Math.pow(1 - r.t, 3);
        ctx.beginPath();
        ctx.arc(r.x, r.y, e * 150 * dpr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245,242,236,${(1 - r.t) * 0.34})`;
        ctx.lineWidth = dpr;
        ctx.stroke();
      }
      if (rings.length) requestAnimationFrame(draw);
      else live = false;
    };
    const move = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < 220) return;
      last = now;
      const r = cv.getBoundingClientRect();
      rings.push({ x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr, t: 0 });
      if (!live) {
        live = true;
        draw();
      }
    };

    fit();
    addEventListener("resize", fit);
    host.addEventListener("pointermove", move, { passive: true });
    return () => {
      removeEventListener("resize", fit);
      host.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 z-2 size-full" />;
}
