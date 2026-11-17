import { useEffect, useRef, useState } from "react";
import { useScrollFrame } from "./useScroll";

type Chapter = { mark: string; label: string; href: string };

/**
 * Top bar + full-screen chapter menu. The bar stays out of the way and only
 * appears once you are past the hero and scrolling back up.
 */
export default function Nav({ chapters, home }: { chapters: Chapter[]; home: string }) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const lastY = useRef(0);

  useScrollFrame((y) => {
    const past = y > innerHeight * 0.7;
    setShow(past && y < lastY.current - 1);
    if (Math.abs(y - lastY.current) > 0.5) lastY.current = y;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const visible = show || open;
  const bar = "block h-px w-[22px] bg-ink transition-[transform,opacity] duration-800 ease-breath";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-gut py-[26px] transition-[transform,opacity] duration-1100 ease-breath ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-[104%] opacity-0"
        }`}
      >
        <a href={home} className="text-[1.05rem] tracking-[0.32em] lowercase">
          chanoma
        </a>
        <button
          type="button"
          className="flex cursor-pointer flex-col gap-[5px] p-2.5"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="sheet"
          onClick={() => setOpen((o) => !o)}
        >
          <i className={`${bar} ${open ? "translate-y-[3px] rotate-6" : ""}`} />
          <i className={`${bar} ${open ? "opacity-0" : ""}`} />
          <i className={`${bar} ${open ? "-translate-y-[3px] -rotate-6" : ""}`} />
        </button>
      </header>

      <nav
        id="sheet"
        aria-label="Chapters"
        className={`fixed inset-0 z-39 flex flex-col justify-center bg-paper px-gut transition-[opacity,visibility] duration-1100 ease-breath ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {chapters.map((c) => (
          <a
            key={c.href}
            href={c.href}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="block py-[0.28em] text-[clamp(1.6rem,3.4vw,2.8rem)] font-light text-ink-60 transition-[color,padding] duration-900 ease-breath hover:pl-[0.4em] hover:text-ink focus-visible:pl-[0.4em] focus-visible:text-ink"
          >
            <span className="mark mr-[1.4em]">{c.mark}</span>
            {c.label}
          </a>
        ))}
      </nav>
    </>
  );
}
