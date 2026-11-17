import { useState } from "react";

/**
 * Google Maps is only loaded when the visitor asks for it — keeps the page
 * fast and avoids third-party requests for people who don't need the map.
 */
export default function MapEmbed({ src, title, label, note }: { src: string; title: string; label: string; note: string }) {
  const [on, setOn] = useState(false);
  if (on) {
    return (
      <iframe
        src={src}
        title={title}
        className="size-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setOn(true)}
      className="group grid size-full place-items-center bg-[radial-gradient(circle_at_30%_30%,#e9e2d4,#ddd3c1)] text-matcha"
    >
      <span className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M12 21s-7-6.3-7-11.5A7 7 0 0 1 19 9.5C19 14.7 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
        <span className="rounded-full bg-paper px-4 py-2 text-sm font-medium shadow-sm transition-colors group-hover:bg-white">
          {label}
        </span>
        <span className="text-xs text-ink-2">{note}</span>
      </span>
    </button>
  );
}
