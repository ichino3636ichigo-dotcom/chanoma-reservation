import { url } from "../data/site";
import type { Lang } from "./copy";

export type Page = "home" | "about" | "offsite";

const raw: Record<Lang, Record<Page, string>> = {
  en: { home: "/", about: "/about", offsite: "/offsite" },
  ja: { home: "/ja", about: "/ja/about", offsite: "/ja/offsite" },
};

export const path = (lang: Lang, page: Page) => url(raw[lang][page]);
export const absolute = (lang: Lang, page: Page) =>
  new URL(path(lang, page), import.meta.env.SITE).href;
export const other = (lang: Lang): Lang => (lang === "en" ? "ja" : "en");
