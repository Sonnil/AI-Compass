# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
