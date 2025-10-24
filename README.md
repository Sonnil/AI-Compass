````markdown
# AI Tools Knowledge Hub (React + TypeScript + Vite)

Modern, static, and self-contained website to search, compare, and collect suggestions for AI tools and agents.

## Key Features
- 🔍 **Smart Search & Filters** - Find tools by name, features, or capabilities
- 📊 **Tool Comparison** - Side-by-side comparison of features and capabilities
- 💬 **SONA AI Assistant** - Intelligent chatbot with comprehensive knowledge
  - AI tools catalog expertise (26 tools)
  - **Analytics & Data Analysis** - Ask for insights, statistics, and comparisons
  - Platform features and navigation guidance
  - Sanofi company information and news
  - AI facts, tips, jokes, and educational content
- 📈 **Analytics Dashboard** - Visualize tool capabilities and performance metrics
- 🌐 **8 Languages** - English, Français, Español, Deutsch, Português, 中文, 日本語, Tiếng Việt
- 🌙 **Dark/Light Mode** - Comfortable viewing in any lighting
- 📱 **Mobile-Responsive** - Optimized for all devices
- 🔄 **Multi-feed Sync** - External catalog integration (JSON)
- 🏷️ **Smart Badges** - "New" / "Updated" indicators after sync
- 🚀 **Ready to Deploy** - Netlify / Vercel / GitHub Pages compatible

## SONA Analytics Capabilities (NEW!)

SONA can now analyze tool data and provide comprehensive insights:
- **Capability Analysis** - 8-dimension scoring (Code Generation, Data Analysis, Content Creation, etc.)
- **Comparison Analytics** - Internal vs External tool benchmarking
- **Distribution Analysis** - Use case and technology breakdowns
- **Top Performers** - Ranked tool recommendations
- **Dashboard Guide** - Interactive tutorial for Analytics Dashboard
- **General Overview** - Quick stats and featured insights

**Example Queries:**
- "Show me analytics data"
- "What are the top performing tools?"
- "Compare internal vs external analytics"
- "Analyze capability scores"
- "How do I use the analytics dashboard?"

See [SONA_ANALYTICS.md](./SONA_ANALYTICS.md) for complete documentation.

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
