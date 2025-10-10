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

## External feeds
Add feeds via the **Sync** button in the header, or set an env var:
```
VITE_TOOLS_FEED_URL=https://your-domain.com/ai-tools-feed.json
```

## Feed generator
Run:
```bash
npm run gen:feed
```
It writes `public/ai-tools-feed.json` which you can host statically.
