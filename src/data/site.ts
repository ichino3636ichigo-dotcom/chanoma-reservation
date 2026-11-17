// Facts about chanoma that do not depend on language.
// Prices, durations and contact details live here — change them in one place.

export const site = {
  name: "chanoma",
  nameJa: "茶乃間",
  url: "https://ichino3636ichigo-dotcom.github.io/chanoma-reservation/",
  instagram: "chanoma_teaceremony",
  email: "chanoma.teaceremony@gmail.com",
  maxGuests: 4,
  address: {
    en: ["Nishimura Flower Shop 3F", "674-10 Kamiyacho, Nakagyo-ku", "Kyoto 604-8024, Japan"],
    ja: ["〒604-8024", "京都府京都市中京区", "紙屋町674-10 西村花店 3F"],
    // what we copy to the clipboard for taxi drivers
    taxi: "〒604-8024 京都府京都市中京区紙屋町674-10 西村花店 3F",
    mapsQuery: "西村花店 京都市中京区紙屋町674-10",
  },
};

export type PlanId = "signature" | "ippuku" | "kikicha";

export const plans: { id: PlanId; name: string; ja: string; price: number; minutes: number }[] = [
  { id: "signature", name: "Signature", ja: "茶乃間 一式", price: 9000, minutes: 45 },
  { id: "ippuku", name: "Ippuku", ja: "一服", price: 5500, minutes: 30 },
  { id: "kikicha", name: "Kikicha", ja: "利き茶", price: 5500, minutes: 30 },
];

export const fromPrice = Math.min(...plans.map((p) => p.price));

export const yen = (n: number) => `¥${n.toLocaleString("en-US")}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.mapsQuery)}`;
export const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(site.address.mapsQuery)}&z=17&output=embed`;
export const instagramUrl = `https://www.instagram.com/${site.instagram}/`;
export const instagramDm = `https://ig.me/m/${site.instagram}`;

/** Prefix an absolute path with the configured base (GitHub Pages sub-path). */
export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
