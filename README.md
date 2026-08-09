# StockManifest — Multi-Store Inventory Sync Dashboard

A multi-vendor, multi-store inventory synchronization dashboard. It reconciles stock feeds from
multiple vendors (each shipping CSVs in their own format) against export files from multiple
storefronts, flags low stock, and keeps a persisted audit log of every sync run.

**[Live demo →](#)** _(add your GitHub Pages URL here after deploying)_

Click **"Load sample data"** on the Sync tab to see a full run instantly — no files to upload.

## Features

- **Multi-vendor sync engine** — each vendor's CSV column names are mapped to a common schema
  before matching, so adding a new vendor is a config change, not new code.
- **Multi-store reconciliation** — matches items by SKU across any number of storefront exports
  and updates on-hand quantities against the vendor's stock truth.
- **Analytics dashboard** — inventory by store, matched vs. unmatched rate, and sync history,
  charted with Chart.js.
- **Low-stock alerts** — adjustable threshold, split into warning / critical severity.
- **Audit log** — every sync run is recorded and persisted in the browser (localStorage), so
  history survives a refresh.
- **CSV / ZIP export** — download reconciled results per store or all stores at once.

## Tech stack

React 18 · Vite · Tailwind CSS v4 · Chart.js (react-chartjs-2) · PapaParse · JSZip

This is intentionally a client-side application — there's no backend or database. All "syncing"
happens in the browser against the CSVs you provide (or the bundled sample data), and history is
kept in `localStorage`. That keeps it free and simple to host on GitHub Pages, with no server to
maintain.

## Running locally

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and
deploys automatically on every push to `main`. See the setup steps in the project instructions,
or:

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` — the workflow builds and publishes to
   `https://<username>.github.io/<repo-name>/`.

If you rename the repo, update `base` in `vite.config.js` to match.

## Data model

- **Vendor feed** (`SKU`/equivalent, name, quantity available) — one file per vendor, in that
  vendor's own column format (see `src/data/vendors.js` for the mapping).
- **Store export** (`Handle`, `Title`, `SKU`, `On Hand`) — one file per store, all sharing the
  same schema.
- **Reconciliation**: for each store item, look up its SKU in the combined vendor feed. If found,
  the store's on-hand count is updated to match the vendor's reported quantity and flagged
  `Matched`; if not found (e.g. a discontinued SKU), it's flagged `Unmatched` and left as-is.

All vendor and store names in the sample data are fictional.
