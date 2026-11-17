// Colour-grade event photos so they read as one set.
//
//   node scripts/grade-photos.mjs            # photos/offsite → src/assets/images/offsite
//
// Originals stay untouched in photos/. Each photo is first neutralised
// (white balance + exposure), then given the same "chanoma" look:
// slightly warm, gently desaturated, soft contrast and lifted blacks —
// matching the washi-paper palette of the site.

import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "photos/offsite";
const OUT = "src/assets/images/offsite";

const LOOK = {
  wbStrength: 0.5, // how far to pull towards neutral grey (0–1)
  warmth: [1.06, 1.0, 0.9], // R, G, B multipliers after neutralising
  targetMid: 0.52, // median luminance we aim for
  exposureStrength: 0.6,
  gammaRange: [0.78, 1.3], // never push a photo too far either way
  blackPoint: 0.006, // percentiles used to stretch levels
  whitePoint: 0.994,
  saturation: 0.88,
  contrast: 0.12, // strength of the soft S-curve
  lift: 0.022, // matte black level
  roll: 0.975, // highlight ceiling
};

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function percentile(hist, total, p) {
  let acc = 0;
  for (let i = 0; i < hist.length; i++) {
    acc += hist[i];
    if (acc >= total * p) return i / (hist.length - 1);
  }
  return 1;
}

async function grade(file) {
  const { data, info } = await sharp(path.join(SRC, file))
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const n = info.width * info.height;
  const px = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i++) px[i] = data[i] / 255;

  // 1) white balance: grey-world on mid-tones only
  let sr = 0, sg = 0, sb = 0, cnt = 0;
  for (let i = 0; i < n; i++) {
    const r = px[i * 3], g = px[i * 3 + 1], b = px[i * 3 + 2];
    const l = lum(r, g, b);
    if (l > 0.12 && l < 0.9) { sr += r; sg += g; sb += b; cnt++; }
  }
  const mr = sr / cnt, mg = sg / cnt, mb = sb / cnt, mean = (mr + mg + mb) / 3;
  const gain = [mr, mg, mb].map((m, c) => (1 + LOOK.wbStrength * (mean / m - 1)) * LOOK.warmth[c]);

  // 2) levels + exposure from the luminance histogram
  const hist = new Uint32Array(1024);
  for (let i = 0; i < n; i++) {
    const l = clamp(lum(px[i * 3] * gain[0], px[i * 3 + 1] * gain[1], px[i * 3 + 2] * gain[2]));
    hist[Math.round(l * 1023)]++;
  }
  const lo = percentile(hist, n, LOOK.blackPoint);
  const hi = Math.max(lo + 0.2, percentile(hist, n, LOOK.whitePoint));
  const med = clamp((percentile(hist, n, 0.5) - lo) / (hi - lo));
  // gamma that moves the median towards the target, softened
  const rawGamma = Math.pow(Math.log(LOOK.targetMid) / Math.log(Math.max(0.05, Math.min(0.95, med))), LOOK.exposureStrength);
  const gamma = Math.min(LOOK.gammaRange[1], Math.max(LOOK.gammaRange[0], rawGamma));

  const out = Buffer.alloc(n * 3);
  for (let i = 0; i < n; i++) {
    let r = px[i * 3] * gain[0], g = px[i * 3 + 1] * gain[1], b = px[i * 3 + 2] * gain[2];
    // levels
    r = clamp((r - lo) / (hi - lo)); g = clamp((g - lo) / (hi - lo)); b = clamp((b - lo) / (hi - lo));
    // exposure
    r = Math.pow(r, gamma); g = Math.pow(g, gamma); b = Math.pow(b, gamma);
    // saturation
    const l = lum(r, g, b);
    r = l + (r - l) * LOOK.saturation; g = l + (g - l) * LOOK.saturation; b = l + (b - l) * LOOK.saturation;
    // soft S-curve, then matte blacks and rolled-off highlights
    const s = (v) => {
      v = clamp(v);
      const sv = v * v * (3 - 2 * v);
      v = v + (sv - v) * LOOK.contrast;
      return LOOK.lift + v * (LOOK.roll - LOOK.lift);
    };
    out[i * 3] = Math.round(s(r) * 255);
    out[i * 3 + 1] = Math.round(s(g) * 255);
    out[i * 3 + 2] = Math.round(s(b) * 255);
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUT, file));
  return { file, gamma: gamma.toFixed(2), gain: gain.map((g) => g.toFixed(2)).join("/") };
}

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f));
for (const f of files) console.log(await grade(f));
