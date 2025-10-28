# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-27

### Added - Major Features
- **Universal Translation Engine**: SONA can now translate ANY sentence between 8 languages using free MyMemory API
  - Dictionary-first approach with 25+ common phrases for instant translation
  - Fallback to AI-powered translation for arbitrary text
  - Optional DeepL integration for premium quality translation
  - Supports: English, French, Spanish, German, Portuguese, Chinese, Japanese, Vietnamese
- **Feedback Collection System**: Complete thumbs-up/thumbs-down feedback mechanism
  - UI buttons on all assistant messages for user feedback
  - Optional reason prompt for thumbs-down feedback
  - Metadata tracking (message ID, user ID, timestamp, query, response)
  - localStorage persistence with export capability
  - Learning model updates based on feedback patterns
- **Enhanced Category Comparisons**: SONA can now compare tools by category
  - Compare ALL internal tools: "Compare all internal tools"
  - Compare ALL external tools: "Compare all external tools"
  - Compare by function: productivity, collaboration, analytics, document, coding, creative tools, etc.
  - No limit on category comparisons (shows all matching tools)
  - Improved display with type badges (🏢 Internal / 🌐 External)
- **Click-to-Close Popups**: Welcome popup now closes when clicking anywhere on screen backdrop

### Enhanced
- Improved SONA's natural language understanding for translation requests
- Better text extraction from translation queries (handles "translate this for me to french: [long text]")
- Category search now includes `modules` field for better matching
- Expanded category list: analytics, document, code, image, video, audio, design, chat, conversation
- News sources updated to include Fierce Biotech for Sanofi news queries
- Comparison responses now show tool counts and category-specific headers

### Technical
- Converted `generateIntelligentResponse()` to async for API translation support
- Updated ChatWidget components to handle async response generation
- Added feedback helper module (`src/features/sona/feedback.ts`)
- Extended `FeedbackEntry` type with optional metadata fields
- Added ThumbsUp/ThumbsDown icons from lucide-react
- Created comprehensive documentation and test files for translation features

### Files Added
- `src/features/sona/feedback.ts` - Feedback collection and export helpers
- `src/config/deepl.example.ts` - Optional DeepL configuration
- `UNIVERSAL_TRANSLATION.md` - Translation feature documentation
- `TRANSLATION_TEST_REPORT.md` - Translation testing documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `QUICK_START_TRANSLATION.md` - Quick start guide for translation
- `COMPARISON_IMPROVEMENTS.md` - Category comparison documentation
- `test-translation.mjs` - Translation test harness
- `test-extraction.mjs` - Text extraction test script

## [1.1.1] - 2025-10-20

### Fixed
- GitHub Pages deployment now properly serves built assets.
- Fixed SPA routing by moving redirect handler to JavaScript bundle.
- Resolved 404 errors for CSS and JavaScript assets.
- Updated GitHub Actions workflow to use gh-pages branch deployment method.
- Added `gh-pages` package as devDependency for deployment.

### Changed
- Switched from GitHub Pages artifact deployment to traditional gh-pages branch method.
- Improved deployment reliability and consistency.

## [1.1.0] - 2025-10-20

### Added
- Expandable and collapsible chat window for SONA assistant.
- Markdown rendering for SONA's responses, including headers, lists, and bold text.
- Personality and small talk capabilities for SONA.
- User profile learning for a personalized experience.
- Auto-scrolling chat with a "scroll to bottom" button.
- Full internationalization (i18n) for all UI text in 8 languages.
- `CHANGELOG.md` to track version history.

### Fixed
- Hardcoded UI strings are now translated.
- Improved chat readability.
- Secured `AccessLink` component against `javascript:` payloads.
