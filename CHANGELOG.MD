# Changelog

All notable changes to **NourishBot AI Coach** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- User authentication and cloud storage.
- Backend API proxy for secure API key handling.
- Weekly and monthly nutrition trends and analytics.
- Meal planning and substitution suggestions.
- Barcode scanning for packaged foods.
- Fitness tracker integrations.
- Mobile app versions.
- Additional dietary preferences.
- Multi-language support.

---

## [1.1.3] — 2026-06-12

### Added
- New `CONTRIBUTING.md` file to guide community contributions.

### Changed
- Updated dependencies in `package.json` to their latest stable versions (React 19.2.7, Recharts 3.8.1).
- Updated `README.md` to include all currently supported dietary preferences (Dairy-Free, Low-Carb).
- Synchronized versioning across `package.json`, `README.md`, and `CHANGELOG.md` to 1.1.3.

## [1.1.2] — 2026-06-11

### Fixed
- TypeScript build errors in `services/geminiService.ts` by importing missing interfaces.
- ESLint compatibility issues with ESLint 9 by updating the linting script in `package.json`.
- Inconsistent data structures between frontend and backend by aligning `server/middleware.ts` schemas with `types.ts`.

### Changed
- Refactored `services/geminiService.ts` to use the server-side proxy instead of direct API calls or mocks.

## [1.1.1] — 2026-06-10

### Added
- Secure backend proxy for Gemini API calls to remove sensitive logic from the client.
- Explicit TypeScript typing for Gemini AI schemas to improve build-time safety.

### Fixed
- TypeScript compilation errors in middleware related to `ResponseSchema` types.
- Build failure when `GEMINI_API_KEY` was absent from the build environment.

### Changed
- Synchronized versioning across `package.json`, `README.md`, and `CHANGELOG.md`.
- Updated `README.md` to reflect the actual project structure and removed outdated directory references.

---

## [1.1.0] — 2026-01-11

### Added
- Tooltip on the "Analysis" button to improve UX discoverability.
- This `CHANGELOG.md` file.

### Changed
- Updated dependencies to their latest versions, including React 19 and Vite 7.
- Migrated ESLint configuration to the flat `eslint.config.js` format.
- Redesigned `RecipeCard.tsx` for improved readability.
- Made the footer responsive.
- Updated `README.md` and `Walkthrough.md` with current information.

### Fixed
- Blank white screen caused by a missing script tag in `index.html` and incorrect environment variable handling.
- Linting issues, including `no-explicit-any` violations and deprecated Prettier options.
- TypeScript errors that were blocking a successful build.
- Unused variables in `vite.config.ts`.

### Removed
- Non-functional button from the UI.

---

## [1.0.0] — 2026-01-10

### Added
- Multi-agent AI system with three specialized agents: Vision Agent, Nutrition Analyst, and Culinary Expert.
- Image upload and analysis workflow.
- Two modes: Analysis and Recipe generation.
- Six dietary preferences: None, Vegan, Vegetarian, Gluten-Free, Keto, and Paleo.
- Real-time agent status tracking with a visual timeline.
- Interactive nutrition visualization via Recharts pie charts.
- Local history management with `localStorage` for up to 10 entries, including editing and deletion.
- Responsive UI built with Tailwind CSS.

### Architecture and Code Quality
- React 18.3 component architecture with TypeScript strict mode throughout.
- Migration from deprecated `@google/genai` to `@google/generative-ai`, with `SchemaType` replacing the `Type` enum.
- Proper `try/catch` blocks on all API calls with improved error handling and logging.
- Optimized component re-renders, localStorage usage, and base64 image handling.
- Fixed TypeScript and ESLint errors; removed unused variables and imports.
- Accessibility improvements, including `aria-label` attributes and keyboard event handling.

### Security
- Security warnings for client-side API key exposure, with demo-only guidance.
- Documented production best practices.
- Added `.env.example` with security guidance.
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

### Known Limitations
- API key exposed client-side for demo purposes only.
- Rate limiting depends on Gemini API free-tier limits.
- No server-side storage; history uses `localStorage` only.
- History is capped at 10 entries.

### Migration Notes
If upgrading from a pre-release build:
1. Run `npm install` to update dependencies.
2. Create a new `.env` file from `.env.example` and add your API key.
3. Clear browser localStorage to reset history state.

---

## Version Types

| Increment | When to use |
|---|---|
| Major `X.0.0` | Breaking changes or major new capabilities. |
| Minor `0.X.0` | New features and non-breaking enhancements. |
| Patch `0.0.X` | Bug fixes and small improvements. |

---

[1.1.1]: https://github.com/yourusername/nourishbot-ai-coach/releases/tag/v1.1.1
[1.1.0]: https://github.com/yourusername/nourishbot-ai-coach/releases/tag/v1.1.0
[1.0.0]: https://github.com/yourusername/nourishbot-ai-coach/releases/tag/v1.0.0
