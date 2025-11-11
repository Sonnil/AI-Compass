# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2025-01-29

### Added
- **Learning System**: SONA now tracks interactions and learns from user feedback
  - Learning Dashboard showing intent accuracy, satisfaction scores, and tool success rates
  - localStorage persistence for learning data
  - Analytics on intent classification performance
  - Top tools tracking based on user interactions
- **Multi-Step Reasoning**: Enhanced agent uses 5-phase reasoning process
  - Phase 1: Analyze query structure
  - Phase 2: Infer user goals and requirements
  - Phase 3: Match tools to requirements
  - Phase 4: Validate recommendations
  - Phase 5: Synthesize final response
- **Tracing Service**: Complete observability into SONA's decision-making
  - Brain icon button to view agent's thought process
  - Step-by-step trace of intent classification and reasoning
  - Transparent AI for better user understanding
- **Enhanced Intent Classification**: Improved patterns for detecting user intent
  - Better detection for writing/text generation queries
  - Enhanced data analysis detection
  - More robust comparison and recommendation entity extraction

### Fixed
- **Critical: Reasoning Service Crash**: Fixed parameter passing bug causing enhanced agent to crash
  - Changed `matchToolsToRequirements()` to receive full output object instead of nested property
  - Changed `validateRecommendations()` to receive full output object
  - Resolves "Cannot read properties of undefined (reading 'forEach')" error
- **Enhanced Agent Error Handling**: Added comprehensive defensive error handling
  - Try-catch wrapper around intent classification with fallback to GENERAL_QUESTION
  - Prevents enhanced agent from crashing and falling back to old responses
  - Graceful degradation when reasoning steps encounter errors
- **Intent Tracking**: Fixed intentTypeName tracking throughout agent lifecycle
  - Proper variable scoping prevents "UNKNOWN" intents in Learning Dashboard
  - Intent accuracy metrics now calculate correctly (no longer stuck at 0%)
- **GitHub Pages Deployment**: Fixed 404 errors after changing repository visibility
  - Migrated from "Deploy from a branch" to "GitHub Actions" deployment method
  - Added proper build and deployment workflow
  - Site now live at: https://sonnil.github.io/AI-Compass/?demo=true

### Enhanced
- Comprehensive console logging for debugging agent behavior
- Better error messages with stack traces for troubleshooting
- Enhanced entity extraction for writing and text generation queries
- Improved fallback mechanisms to ensure SONA always responds

### Technical
- Added defensive error handling in `enhancedAgent.ts`
- Fixed reasoning service parameter passing in `reasoningService.ts`
- Enhanced debug logging in `intentClassifier.ts` and `responseGenerator.ts`
- Improved error logging in `ChatWidget.tsx`
- Created `.github/workflows/deploy.yml` for automated deployment

## [2.1.0] - 2025-10-27

### Added
- **Advanced Sorting Capabilities**: Users can now sort tools at "Scope: all" view
  - Sort by name (A-Z or Z-A)
  - Sort by type (Internal tools first or External tools first)
  - Sort by rating (highest rated tools first based on feature scores)
  - Sort by category (highest ranking categories first)
  - Full internationalization support for all sorting options (8 languages)
  - Visual sorting dropdown with icon next to scope filter

### Enhanced
- Rating calculation system for tools based on features (0-10 point scale)
  - Web search capability: +1 point
  - Code generation: +1 point
  - Image generation: +1 point
  - Knowledge base: +1 point
  - General knowledge: +1 point
  - Sanofi systems access: +1 point
  - O365 integration: +1 point
  - Documentation available: +0.5 points
  - Training available: +0.5 points
  - Internal tool bonus: +0.5 points

### Fixed
- Greeting message no longer shows "undefined" for unidentified users
  - Now displays clean time-based greeting: "Good evening!" instead of "Good evening, undefined!"
  - Improved user profile validation before name interpolation

### Technical
- Added `calculateRating()` function to compute tool ratings dynamically
- Extended `filtered` memo with comprehensive sorting logic
- Added `sortBy` state management with 6 sorting options
- Implemented conditional greeting templates in agent.ts
- Added userName validation to prevent undefined values in UI

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
