# NourishBot AI Coach

NourishBot is a multi‑agent AI nutrition coach that turns food photos into rich nutritional insights and personalized recipes.

It is designed as a demo-quality app that showcases:

- Coordinated **multi-agent workflows** (vision → nutrition analysis → recipe generation)
- **Structured JSON outputs** from Gemini models mapped directly into TypeScript types
- A polished **React + TypeScript** front end with charts, history, and inline editing

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Key Files & Folders](#key-files--folders)
- [Data & Privacy Notes](#data--privacy-notes)
- [Extending the Project](#extending-the-project)

---

## Features

- 📷 **Image-based meal analysis** – upload a photo of your meal and let the vision agent detect ingredients.
- 📊 **Nutrition breakdown** – estimated calories, macro distribution, micros, health score, and suggestions.
- 🍽️ **Recipe generation** – auto-generated recipes tailored to dietary preferences (None, Vegan, Vegetarian, Gluten‑Free, Keto, Paleo).
- 🧠 **Multi-agent status feed** – see each agent’s progress (vision, nutrition analyst, culinary expert) in real time.
- 📜 **Local history log** – revisit previous analyses/recipes, rename entries, and delete old ones.
- 💅 **Modern UI** – Tailwind-styled components, responsive layout, and interactive charts.

---

## Architecture

**Front end**

- Single-page application built with **React + TypeScript** and bundled by **Vite**.
- UI uses **TailwindCSS** via CDN (`index.html`), **Lucide React** for icons, and **Recharts** for data visualization.

**Multi-agent backend (client-side calls)**

Implemented in `services/geminiService.ts` using **@google/genai**:

- `visionAgent(imageBase64)`  
  Takes a base64-encoded JPEG, asks Gemini to return a comma-separated list of ingredients, and converts it into `string[]`.
- `nutritionAnalyst(items)`  
  Given a list of ingredients, prompts Gemini to return structured JSON matching the `NutritionData` TypeScript type.
- `culinaryExpert(items, preference)`  
  Asks Gemini for a recipe (JSON) that abides by the specified `DietaryPreference`, matching the `RecipeData` type.

**Orchestration**

The main orchestration lives in `App.tsx`:

1. User uploads an image.
2. `visionAgent` detects ingredients.
3. Depending on the selected workflow:
   - **Analysis** → call `nutritionAnalyst` and render `NutritionAnalysis`.
   - **Recipe** → quick nutrition scan → `culinaryExpert` → render `RecipeCard`.
4. Each run is logged to `localStorage` as a `HistoryItem` and shown in `HistoryLog`.

---

## Prerequisites

To build and run locally you will need:

- [Node.js](https://nodejs.org/) (LTS or newer)
- `npm` (bundled with Node)
- A **Gemini API key** from Google AI Studio

---

## Getting Started

Clone the repository, install dependencies, and start the dev server:

```bash
cd nourishbot-ai-coach
npm install
npm run dev
```

Vite will print a local URL such as `http://localhost:3000` – open it in your browser to use the app.

> If `npm` is not recognized on your machine, install Node.js first and restart your terminal.

---

## Configuration

Create a `.env` file in the project root:

```bash
GEMINI_API_KEY="your_gemini_api_key_here"
```

The Vite config (`vite.config.ts`) exposes this value to the client as both:

- `process.env.GEMINI_API_KEY`
- `process.env.API_KEY`

The Gemini service reads:

```ts
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
```

so either variable name will work, but `GEMINI_API_KEY` is preferred.

---

## Available Scripts

All scripts are defined in `package.json`:

- `npm run dev` – start the Vite dev server.
- `npm run build` – create a production build in `dist/`.
- `npm run preview` – preview the production build using Vite’s preview server.

To serve a production build with your own static server:

```bash
npm run build
# then serve ./dist with any static file server
```

---

## Key Files & Folders

- `App.tsx` – main application shell and multi-agent orchestration logic.
- `index.tsx` – React entry point that mounts `<App />`.
- `index.html` – HTML shell, Tailwind CDN config, and import map for ESM dependencies.
- `services/geminiService.ts` – Gemini agents: vision, nutrition analysis, and recipe generation.
- `types.ts` – TypeScript enums and interfaces (`Workflow`, `DietaryPreference`, `NutritionData`, `RecipeData`, etc.).
- `components/AgentStatus.tsx` – live agent log UI.
- `components/NutritionAnalysis.tsx` – macros chart, calories, health score, insights.
- `components/RecipeCard.tsx` – recipe layout.
- `components/HistoryLog.tsx` – list of previous runs with rename/delete actions.
- `metadata.json` – high-level app metadata (used by host environments that read it).

For a deeper technical tour, see `Walkthrough.MD`.

---

## Data & Privacy Notes

- The app stores analysis and recipe history **locally** in `localStorage` under the key `nourishbot_history`.
- Images are sent to Gemini for analysis; do not use this app with sensitive or private photos.
- The Gemini API key is currently injected client-side for simplicity. In production systems, you should:
  - Move Gemini calls to a backend or proxy.
  - Keep API keys and secrets strictly on the server.

---

## Future Enhancements

Some ideas for next steps:

- Add more `DietaryPreference` options (e.g., Low‑FODMAP, Diabetic‑friendly) and wire them through prompts and UI.
- Introduce a new "substitution" agent that suggests healthier or allergy-safe alternatives.
- Add user accounts and server-side persistence for history instead of `localStorage`.
- Implement analytics / logging to monitor how often each workflow is used and how agents perform.
- Integrate additional charts (e.g., week-over-week macro trends using the history log).

Contributions and experiments are welcome—this project is intended as a playground for multi-agent AI UX patterns.
