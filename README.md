# NourishBot AI Coach

NourishBot is a multi-agent AI nutrition coach that turns food photos into rich nutritional insights and personalized recipes.

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
- 🍽️ **Recipe generation** – auto-generated recipes tailored to dietary preferences (None, Vegan, Vegetarian, Gluten-Free, Keto, Paleo).
- 🧠 **Multi-agent status feed** – see each agent's progress (vision, nutrition analyst, culinary expert) in real time.
- 📜 **Local history log** – revisit previous analyses/recipes, rename entries, and delete old ones.
- 💅 **Modern UI** – Tailwind-styled components, responsive layout, and interactive charts.

---

## Architecture

**Front End**

- Single-page application built with **React + TypeScript** and bundled by **Vite**.
- UI uses **TailwindCSS** via CDN (`index.html`), **Lucide React** for icons, and **Recharts** for data visualization.

**Multi-Agent Client**

Implemented in `services/geminiService.ts` using **@google/genai** with client-side API calls:

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
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Getting Started

Clone the repository, install dependencies, and start the dev server:

```bash
git clone <repository-url>
cd nourishbot-ai-coach
npm install
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`) – open it in your browser to use the app.

> **Note:** If `npm` is not recognized on your machine, install Node.js first and restart your terminal.

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** Vite requires the `VITE_` prefix for environment variables to be accessible in client-side code.

The Gemini service reads the API key as:

```ts
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
```

### ⚠️ Security Warning

**This demo exposes the API key client-side for simplicity.** In production applications:

- **Never expose API keys in client-side code**
- Move Gemini API calls to a secure backend server
- Use environment variables only on the server
- Implement proper authentication and rate limiting

---

## Available Scripts

All scripts are defined in `package.json`:

- `npm run dev` – start the Vite dev server (default: http://localhost:5173).
- `npm run build` – create a production build in `dist/`.
- `npm run preview` – preview the production build using Vite's preview server.

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

For a deeper technical tour, see `WALKTHROUGH.md`.

---

## Data & Privacy Notes

- The app stores analysis and recipe history **locally** in `localStorage` under the key `nourishbot_history`.
- Images are sent to Gemini for analysis; **do not use this app with sensitive or private photos**.
- **API Key Exposure:** The Gemini API key is currently injected client-side for demo purposes. Anyone can view it in the browser's developer tools. 
  - For production use, implement a backend proxy to handle API calls securely.
  - Never commit `.env` files with real API keys to version control.
  - Add `.env` to your `.gitignore` file.

---

## Extending the Project

Some ideas for next steps:

- Add more `DietaryPreference` options (e.g., Low-FODMAP, Diabetic-friendly) and wire them through prompts and UI.
- Introduce a new "substitution" agent that suggests healthier or allergy-safe alternatives.
- Add user accounts and server-side persistence for history instead of `localStorage`.
- Implement analytics/logging to monitor how often each workflow is used and how agents perform.
- Integrate additional charts (e.g., week-over-week macro trends using the history log).
- **Secure the API:** Move Gemini calls to a backend service to protect API keys and add authentication.

Contributions and experiments are welcome—this project is intended as a playground for multi-agent AI UX patterns.

---

## License

[Specify your license here, e.g., MIT, Apache 2.0]

## Contributing

[Add contribution guidelines if applicable]

## Support

For issues or questions, please [open an issue](link-to-issues) on the repository.
