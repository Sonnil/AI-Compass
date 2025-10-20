# AI Tools Knowledge Hub (React + TypeScript + Vite)

Modern, static, and self-contained website to search, compare, and collect suggestions for AI tools and agents.
- Dark mode
- Multi-feed external catalog sync (JSON)
- "New" / "Updated" badges after sync
- Ready for Netlify / Vercel / GitHub Pages

## Quick start
```bash
npm install
npm run dev
```

## Build & Preview
```bash
npm run build
npm run preview
```

## External feed
- Default catalog: `public/ai-tools-feed.json`

You can add additional feeds via the Sync button in the header; the app will merge and dedupe by tool name.

## Feed generator
```bash
npm run gen:feed
```
This command regenerates `public/ai-tools-feed.json` from the curated data.
