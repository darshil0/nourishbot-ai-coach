# NourishBot AI – Developer Walkthrough

This walkthrough explains how the multi-agent pipeline is wired together so you can safely extend or modify the app.

## 1. High-Level Flow

1. User uploads a meal photo in `App.tsx`.
2. The **vision agent** (`visionAgent`) turns the image into a list of ingredients.
3. Depending on workflow:
   - **Analysis**: `nutritionAnalyst` returns a `NutritionData` object.
   - **Recipe**: `nutritionAnalyst` runs briefly, then `culinaryExpert` returns a `RecipeData` recipe.
4. The result is stored in local history and rendered via components.

## 2. Core Types

Defined in `types.ts`:

- `Workflow` – `ANALYSIS` or `RECIPE`
- `DietaryPreference` – `None`, `Vegan`, `Vegetarian`, `Gluten-Free`, `Keto`, `Paleo`
- `NutritionData` – macros, micros, total calories, health score, summary, suggestions
- `RecipeData` – title, description, prep time, servings, ingredients, instructions, dietary tags
- `HistoryItem` – captured runs stored in local history

Understanding these shapes is critical when changing Gemini prompts or UI components.

## 3. Multi-Agent Orchestration (`App.tsx`)

Key pieces:\r

- `runMultiAgentPipeline` orchestrates the call chain.
- `visionAgent` is always called first with base64 image data.
- Branching is done by `workflow`:
  - **Analysis** → `nutritionAnalyst` → `NutritionAnalysis` component.
  - **Recipe** → `nutritionAnalyst` (light pass) → `culinaryExpert` → `RecipeCard` component.
- `logs` (array of `AgentLog`) drives `AgentStatus` for UX feedback.
- Each run is persisted into `history` with a generated `id` and user-friendly `label`.

If you add new agents, follow the same pattern: update `logs`, extend `HistoryItem.result`, and attach a new component for visualization.

## 4. Gemini Integration (`services/geminiService.ts`)

- `GoogleGenAI` is initialized with `GEMINI_API_KEY` (falling back to `API_KEY` for compatibility).
- **Vision agent**: sends the image as inline binary plus a strict instruction to return a comma-separated list.
- **Nutrition analyst**: uses structured JSON output with `responseMimeType: "application/json"` and a schema matching `NutritionData`.
- **Culinary expert**: returns a recipe JSON object shaped like `RecipeData`.

When changing prompts, keep the return shape consistent with the TypeScript interfaces; otherwise, the UI may break at runtime.

## 5. UI Components

- `AgentStatus` – Renders the multi-agent timeline, mapping `AgentLog.status` to icons.
- `NutritionAnalysis` – Uses Recharts to draw a macro distribution pie chart and display health metrics.
- `RecipeCard` – Pretty-prints recipe metadata, ingredients, and step-by-step instructions.
- `HistoryLog` – Shows previous analyses/recipes, supports selecting an entry, deleting it, and inline renaming the label.

You can customize Tailwind classes directly in the JSX to tweak the look-and-feel.

## 6. Local History Behavior

- History is stored under the key `nourishbot_history` in `localStorage`.
- Only the most recent 10 entries are kept (see `MAX_HISTORY`).
- Selecting a history item repopulates the UI and logs a small coach message.

If you change the shape of `HistoryItem`, remember to handle backward compatibility when parsing old data from `localStorage`.

## 7. Extending the Project

Some ideas:

- Add more dietary preferences and propagate them through prompts/UI.
- Introduce a new agent that suggests substitutions for allergies.
- Add backend support so API keys are secured and rate limiting is centralized.
- Wire up analytics or logging to monitor agent performance.

## 8. Running & Formatting

Once Node and npm are installed:

```bash path=null start=null
npm install
npm run dev
```

For formatting, you can add Prettier or your preferred formatter, then run it over `*.ts`, `*.tsx`, and `*.md` files. The existing codebase is formatted in a Prettier-like style to serve as a baseline.