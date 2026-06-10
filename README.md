# NourishBot AI Coach

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.1-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)

A multi-agent AI nutrition coach that turns food photos into rich nutritional insights and personalized recipes.

[Features](#features) · [Getting Started](#getting-started) · [Project Structure](#project-structure) · [Contributing](#contributing)

</div>

---

## Features

**Image-based meal analysis**: Upload a food photo and a vision agent identifies ingredients automatically.
**Nutritional breakdown**: Get estimated calories, macro and micronutrient distribution, a health score, and improvement suggestions.
**Recipe generation**: The culinary agent creates recipes tailored to your dietary preference: Vegan, Vegetarian, Gluten-Free, Keto, or Paleo.
**Multi-agent status feed**:A real-time timeline shows progress across the vision, nutrition, and culinary agents as they work.
**Local history log**: Browse, rename, and delete previous analyses and recipes stored in your browser.

---

## Architecture

NourishBot is a single-page React application fronted by a lightweight Express middleware layer that proxies Gemini API calls, keeping the API key server-side.

### Frontend stack

| Layer | Technology |
|---|---|
| UI framework | React 19.2 + TypeScript 5.8 |
| Build tool | Vite 7.3 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Charts | Recharts |

### Multi-agent system

Three specialized agents are orchestrated sequentially in `App.tsx`:

1. **Vision Agent** — Analyzes the uploaded image to identify food components and ingredients.
2. **Nutrition Analyst** — Computes a detailed macro/micro breakdown and health score from the identified ingredients.
3. **Culinary Expert** — Generates a personalized recipe based on the detected ingredients and the selected dietary preference.

In **Analysis mode**, only the Vision and Nutrition agents run. In **Recipe mode**, the Culinary Expert replaces the Nutrition Analyst as the second step.

All agents are powered by the **Google Generative AI SDK** (`@google/generative-ai`).

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18.x LTS or newer (includes `npm`)
- A **Google Gemini API key** — get one free at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd nourishbot-ai-coach
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Security note:** The API key is used exclusively by the server-side proxy (`server/middleware.ts`) and is never sent to the browser. Do not prefix it with `VITE_` or reference it in any client-side code.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it behind a Node/Express server that runs the middleware so the API key stays protected.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot module replacement |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing changes |

---

## Project Structure

```
nourishbot-ai-coach/
├── server/
│   └── middleware.ts          # Express proxy — handles Gemini API calls server-side
├── components/
│   ├── AgentStatus.tsx        # Real-time multi-agent timeline
│   ├── HistoryLog.tsx         # Browsable history of past sessions
│   ├── NutritionAnalysis.tsx  # Macro/micro breakdown and health score
│   └── RecipeCard.tsx         # Recipe display and formatting
├── services/
│   └── geminiService.ts       # Agent definitions and Gemini SDK calls
├── App.tsx                    # Root component and agent orchestration
├── index.tsx                  # React entry point
├── types.ts                   # Shared TypeScript types
├── .env.example               # Environment variable template
├── index.html                 # HTML shell
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── README.md                  # This file
├── CHANGELOG.md               # Version history
└── Walkthrough.MD             # In-depth technical guide
```

---

## Data & Privacy

- **History** is stored in `localStorage` — it never leaves the browser.
- **Images** are sent to the server-side proxy for processing; they are not stored.
- **No backend persistence** — there is no database or server-side storage.
- **API key** lives only in the server environment and is never exposed to the client.

---

## Known Limitations

- History is capped at 10 entries.
- Rate limiting is subject to the Gemini API free tier.
- No user accounts or cross-device sync (localStorage only).

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add your feature'`.
4. Push the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

For significant changes, open an issue first to align on the approach before writing code.

---

## License

MIT License — see [LICENSE](LICENSE) for details.  
Copyright © 2024 Darshil Shah

---

## Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) for the vision and language models
- [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Recharts](https://recharts.org/) for the frontend stack

---

<div align="center">

**[↑ Back to top](#nourishbot-ai-coach)**

</div>
