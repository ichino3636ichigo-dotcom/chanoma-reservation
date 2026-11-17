// All copy that appears in more than one place lives here.

export const site = {
  name: "chanoma",
  nameJa: "茶乃間",
  place: "3F Nishimura Flower Shop",
  city: "Kyoto",
  instagram: "chanoma_teaceremony",
  email: "chanoma.teaceremony@gmail.com",
};

export const facts = ["By reservation only", "Max 4 guests", "Fully in English"];

export type Plan = {
  name: string;
  ja?: string;
  price: string;
  what: string;
  duration: string;
};

export const plans: Plan[] = [
  {
    name: "Signature",
    price: "¥9,000",
    what: "Ippuku and Kikicha combined — the full chanoma experience.",
    duration: "~45 min",
  },
  {
    name: "Ippuku",
    ja: "一服",
    price: "¥5,500",
    what: "English lecture, a live tea-preparation demo, and hands-on matcha whisking.",
    duration: "~30 min",
  },
  {
    name: "Kikicha",
    ja: "利き茶",
    price: "¥5,500",
    what: "Compare three grades of matcha, served in whiskey tasting glasses.",
    duration: "~30 min",
  },
];

export const house = [
  { k: "Guests", v: "Up to 4 (small groups)" },
  { k: "Language", v: "Fully in English" },
  { k: "Where", v: "3F Nishimura Flower Shop<br>Kyoto" },
  { k: "Booking", v: "By reservation only" },
];

export const chapters = [
  { mark: "二", label: "The Tea Room", href: "/#room" },
  { mark: "三", label: "Preparing Matcha", href: "/#matcha" },
  { mark: "四", label: "The Plans", href: "/#plans" },
  { mark: "五", label: "Moments", href: "/#moments" },
  { mark: "六", label: "Reserve", href: "/#reserve" },
  { mark: "◦", label: "About", href: "/about" },
];

/** Prefix an absolute path with the configured base (for GitHub Pages sub-paths). */
export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
