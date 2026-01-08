# NourishBot AI Coach

NourishBot is a multi-agent AI nutrition coach that analyzes food photos to provide detailed nutritional breakdowns and personalized recipe suggestions.

## Features

- Upload a meal photo and have a **vision agent** detect food items
- Run a **nutrition analyst** that estimates calories, macro breakdown, micros, and health score
- Generate **chef-quality recipes** tailored to dietary preferences (Vegan, Vegetarian, Keto, etc.)
- Maintain a local **history log** of previous analyses and recipes
- Rich UI with charts, status timelines, and editable history labels

## Tech Stack

- **React + TypeScript** (single-page app)
- **Vite** for bundling/dev server
- **@google/genai** for Gemini API access
- **Recharts** for nutrition visualizations
- **Lucide React** for icons
- TailwindCSS via CDN in `index.html`

## Prerequisites

To build and run locally you will need:

- [Node.js](https://nodejs.org/) (LTS or newer)
- npm (bundled with Node)
- A **Gemini API key** from Google AI Studio

## Getting Started

1. **Install dependencies**

   ```bash path=null start=null
   cd nourishbot-ai-coach
   npm install
   ```

2. **Configure environment**

   Create a `.env` file in the project root with:

   ```bash path=null start=null
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

   The Vite config (`vite.config.ts`) injects this as `process.env.GEMINI_API_KEY` on the client.

3. **Start the dev server**

   ```bash path=null start=null
   npm run dev
   ```

   Then open the URL Vite prints (typically `http://localhost:3000`).

## Project Structure

- `App.tsx` – main UI and multi-agent orchestration
- `components/AgentStatus.tsx` – live log of agent activity
- `components/NutritionAnalysis.tsx` – calorie, macro, and insight views
- `components/RecipeCard.tsx` – recipe rendering UI
- `components/HistoryLog.tsx` – local history list with inline editing
- `services/geminiService.ts` – wrappers around Gemini models (vision, analysis, recipes)
- `types.ts` – shared TypeScript types and enums

## Running in Production

Build a production bundle with:

```bash path=null start=null
npm run build
```

Then serve the contents of `dist/` with any static file server.

## Notes

- This project calls Gemini APIs **directly from the browser**, which means consumers of the app can see the API key. For production systems you should move API calls to a backend or proxy and keep secrets server-side.
- History is stored in `localStorage` under the key `nourishbot_history`.