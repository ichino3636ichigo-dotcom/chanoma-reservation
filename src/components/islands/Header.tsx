import { useEffect, useState } from "react";

type Link = { href: string; label: string };

type Props = {
  home: string;
  brand: string;
  links: Link[];
  book: Link;
  lang: Link & { title: string; code: string };
  labels: { menu: string; close: string };
};

/** Sticky site header with a full-screen menu on small screens. */
export default function Header({ home, brand, links, book, lang, labels }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <header
      className={`sticky top-0 z-40 border-b bg-paper/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
        scrolled || open ? "border-line shadow-[0_1px_12px_rgb(29_35_31/0.05)]" : "border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <a href={home} className="flex items-center gap-2.5" aria-label={brand}>
          <svg viewBox="0 0 100 100" className="size-8 shrink-0" aria-hidden="true">
            <path
              fill="#114a37"
              d="M52 8C72 9 90 24 92 46C94 68 82 88 60 92C40 96 22 90 12 72C3 56 8 40 18 26C27 14 38 7 52 8Z"
            />
            <circle cx="77" cy="57" r="5.2" fill="#f6f2ea" />
            <circle cx="71.5" cy="66.5" r="3.6" fill="#f6f2ea" />
            <circle cx="66" cy="73.5" r="2.4" fill="#f6f2ea" />
          </svg>
          <span className="font-display text-[1.6rem] leading-none font-medium tracking-[0.02em]">chanoma</span>
          <span className="hidden font-mincho text-sm tracking-[0.2em] text-muted sm:inline">茶乃間</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[0.9375rem] text-ink-2 transition-colors hover:text-matcha">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={lang.href}
            hrefLang={lang.code}
            title={lang.label}
            className="hidden rounded-full px-3 py-2 text-sm text-ink-2 transition-colors hover:bg-paper-2 hover:text-matcha sm:inline-flex"
          >
            {lang.title}
          </a>
          <a href={book.href} className="btn btn-primary min-h-10 px-5 py-2 text-sm">
            {book.label}
          </a>
          <button
            type="button"
            className="-mr-2 grid size-11 place-items-center rounded-full transition-colors hover:bg-paper-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.close : labels.menu}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>

      {/* Outside <header>: its backdrop-filter would trap a fixed child. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label="Main" className="container-x flex flex-col py-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 font-display text-[1.75rem] leading-tight font-medium [:lang(ja)_&]:font-mincho [:lang(ja)_&]:text-[1.375rem]"
            >
              {l.label}
            </a>
          ))}
          <a href={lang.href} className="py-5 text-ink-2 underline underline-offset-4">
            {lang.label}
          </a>
        </nav>
      </div>
    </>
  );
}
