# chanoma — Tea Ceremony & Matcha Experience in Kyoto

- English: https://ichino3636ichigo-dotcom.github.io/chanoma-reservation/
- 日本語: https://ichino3636ichigo-dotcom.github.io/chanoma-reservation/ja

Astro + Tailwind CSS + React で作ったサイトです。英語と日本語の2言語。

## 開発

```bash
npm install
npm run dev      # http://localhost:4321/chanoma-reservation/
npm run build    # dist/ に出力
```

## どこを編集するか

| 内容 | ファイル |
| --- | --- |
| 料金・所要時間・住所・連絡先 | `src/data/site.ts` |
| 文章（英語・日本語）、FAQ、プランの内容 | `src/i18n/copy.ts` |
| トップページの構成 | `src/components/Home.astro` |
| 茶乃間についてページ | `src/components/About.astro` |
| ヘッダー・フッター・meta | `src/layouts/Base.astro` |
| 色・フォント | `src/styles/global.css` |
| 写真 | `src/assets/images/` |

## 動く部品（React アイランド）

| 部品 | 役割 |
| --- | --- |
| `Header` | 追従ヘッダーとスマホ用メニュー |
| `BookingRequest` | 予約リクエスト作成。メール（mailto）か Instagram DM に送る文面を組み立てる |
| `Gallery` | 茶室の写真一覧と拡大表示（キーボード・スワイプ対応） |
| `MapEmbed` | 押したときだけ Google マップを読み込む |
| `CopyButton` | タクシー用の日本語住所をコピー |
| `MobileBookBar` | スマホで画面下に出る予約ボタン |

予約システム（サーバー）はありません。フォームは送信内容を組み立てて、お客様のメールアプリや Instagram に渡すだけです。

## 公開

`main` に push すると GitHub Actions（`.github/workflows/deploy.yml`）がビルドして GitHub Pages に公開します。
