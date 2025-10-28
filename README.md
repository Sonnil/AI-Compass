````markdown
# AI Tools Knowledge Hub (React + TypeScript + Vite)

Modern, static, and self-contained website to search, compare, and collect suggestions for AI tools and agents.

## Key Features
- 🔍 **Smart Search & Filters** - Find tools by name, features, or capabilities
- 📊 **Tool Comparison** - Side-by-side comparison of features and capabilities
- 💬 **SONA AI Assistant** - Intelligent chatbot with comprehensive knowledge
  - AI tools catalog expertise (26 tools)
  - **Analytics & Data Analysis** - Ask for insights, statistics, and comparisons
  - **Universal Translation** - Translate ANY text between 8 languages using free AI API
  - Platform features and navigation guidance
  - Sanofi company information and news
  - AI facts, tips, jokes, and educational content
- 📈 **Analytics Dashboard** - Visualize tool capabilities and performance metrics
- 🌐 **8 Languages** - English, Français, Español, Deutsch, Português, 中文, 日本語, Tiếng Việt
- 🌍 **AI-Powered Translation** - Translate ANY sentence instantly with free MyMemory API
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

## 🌐 Universal Translation Feature

SONA can now translate **ANY text** between all 8 supported languages! No API key required.

### How It Works

**Three-Tier Translation System:**
1. **Dictionary-first** (25+ common phrases) - Instant, offline
2. **Free MyMemory API** (ANY text) - Professional quality, no API key needed
3. **DeepL Premium** (optional) - Highest quality for production use

### Free Translation API

SONA uses the **MyMemory Translation API** which:
- ✅ **No API key required** - Works out of the box
- ✅ **Translate ANY text** - Not limited to dictionary phrases
- ✅ **Free tier**: 1,000 words/day per IP
- ✅ **Professional quality** - Powered by translation memory
- ✅ **All 8 languages** supported

### Example Translation Queries

```
Translate "Hello, how are you today?" to French
How do you say "The weather is beautiful" in Spanish?
Translate "I love artificial intelligence" to German
What is "Where is the nearest restaurant?" in Japanese?
Translate this to Chinese: "Thank you for your help"
```

### Translation Method Indicators

SONA tells you which method was used:
- 🔷 **Dictionary** - "from my built-in dictionary of 25+ common phrases"
- 🌐 **Free API** - "using free translation AI service"
- 💎 **DeepL** - "using DeepL AI for professional-quality translation" (if configured)

### DeepL Integration (Optional Enhancement)

For the highest quality translations in production:

**Step 1:** Get DeepL API key from [DeepL API](https://www.deepl.com/pro-api)
- Free tier: 500,000 characters/month
- Professional neural machine translation

**Step 2:** Enable in your app:
```typescript
import { setDeepLApiKey } from './features/sona/agent'
setDeepLApiKey('your-deepl-api-key-here')
```

SONA will automatically use DeepL when configured, falling back to MyMemory API if needed.

### Supported Languages

- 🇺🇸 English (EN)
- 🇫🇷 Français (FR)
- 🇪🇸 Español (ES)
- 🇩🇪 Deutsch (DE)
- 🇵🇹 Português (PT)
- 🇨🇳 中文 (ZH)
- 🇯🇵 日本語 (JA)
- 🇻🇳 Tiếng Việt (VI)
