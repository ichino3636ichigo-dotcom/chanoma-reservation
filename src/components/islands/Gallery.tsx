import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = {
  thumb: { src: string; srcset: string };
  full: { src: string; srcset: string };
  alt: string;
  width: number;
  height: number;
  /** grid placement classes for the mosaic */
  span: string;
};

type Props = {
  images: GalleryImage[];
  labels: { open: string; prev: string; next: string; close: string };
};

/** Photo mosaic that opens a keyboard- and swipe-friendly lightbox. */
export default function Gallery({ images, labels }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number, el: HTMLButtonElement) => {
    lastTrigger.current = el;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null) {
      if (d.open) d.close();
      lastTrigger.current?.focus();
      lastTrigger.current = null;
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [index, step]);

  const img = index === null ? null : images[index];

  return (
    <>
      <ul className="grid auto-rows-[9rem] grid-cols-2 gap-2 sm:auto-rows-[12rem] sm:gap-3 md:grid-cols-4 md:auto-rows-[11rem] lg:auto-rows-[13rem]">
        {images.map((im, i) => (
          <li key={im.full.src} className={im.span}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group relative block size-full overflow-hidden rounded-lg bg-paper-3"
              aria-label={`${labels.open}: ${im.alt}`}
            >
              <img
                src={im.thumb.src}
                srcSet={im.thumb.srcset}
                sizes="(min-width: 768px) 25vw, 50vw"
                alt=""
                loading="lazy"
                decoding="async"
                width={im.width}
                height={im.height}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-calm group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={close}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label={img?.alt}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-night/95 p-0 text-paper backdrop:bg-transparent"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {img && (
          <div className="grid h-full grid-rows-[auto_1fr_auto]" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="flex items-center justify-between p-3 sm:p-4">
              <span className="pl-2 text-sm text-paper/70 tabular-nums">
                {index! + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={close}
                className="grid size-11 place-items-center rounded-full text-2xl hover:bg-paper/10"
                aria-label={labels.close}
                autoFocus
              >
                ×
              </button>
            </div>
            <figure className="relative mx-auto flex min-h-0 w-full max-w-5xl flex-col items-center justify-center px-4">
              <img
                key={img.full.src}
                src={img.full.src}
                srcSet={img.full.srcset}
                sizes="(min-width: 1024px) 60vw, 100vw"
                alt={img.alt}
                className="max-h-[78dvh] w-auto max-w-full rounded-md object-contain"
              />
              <figcaption className="mt-3 text-center text-sm text-paper/80">{img.alt}</figcaption>
            </figure>
            <div className="flex justify-center gap-3 p-4">
              <button
                type="button"
                onClick={() => step(-1)}
                className="grid size-12 place-items-center rounded-full border border-paper/30 text-xl hover:bg-paper/10"
                aria-label={labels.prev}
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="grid size-12 place-items-center rounded-full border border-paper/30 text-xl hover:bg-paper/10"
                aria-label={labels.next}
              >
                →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
