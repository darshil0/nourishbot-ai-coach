# Changelog

All notable changes to **NourishBot AI Coach** are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- User authentication and cloud storage
- Backend API proxy for secure API key handling
- Weekly/monthly nutrition trends and analytics
- Meal planning and substitution suggestions
- Barcode scanning for packaged foods
- Fitness tracker integrations
- Mobile app versions
- Additional dietary preferences
- Multi-language support

---

## [1.1.1] — 2026-06-10

### Added
- Secure backend proxy for Gemini API calls, removing sensitive logic from the client.
- Explicit TypeScript typing for Gemini AI schemas for improved build-time safety.

### Fixed
- TypeScript compilation errors in middleware related to `ResponseSchema` types.
- Build failure when `GEMINI_API_KEY` was absent from the build environment.

### Changed
- Synchronized versioning across `package.json`, `README.md`, and `CHANGELOG.md`.
- Updated `README.md` to reflect the actual project structure; removed outdated directory references.

---

## [1.1.0] — 2026-01-11

### Added
- Tooltip on the "Analysis" button for improved UX discoverability.
- This `CHANGELOG.md` file.

### Changed
- Updated all dependencies to latest versions, including React 19 and Vite 7.
- Migrated ESLint configuration to the new flat `eslint.config.js` format.
- Redesigned `RecipeCard.tsx` for improved readability.
- Made the footer responsive.
- Updated `README.md` and `Walkthrough.md` with current information.

### Fixed
- Blank white screen caused by a missing script tag in `index.html` and incorrect environment variable handling.
- Numerous linting issues including `no-explicit-any` violations and deprecated Prettier options.
- TypeScript errors that were blocking a successful build.
- Removed unused variables from `vite.config.ts`.

### Removed
- Non-functional button from the UI.

---

## [1.0.0] — 2026-01-10

Initial release.

### Features
- Multi-agent AI system with three specialized agents: Vision Agent (food image analysis), Nutrition Analyst (macro/micro breakdown), and Culinary Expert (recipe generation).
- Image upload and analysis workflow.
- Two modes: Analysis and Recipe generation.
- Six dietary preferences: None, Vegan, Vegetarian, Gluten-Free, Keto, Paleo.
- Real-time agent status tracking with a visual timeline.
- Interactive nutrition visualization via Recharts pie charts.
- Local history management with localStorage (up to 10 entries), including editing and deletion.
- Responsive UI built with Tailwind CSS.

### Architecture & Code Quality
- React 18.3 component architecture with TypeScript strict mode throughout.
- Migrated from deprecated `@google/genai` to `@google/generative-ai`; updated to use `SchemaType` instead of the `Type` enum.
- Proper `try/catch` blocks on all API calls with improved error handling and logging.
- Optimized component re-renders, efficient localStorage operations, and base64 image handling.
- Fixed all TypeScript and ESLint errors; removed unused variables and imports.
- Corrected accessibility issues (added `aria-label` attributes and keyboard event handling).

### Security
- Added security warnings for client-side API key exposure (demo limitation).
- Documented production best practices; added `.env.example` with security guidance.
- Updated `.gitignore` to prevent accidental API key commits.

### Dependencies
| Package | Version |
|---|---|
| React / React DOM | 18.3.1 |
| TypeScript | 5.8.3 |
| Vite | 6.2.3 |
| `@google/generative-ai` | 0.21.0 |
| Recharts | 2.13.3 |
| Lucide React | 0.460.0 |
| TailwindCSS | 3.x (CDN) |
| ESLint | 9.18.0 |
| Prettier | 3.4.2 |

### Known Limitations (at release)
- API key exposed client-side (demo only — do not use in production).
- Rate limiting subject to Gemini API free tier.
- No server-side storage; localStorage only.
- History capped at 10 entries.

### Migration Notes
If upgrading from a pre-release build:
1. Run `npm install` to update all dependencies.
2. Create a new `.env` file from `.env.example` and add your API key.
3. Clear browser localStorage to reset history state.

---

## Version Types

| Increment | When to use |
|---|---|
| Major `X.0.0` | Breaking changes or significant new capabilities |
| Minor `0.X.0` | New features, non-breaking changes |
| Patch `0.0.X` | Bug fixes and small improvements |

---

[1.1.1]: https://github.com/yourusername/nourishbot-ai-coach/releases/tag/v1.1.1
[1.1.0]: https://github.com/yourusername/nourishbot-ai-coach/releases/tag/v1.1.0
[1.0.0]: https://github.com/yourusername/nourishbot-ai-coach/releases/tag/v1.0.0
