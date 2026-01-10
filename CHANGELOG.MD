# Changelog

All notable changes to NourishBot AI Coach will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-10

### 🎉 Initial Release

#### Added
- Multi-agent AI system with three specialized agents:
  - Vision Agent for food image analysis
  - Nutrition Analyst for detailed macro/micro breakdown
  - Culinary Expert for recipe generation
- Image upload and analysis functionality
- Two workflow modes: Analysis and Recipe generation
- Six dietary preference options:
  - None (default)
  - Vegan
  - Vegetarian
  - Gluten-Free
  - Keto
  - Paleo
- Real-time agent status tracking with visual timeline
- Interactive nutrition visualization with Recharts pie charts
- Local history management with localStorage persistence
- History entry editing and deletion
- Responsive UI with Tailwind CSS
- Modern component architecture with React 18.3
- TypeScript type safety throughout the codebase

#### Dependencies
- React 18.3.1
- React DOM 18.3.1
- TypeScript 5.8.3
- Vite 6.2.3
- Google Generative AI 0.21.0
- Recharts 2.13.3
- Lucide React 0.460.0
- TailwindCSS 3.x (via CDN)

#### Developer Experience
- ESLint configuration for code quality
- Prettier for code formatting
- TypeScript strict mode enabled
- Vite for fast development and optimized builds
- Hot module replacement (HMR) for instant feedback

#### Documentation
- Comprehensive README.md with setup instructions
- Detailed Walkthrough.MD for developers
- Inline code comments and JSDoc
- Environment variable configuration guide
- Security warnings for API key handling

### 🔧 Technical Improvements

#### Code Quality
- Fixed all TypeScript linting errors
- Improved error handling in all agent functions
- Added proper try-catch blocks for API calls
- Enhanced type safety with strict TypeScript configuration
- Removed unused variables and imports
- Fixed accessibility issues (added aria-labels)

#### Performance
- Optimized component re-renders with proper state management
- Implemented efficient localStorage operations
- Added loading states for better UX
- Optimized image handling and base64 conversion

#### Architecture
- Migrated from deprecated `@google/genai` to `@google/generative-ai`
- Updated to use `SchemaType` instead of `Type` enum
- Improved API error handling and logging
- Better separation of concerns in components
- Consistent naming conventions throughout

### 📦 Package Updates

#### Updated Dependencies
- `@google/generative-ai`: Updated to v0.21.0 (from deprecated package)
- `react`: Updated to v18.3.1
- `react-dom`: Updated to v18.3.1
- `lucide-react`: Updated to v0.460.0
- `recharts`: Updated to v2.13.3
- `typescript`: Updated to v5.8.3
- `vite`: Updated to v6.2.3
- `prettier`: Updated to v3.4.2

#### Added Dependencies
- `@types/react`: v18.3.18
- `@types/react-dom`: v18.3.5
- `@typescript-eslint/eslint-plugin`: v8.24.0
- `@typescript-eslint/parser`: v8.24.0
- `eslint`: v9.18.0
- `eslint-plugin-react-hooks`: v5.1.0
- `eslint-plugin-react-refresh`: v0.4.18

### 🐛 Bug Fixes
- Fixed localStorage parsing errors with proper error handling
- Corrected Gemini API integration issues
- Fixed TypeScript type mismatches
- Resolved component prop type issues
- Fixed keyboard event handling in HistoryLog editing
- Corrected accessibility issues in interactive elements

### 🔐 Security
- Added security warnings for API key exposure
- Documented best practices for production deployments
- Added .env.example with clear security notes
- Updated .gitignore to prevent accidental key commits

### 📝 Documentation
- Enhanced README with badges and better organization
- Added comprehensive feature list
- Included architecture overview
- Added contribution guidelines
- Created detailed changelog
- Improved inline code documentation
- Added JSDoc comments for key functions

### Known Issues
- API key is currently exposed client-side (demo limitation)
- Rate limiting depends on Gemini API free tier limits
- No server-side storage (localStorage only)
- Limited to 10 history entries

### Migration Notes
If upgrading from an earlier version:
1. Update all dependencies: `npm install`
2. Create new `.env` file from `.env.example`
3. Update API key in `.env` file
4. Clear browser localStorage to reset history

---

## [Unreleased]

### Planned Features
- Backend API proxy for secure API key handling
- User authentication and cloud storage
- Advanced analytics and reporting
- Weekly/monthly nutrition trends
- Meal planning features
- Barcode scanning for packaged foods
- Integration with fitness trackers
- Mobile app versions
- Additional dietary preferences
- Meal substitution suggestions
- Multi-language support

---

## Release Types

- **Major** (X.0.0): Breaking changes, major feature additions
- **Minor** (0.X.0): New features, non-breaking changes
- **Patch** (0.0.X): Bug fixes, small improvements

---

[1.0.0]: https://github.com/yourusername/nourishbot-ai-coach/releases/tag/v1.0.0
