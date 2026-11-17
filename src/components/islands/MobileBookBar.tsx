import { useEffect, useState } from "react";

/**
 * A small "Book" bar pinned to the bottom of phones. It appears after the hero
 * and steps aside while the booking form itself is on screen.
 */
export default function MobileBookBar({ href, label, price }: { href: string; label: string; price: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const book = document.getElementById("book");
    let pastHero = false;
    let atBook = false;
    const update = () => setShow(pastHero && !atBook);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === book) atBook = e.isIntersecting;
      }
      update();
    });
    hero && io.observe(hero);
    book && io.observe(book);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-ink-2">{price}</span>
        <a href={href} className="btn btn-primary min-h-11 flex-1 py-2" tabIndex={show ? 0 : -1}>
          {label}
        </a>
      </div>
    </div>
  );
}
