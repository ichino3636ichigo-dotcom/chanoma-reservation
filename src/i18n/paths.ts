import { url } from "../data/site";
import type { Lang } from "./copy";

export type Page = "home" | "about";

const raw: Record<Lang, Record<Page, string>> = {
  en: { home: "/", about: "/about" },
  ja: { home: "/ja", about: "/ja/about" },
};

export const path = (lang: Lang, page: Page) => url(raw[lang][page]);
export const absolute = (lang: Lang, page: Page) =>
  new URL(path(lang, page), "https://ichino3636ichigo-dotcom.github.io").href;
export const other = (lang: Lang): Lang => (lang === "en" ? "ja" : "en");
