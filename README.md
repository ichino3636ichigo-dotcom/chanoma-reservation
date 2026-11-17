# chanoma — Tea Ceremony & Matcha Experience in Kyoto

https://ichino3636ichigo-dotcom.github.io/chanoma-reservation/

Astro + Tailwind CSS + React で作ったサイトです。

## 開発

```bash
npm install
npm run dev      # http://localhost:4321/chanoma-reservation/
npm run build    # dist/ に出力
```

## どこを編集するか

| 内容 | ファイル |
| --- | --- |
| 料金・プラン・連絡先・メニュー | `src/data/site.ts` |
| トップページ | `src/pages/index.astro` |
| About ページ | `src/pages/about.astro` |
| 色・フォント | `src/styles/global.css` |
| 動き（メニュー、ヒーロー、茶室のフェード、波紋、時計、カーソル） | `src/components/*.tsx` |
| 写真 | `src/assets/images/` |

写真は元の大きな JPG を置くだけで、ビルド時に AVIF / WebP の各サイズが自動生成されます。

## 公開

`main` に push すると GitHub Actions（`.github/workflows/deploy.yml`）がビルドして GitHub Pages に公開します。
リポジトリの Settings → Pages → Source は **GitHub Actions** にしておく必要があります。
