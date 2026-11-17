import { useEffect, useId, useMemo, useState } from "react";
import type { OffsiteCopy } from "../../i18n/offsite";

type Props = {
  t: OffsiteCopy["form"];
  lang: "en" | "ja";
  email: string;
  instagramDm: string;
};

type FormatKey = keyof OffsiteCopy["form"]["formats"];

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

/** Off-site enquiry builder: composes the request for email or Instagram DM. */
export default function OffsiteRequest({ t, lang, email, instagramDm }: Props) {
  const uid = useId();
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [dateAlt, setDateAlt] = useState("");
  const [place, setPlace] = useState("");
  const [people, setPeople] = useState("");
  const [format, setFormat] = useState<FormatKey>("unsure");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [minDate, setMinDate] = useState<string>();
  const [status, setStatus] = useState<"" | "copied" | "failed">("");

  useEffect(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setMinDate(d.toISOString().slice(0, 10));
  }, []);

  const prettyDate = useMemo(() => {
    if (!date) return t.undecided;
    return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-GB", {
      weekday: "short",
      year: "numeric",
      month: lang === "ja" ? "long" : "short",
      day: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  }, [date, lang, t.undecided]);

  const v = (s: string) => s.trim() || t.none;
  const message = t.message
    .map((line) =>
      fill(line, {
        org: v(org),
        name: v(name),
        date: prettyDate,
        dateAlt: v(dateAlt),
        place: v(place),
        people: v(people),
        format: t.formats[format],
        budget: v(budget),
        notes: v(notes),
      }),
    )
    .join("\n");
  const subject = fill(t.subject, { org: org.trim() || name.trim() || "chanoma" });
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  const sendInstagram = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    const win = window.open(instagramDm, "_blank");
    if (win) win.opener = null;
  };

  const text = (id: string, label: string, value: string, set: (s: string) => void, extra: Record<string, string> = {}) => (
    <div className="field">
      <label className="field-label" htmlFor={`${uid}-${id}`}>
        {label}
      </label>
      <input id={`${uid}-${id}`} className="input" value={value} onChange={(e) => set(e.target.value)} {...extra} />
    </div>
  );

  return (
    <form className="grid gap-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-6 sm:grid-cols-2">
        {text("org", t.org, org, setOrg, { placeholder: t.orgPlaceholder, autoComplete: "organization" })}
        {text("name", t.name, name, setName, { placeholder: t.namePlaceholder, autoComplete: "name" })}

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
        {text("alt", t.dateAlt, dateAlt, setDateAlt, { placeholder: t.dateAltPlaceholder })}

        {text("place", t.place, place, setPlace, { placeholder: t.placePlaceholder })}
        {text("people", t.people, people, setPeople, { inputMode: "numeric", placeholder: "10" })}

        <div className="field">
          <label className="field-label" htmlFor={`${uid}-format`}>
            {t.format}
          </label>
          <select
            id={`${uid}-format`}
            className="input select"
            value={format}
            onChange={(e) => setFormat(e.target.value as FormatKey)}
          >
            {(Object.keys(t.formats) as FormatKey[]).map((k) => (
              <option key={k} value={k}>
                {t.formats[k]}
              </option>
            ))}
          </select>
        </div>
        {text("budget", t.budget, budget, setBudget, { placeholder: t.budgetPlaceholder })}

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

      <div className="grid gap-4 rounded-2xl bg-paper-2 p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <a href={mailto} className="btn btn-primary w-full">
            {t.sendEmail}
          </a>
          <button type="button" onClick={sendInstagram} className="btn btn-ghost w-full text-matcha">
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
            rows={15}
            aria-label={t.preview}
            className="input mt-3 text-sm leading-relaxed"
            onFocus={(e) => e.currentTarget.select()}
          />
        </details>
      </div>
    </form>
  );
}
