import { useEffect, useId, useMemo, useState } from "react";
import type { Copy } from "../../i18n/copy";
import type { PlanId } from "../../data/site";

type PlanOption = { id: PlanId; name: string; ja: string; price: number; minutes: number; kind: string };

type Props = {
  t: Copy["book"];
  lang: "en" | "ja";
  plans: PlanOption[];
  email: string;
  instagramDm: string;
  maxGuests: number;
  minutesLabel: string; // "about {n} min"
};

type TimeKey = keyof Copy["book"]["times"];

const yen = (n: number) => `¥${n.toLocaleString("en-US")}`;
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

/**
 * Booking request builder. There is no booking backend, so this composes a
 * clear request and hands it to the guest's email app or Instagram DM.
 */
export default function BookingRequest({ t, lang, plans, email, instagramDm, maxGuests, minutesLabel }: Props) {
  const uid = useId();
  const [plan, setPlan] = useState<PlanId>("signature");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<TimeKey>("flexible");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [minDate, setMinDate] = useState<string>();
  const [status, setStatus] = useState<"" | "copied" | "failed">("");

  // Pick up a plan chosen from a plan card ("#book-ippuku") or a remembered draft.
  useEffect(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    setMinDate(today.toISOString().slice(0, 10));

    const fromHash = () => {
      const m = location.hash.match(/^#book-(signature|ippuku|kikicha)$/);
      if (m) setPlan(m[1] as PlanId);
    };
    fromHash();
    addEventListener("hashchange", fromHash);
    return () => removeEventListener("hashchange", fromHash);
  }, []);

  const current = plans.find((p) => p.id === plan)!;
  const total = current.price * guests;

  const prettyDate = useMemo(() => {
    if (!date) return t.flexibleDate;
    const d = new Date(`${date}T12:00:00`);
    return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-GB", {
      weekday: "short",
      year: "numeric",
      month: lang === "ja" ? "long" : "short",
      day: "numeric",
    }).format(d);
  }, [date, lang, t.flexibleDate]);

  const planLabel = `${current.name}${lang === "ja" ? `（${current.ja}）` : ` (${current.ja})`} — ${yen(current.price)} × ${guests} = ${yen(total)}`;
  const message = t.message
    .map((line) =>
      fill(line, {
        plan: planLabel,
        date: prettyDate,
        time: t.times[time],
        guests,
        name: name.trim() || t.none,
        notes: notes.trim() || t.none,
      }),
    )
    .join("\n");
  const subject = fill(t.subject, { plan: current.name, date: prettyDate });
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  const sendInstagram = async () => {
    // Copy first (the page must still have focus), then open the DM thread.
    try {
      await navigator.clipboard.writeText(message);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    const win = window.open(instagramDm, "_blank");
    if (win) win.opener = null;
  };

  const legend = "mb-3 block text-sm font-medium";

  return (
    <form className="grid gap-8" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend className={legend}>{t.plan}</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {plans.map((p) => {
            const on = p.id === plan;
            return (
              <label
                key={p.id}
                className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-colors ${
                  on ? "border-matcha bg-matcha-soft/60 ring-1 ring-matcha" : "border-line bg-[#fffdf9] hover:border-[#bfb4a1]"
                }`}
              >
                <input
                  type="radio"
                  name={`${uid}-plan`}
                  value={p.id}
                  checked={on}
                  onChange={() => setPlan(p.id)}
                  className="sr-only"
                />
                <span className="pr-7 font-display text-xl font-semibold">{p.name}</span>
                <span className="mt-1 text-sm text-ink-2">{p.kind}</span>
                <span className="mt-3 flex items-baseline justify-between text-sm">
                  <span className="font-medium text-matcha tabular-nums">{yen(p.price)}</span>
                  <span className="text-muted">{fill(minutesLabel, { n: p.minutes })}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute top-3 right-3 grid size-5 place-items-center rounded-full border text-[0.65rem] ${
                    on ? "border-matcha bg-matcha text-paper" : "border-line"
                  }`}
                >
                  {on ? "✓" : ""}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field">
          <label className="field-label" htmlFor={`${uid}-date`}>
            {t.date}
          </label>
          <input
            id={`${uid}-date`}
            type="date"
            className="input"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-describedby={`${uid}-date-hint`}
          />
          <span id={`${uid}-date-hint`} className="field-hint">
            {t.dateHint}
          </span>
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`${uid}-time`}>
            {t.time}
          </label>
          <select id={`${uid}-time`} className="input select" value={time} onChange={(e) => setTime(e.target.value as TimeKey)}>
            {(Object.keys(t.times) as TimeKey[]).map((k) => (
              <option key={k} value={k}>
                {t.times[k]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <span className="field-label" id={`${uid}-guests-label`}>
            {t.guests}
          </span>
          <div
            className="flex h-12 items-center justify-between rounded-[0.6rem] border border-line bg-[#fffdf9] p-1"
            role="group"
            aria-labelledby={`${uid}-guests-label`}
            aria-describedby={`${uid}-guests-hint`}
          >
            <button
              type="button"
              className="grid size-10 place-items-center rounded-md text-xl transition-colors hover:bg-paper-2 disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              aria-label={t.fewer}
            >
              −
            </button>
            <output className="text-lg font-medium tabular-nums" aria-live="polite">
              {guests}
            </output>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-md text-xl transition-colors hover:bg-paper-2 disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
              disabled={guests >= maxGuests}
              aria-label={t.more}
            >
              +
            </button>
          </div>
          <span id={`${uid}-guests-hint`} className="field-hint">
            {t.guestsHint}
          </span>
        </div>

        <div className="field">
          <label className="field-label" htmlFor={`${uid}-name`}>
            {t.name}
          </label>
          <input
            id={`${uid}-name`}
            className="input"
            autoComplete="name"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field sm:col-span-2">
          <label className="field-label" htmlFor={`${uid}-notes`}>
            {t.notes}
          </label>
          <textarea
            id={`${uid}-notes`}
            className="input min-h-24 resize-y"
            rows={3}
            placeholder={t.notesPlaceholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-5 rounded-2xl bg-paper-2 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm text-ink-2">{t.total}</span>
          <span className="font-display text-3xl font-semibold text-matcha tabular-nums" aria-live="polite">
            {yen(total)}
          </span>
        </div>
        <p className="-mt-3 text-right text-sm text-muted tabular-nums">
          {current.name} · {yen(current.price)} × {guests}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <a href={mailto} className="btn btn-primary w-full">
            <MailIcon />
            {t.sendEmail}
          </a>
          <button type="button" onClick={sendInstagram} className="btn btn-ghost w-full text-matcha">
            <InstagramIcon />
            {t.sendInstagram}
          </button>
        </div>
        <p role="status" className={`text-sm ${status === "failed" ? "text-[#8a3b2a]" : "text-matcha"}`}>
          {status === "copied" ? t.copied : status === "failed" ? t.copyFailed : ""}
        </p>
        <details className="group" open={status === "failed" || undefined}>
          <summary className="flex items-center gap-2 text-sm text-ink-2 hover:text-matcha">
            <span className="inline-block transition-transform group-open:rotate-90" aria-hidden="true">
              ›
            </span>
            {t.preview}
          </summary>
          <textarea
            readOnly
            value={message}
            rows={12}
            aria-label={t.preview}
            className="input mt-3 font-sans text-sm leading-relaxed"
            onFocus={(e) => e.currentTarget.select()}
          />
        </details>
      </div>
    </form>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
