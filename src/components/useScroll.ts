import { useEffect, useRef } from "react";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Calls `onFrame` with the current scrollY once per animation frame while the
 * page scrolls or resizes. The callback can be redefined on every render.
 */
export function useScrollFrame(onFrame: (y: number) => void) {
  const cb = useRef(onFrame);
  cb.current = onFrame;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      cb.current(window.scrollY);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    request();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, []);
}
