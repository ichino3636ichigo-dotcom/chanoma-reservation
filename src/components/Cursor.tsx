import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useScroll";

/** A soft ring that trails the pointer; it grows over photos and links. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || matchMedia("(pointer: coarse)").matches) return;

    let cx = innerWidth / 2,
      cy = innerHeight / 2,
      tx = cx,
      ty = cy,
      raf = 0;

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as Element;
      el.dataset.over = t.closest("a,button") ? "link" : t.closest(".photo") ? "photo" : "";
      el.style.opacity = "1";
    };
    const loop = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      el.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true });
    loop();
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-70 hidden size-[11px] rounded-full border border-ink-38 opacity-0 mix-blend-multiply transition-[width,height,border-color,background-color] duration-900 ease-breath will-change-transform [@media(hover:hover)_and_(pointer:fine)]:block data-[over=link]:size-10 data-[over=link]:border-bronze data-[over=photo]:size-[76px] data-[over=photo]:border-paper/55 data-[over=photo]:bg-paper/5"
    />
  );
}
