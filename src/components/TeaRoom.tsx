import { useRef, useState, type ReactNode } from "react";
import { clamp, useScrollFrame } from "./useScroll";

/**
 * The tea room: pinned for a little over two screens; tatami → tokonoma →
 * chabana crossfade as you scroll through it.
 */
export default function TeaRoom({
  layer0,
  layer1,
  layer2,
  children,
}: {
  layer0: ReactNode;
  layer1: ReactNode;
  layer2: ReactNode;
  children: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useScrollFrame(() => {
    const el = section.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / (el.offsetHeight - innerHeight));
    setActive(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
  });

  const layer = (i: number) =>
    `absolute inset-0 transition-opacity duration-[2.4s] ease-breath motion-reduce:opacity-100 ${
      active === i ? "opacity-100" : "opacity-0"
    }`;

  return (
    <section ref={section} id="room" aria-label="The tea room" className="h-[220vh] motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:relative">
        <div className={layer(0)}>{layer0}</div>
        <div className={layer(1)}>{layer1}</div>
        <div className={layer(2)}>{layer2}</div>
        <div className="pointer-events-none absolute inset-0 grid content-center px-gut text-paper">
          {children}
        </div>
      </div>
    </section>
  );
}
