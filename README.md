# NAGI(SA) ドキュメント基盤の検証用サイト

Supernova からの移行案（案 B）を小さく検証するためのサイトです。2026-11-12 に作成しました。

- 移行案：[デザインシステムのドキュメント基盤：Supernova からの移行案](https://claude.ai/artifact/TAS7qyaFSvsAQStkRNAuin)
- 静的サイト：Astro Starlight 0.42（Astro 7.3）

## 起動のしかた

1. 依存パッケージを入れる

   ```bash
   npm install
   ```

2. 開発サーバーを起動する

   ```bash
   # 非公開用サイト（すべてのページ）
   npm run dev

   # 公開用サイト（visibility: private のページを除く）
   SITE_VARIANT=public npm run dev
   ```

3. ビルドする

   ```bash
   SITE_VARIANT=private npm run build   # dist-private/ に出力
   SITE_VARIANT=public npm run build    # dist-public/ に出力
   ```

### frontmatter の項目を足しても開発サーバーに反映されない場合

`src/content.config.ts` に項目を足したあと、開発サーバーで値が空のままになることがある。

- 原因：開発サーバーが、項目を足す前に読み込んだページの内容を `.astro/data-store.json` にキャッシュしている
- 対処：開発サーバーを止めて、`.astro/data-store.json` を削除してから起動し直す

## 中身

- `src/content/docs/`：Supernova から移した 7 ページ
  - NAGI(SA)デザインシステム
  - 基本要素 / デザイントークン / 色（MDX。トークンの一覧を部品で表示）
  - コンポーネント / Accordion / 概要、ガイドライン
  - ウィジェット / Sidebar / 概要、ガイドライン、React（検証のため非公開にしている）
- `src/content.config.ts`：公開範囲（`visibility: public | private`）を必須にし、公開用のビルドでは非公開のページを読み込まない
- `src/components/TokenTable.astro`：トークンの CSS から色トークンの一覧を作る部品
- `src/components/PageTitle.astro`：同じフォルダのページ（概要・ガイドライン・React）をタブで切り替える部品
  - frontmatter に `tab`（タブの名前）を書いたページが対象。並び順は `sidebar.order`
- `src/data/tokens/supernova.tailwind.css`：`nagisa-design-system/packages/nagisa-tokens` からコピーしたトークンの CSS
- `src/assets/`：Supernova からダウンロードした画像（25 枚）
- `verification/`：検証で使ったスクリプトと結果
  - `writeback.py`：Claude Docs から書き出した Markdown のうち、直した行だけを元のファイルに反映する
  - `search.mjs`：ビルドしたサイトの検索（Pagefind）を、コマンドから試す
  - `roundtrip/`：Claude Docs との行き来の検証で使った Markdown
  - `screenshots/`：画面の撮影

## 検証の結果

- 公開用と非公開用のサイトを、1 つのリポジトリから作り分けられた
- 公開範囲を書き忘れたページは、ビルドでエラーになった
- 日本語の検索で、試した 14 語すべてが該当するページに当たった
- Claude Docs を通すと、次の記述は元に戻らない
  - 画像
  - 表の中の改行（`<br>`）
  - 相対パスのリンク
- `verification/writeback.py` で直した行だけを反映すれば、上の記述は元のまま残る
