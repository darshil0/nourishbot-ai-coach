# NourishBot AI – Developer Walkthrough

A comprehensive technical guide to understanding and extending the multi-agent nutrition coaching system.

---

## 📑 Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Core Types & Data Models](#2-core-types--data-models)
3. [Multi-Agent Orchestration](#3-multi-agent-orchestration)
4. [Gemini AI Integration](#4-gemini-ai-integration)
5. [UI Components](#5-ui-components)
6. [State Management](#6-state-management)
7. [Local Storage & History](#7-local-storage--history)
8. [Error Handling](#8-error-handling)
9. [Development Workflow](#9-development-workflow)
10. [Extending the System](#10-extending-the-system)
11. [Performance Considerations](#11-performance-considerations)
12. [Troubleshooting Guide](#12-troubleshooting-guide)

---

## 1. Architecture Overview

### High-Level Flow

```
User Upload Image
       ↓
Vision Agent (Gemini 2.0 Flash)
       ↓
Ingredients List
       ↓
   Workflow Branch
       ↓
   ┌───────────────────┐
   ↓                   ↓
Analysis            Recipe
   ↓                   ↓
Nutrition          Nutrition + Culinary
Analyst            Analyst    Expert
   ↓                   ↓
Nutrition          Recipe
Data               Data
   ↓                   ↓
   └───────────────────┘
           ↓
    UI Rendering
           ↓
    Save to History
```

### Technology Stack

**Frontend**
- **React 18.3.1** - UI library with hooks
- **TypeScript 5.8.3** - Type-safe development
- **Vite 6.2.3** - Build tool and dev server
- **TailwindCSS 3.x** - Utility-first CSS (via CDN)

**AI Integration**
- **Google Generative AI 0.21.0** - Gemini API SDK
- **Gemini 2.0 Flash Exp** - Vision and text generation model

**Visualization**
- **Recharts 2.13.3** - React charting library
- **Lucide React 0.460.0** - Icon library

**Code Quality**
- **ESLint 9.18.0** - Linting
- **Prettier 3.4.2** - Code formatting

---

## 2. Core Types & Data Models

All types are defined in `types.ts`:

### Workflow Enum

```typescript
export enum Workflow {
  ANALYSIS = 'ANALYSIS',  // Nutrition breakdown
  RECIPE = 'RECIPE'       // Recipe generation
}
```

### Dietary Preferences

```typescript
export enum DietaryPreference {
  NONE = 'None',
  VEGAN = 'Vegan',
  VEGETARIAN = 'Vegetarian',
  GLUTEN_FREE = 'Gluten-Free',
  KETO = 'Keto',
  PALEO = 'Paleo'
}
```

### Data Models

#### MacroNutrients
```typescript
interface MacroNutrients {
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
}
```

#### NutritionData
```typescript
interface NutritionData {
  foodItems: string[];          // Identified ingredients
  totalCalories: number;        // Total kcal
  macros: MacroNutrients;       // Protein, carbs, fat
  micros: string[];             // Vitamins, minerals
  healthScore: number;          // 1-100 rating
  healthSummary: string;        // AI-generated summary
  suggestions: string[];        // Improvement suggestions
}
```

#### RecipeData
```typescript
interface RecipeData {
  title: string;                // Recipe name
  description: string;          // Brief description
  prepTime: string;             // e.g., "30 minutes"
  servings: number;             // Number of servings
  ingredients: string[];        // Ingredient list
  instructions: string[];       // Step-by-step instructions
  dietaryTags: string[];        // Tags like "Vegan", "High-Protein"
}
```

#### AgentLog
```typescript
interface AgentLog {
  agentName: string;                                      // Agent identifier
  message: string;                                        // Status message
  status: 'pending' | 'processing' | 'completed' | 'error';
  timestamp: Date;                                        // When logged
}
```

#### HistoryItem
```typescript
interface HistoryItem {
  id: string;                           // Unique identifier
  timestamp: number;                    // Unix timestamp
  image: string;                        // Base64 image data
  workflow: Workflow;                   // Analysis or Recipe
  diet?: DietaryPreference;             // Optional diet type
  result: NutritionData | RecipeData;   // Result data
  label: string;                        // User-editable label
}
```

---

## 3. Multi-Agent Orchestration

The main orchestration happens in `App.tsx` within the `runMultiAgentPipeline` function.

### Pipeline Flow

```typescript
async function runMultiAgentPipeline() {
  // 1. Setup
  setLoading(true);
  setLogs([]);
  
  // 2. Extract base64 image data
  const base64Data = image.split(',')[1];
  
  // 3. Phase 1: Vision Agent
  addLog('Vision Agent', 'Initializing...', 'processing');
  const ingredients = await visionAgent(base64Data);
  addLog('Vision Agent', `Found: ${ingredients.join(', ')}`, 'completed');
  
  // 4. Workflow Branch
  if (workflow === Workflow.ANALYSIS) {
    // Analysis Path
    addLog('Nutrition Analyst', 'Analyzing...', 'processing');
    const nutrition = await nutritionAnalyst(ingredients);
    setNutritionResult(nutrition);
    addLog('Nutrition Analyst', 'Complete', 'completed');
  } else {
    // Recipe Path
    addLog('Nutrition Analyst', 'Brief scan...', 'processing');
    await nutritionAnalyst(ingredients);
    addLog('Nutrition Analyst', 'Context passed', 'completed');
    
    addLog('Culinary Expert', 'Creating recipe...', 'processing');
    const recipe = await culinaryExpert(ingredients, diet);
    setRecipeResult(recipe);
    addLog('Culinary Expert', 'Recipe ready', 'completed');
  }
  
  // 5. Save to history
  const historyItem = { /* ... */ };
  setHistory(prev => [historyItem, ...prev].slice(0, MAX_HISTORY));
  
  // 6. Cleanup
  setLoading(false);
}
```

### Agent Communication Pattern

Each agent follows this pattern:

1. **Log Start** - Update UI with "processing" status
2. **API Call** - Make request to Gemini
3. **Parse Response** - Extract and validate data
4. **Log Completion** - Update UI with "completed" status
5. **Return Data** - Pass to next agent or UI

---

## 4. Gemini AI Integration

Located in `services/geminiService.ts`, this file handles all AI interactions.

### SDK Initialization

```typescript
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
```

### Agent 1: Vision Specialist

**Purpose**: Identify food items from images

```typescript
export async function visionAgent(imageBase64: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp' 
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    },
    {
      text: 'List every identifiable food ingredient or dish in this image. Return only a comma-separated list of items.',
    },
  ]);

  const response = await result.response;
  const text = response.text().trim();

  return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
}
```

**Key Points**:
- Uses multimodal input (image + text)
- Simple prompt for comma-separated list
- Post-processes response into array

### Agent 2: Nutrition Analyst

**Purpose**: Calculate detailed nutritional breakdown

```typescript
export async function nutritionAnalyst(
  items: string[]
): Promise<NutritionData> {
  const prompt = `Act as a senior nutritional scientist. Analyze this list of ingredients: ${items.join(', ')}. Provide a detailed nutritional breakdown. Estimate portion sizes reasonably for a single meal.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          foodItems: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }},
          totalCalories: { type: SchemaType.NUMBER },
          macros: {
            type: SchemaType.OBJECT,
            properties: {
              protein: { type: SchemaType.NUMBER },
              carbs: { type: SchemaType.NUMBER },
              fat: { type: SchemaType.NUMBER }
            },
            required: ['protein', 'carbs', 'fat']
          },
          // ... more properties
        },
        required: ['foodItems', 'totalCalories', 'macros', 'healthScore', 'healthSummary']
      }
    }
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
```

**Key Points**:
- Uses structured output with JSON schema
- Schema enforces TypeScript interface shape
- No need for manual parsing/validation

### Agent 3: Culinary Expert

**Purpose**: Generate creative, diet-specific recipes

```typescript
export async function culinaryExpert(
  items: string[],
  preference: DietaryPreference
): Promise<RecipeData> {
  const prompt = `Act as a world-class chef. Create a creative recipe using these items: ${items.join(', ')}. The recipe MUST follow these dietary restrictions: ${preference}. Focus on high-quality flavor profile and easy preparation.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          prepTime: { type: SchemaType.STRING },
          servings: { type: SchemaType.NUMBER },
          ingredients: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }},
          instructions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }},
          dietaryTags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }}
        },
        required: ['title', 'description', 'ingredients', 'instructions']
      }
    }
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
```

**Key Points**:
- Incorporates dietary preferences in prompt
- Returns structured recipe format
- Includes steps and metadata

### Error Handling Pattern

All agents follow this error handling pattern:

```typescript
try {
  // API call
  const result = await model.generateContent(/* ... */);
  return processedData;
} catch (error) {
  console.error('Agent name error:', error);
  throw new Error('User-friendly error message');
}
```

---

## 5. UI Components

### AgentStatus Component

**File**: `components/AgentStatus.tsx`

**Purpose**: Real-time agent pipeline visualization

```typescript
export const AgentStatus: React.FC<{ logs: AgentLog[] }> = ({ logs }) => {
  const icons = {
    pending: <Activity />,
    processing: <Loader2 className="animate-spin" />,
    completed: <CheckCircle />,
    error: <AlertCircle />
  };

  return (
    <div>
      {logs.map((log, idx) => (
        <div key={idx}>
          {icons[log.status]}
          <span>{log.agentName}</span>
          <p>{log.message}</p>
          <time>{log.timestamp}</time>
        </div>
      ))}
    </div>
  );
};
```

**Features**:
- Chronological log display
- Status icons with animations
- Timestamp formatting
- Empty state handling

### NutritionAnalysis Component

**File**: `components/NutritionAnalysis.tsx`

**Purpose**: Visualize nutrition data with charts

```typescript
export const NutritionAnalysis: React.FC<{ data: NutritionData }> = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.macros.protein },
    { name: 'Carbs', value: data.macros.carbs },
    { name: 'Fat', value: data.macros.fat },
  ];

  return (
    <>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={chartData} /* ... */ />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Calories, health score, suggestions */}
    </>
  );
};
```

**Features**:
- Interactive pie chart for macros
- Health score progress bar
- Micronutrient tags
- Improvement suggestions

### RecipeCard Component

**File**: `components/RecipeCard.tsx`

**Purpose**: Display generated recipes

```typescript
export const RecipeCard: React.FC<{ recipe: RecipeData }> = ({ recipe }) => {
  return (
    <div>
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>
      
      {/* Metadata: prep time, servings */}
      
      <div>
        <h3>Ingredients</h3>
        <ul>{recipe.ingredients.map(/* ... */)}</ul>
      </div>
      
      <div>
        <h3>Instructions</h3>
        {recipe.instructions.map((step, i) => (
          <div key={i}>
            <span>{i + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Features**:
- Dietary tags display
- Metadata icons
- Numbered instructions
- Responsive grid layout

### HistoryLog Component

**File**: `components/HistoryLog.tsx`

**Purpose**: Manage past analyses and recipes

```typescript
export const HistoryLog: React.FC<Props> = ({
  items,
  onSelect,
  onDelete,
  onUpdateLabel,
  activeId
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Inline editing logic
  const handleSave = (id: string) => {
    if (editValue.trim()) {
      onUpdateLabel(id, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div>
      {items.map(item => (
        <div 
          key={item.id}
          onClick={() => onSelect(item)}
          className={activeId === item.id ? 'active' : ''}
        >
          <img src={item.image} alt="" />
          
          {editingId === item.id ? (
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave(item.id);
                if (e.key === 'Escape') setEditingId(null);
              }}
            />
          ) : (
            <p onDoubleClick={(e) => startEditing(e, item)}>
              {item.label}
            </p>
          )}
          
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
```

**Features**:
- Click to load history item
- Double-click or button to edit label
- Delete functionality
- Visual active state
- Keyboard shortcuts (Enter/Escape)

---

## 6. State Management

The app uses React hooks for state management:

### Main App State

```typescript
// Image and workflow selection
const [image, setImage] = useState<string | null>(null);
const [workflow, setWorkflow] = useState<Workflow>(Workflow.ANALYSIS);
const [diet, setDiet] = useState<DietaryPreference>(DietaryPreference.NONE);

// Loading and logging
const [loading, setLoading] = useState(false);
const [logs, setLogs] = useState<AgentLog[]>([]);

// Results
const [nutritionResult, setNutritionResult] = useState<NutritionData | null>(null);
const [recipeResult, setRecipeResult] = useState<RecipeData | null>(null);

// History
const [history, setHistory] = useState<HistoryItem[]>([]);
const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
```

### State Update Patterns

#### Adding Logs
```typescript
const addLog = (agent: string, message: string, status: AgentLog['status']) => {
  setLogs(prev => [{
    agentName: agent,
    message,
    status,
    timestamp: new Date()
  }, ...prev]);
};
```

#### Updating History
```typescript
const handleUpdateHistoryLabel = (id: string, newLabel: string) => {
  setHistory(prev => 
    prev.map(item => 
      item.id === id ? { ...item, label: newLabel } : item
    )
  );
};
```

#### Deleting History
```typescript
const deleteHistoryItem = (id: string) => {
  setHistory(prev => prev.filter(item => item.id !== id));
  if (activeHistoryId === id) {
    reset();
  }
};
```

---

## 7. Local Storage & History

### Storage Implementation

```typescript
const STORAGE_KEY = 'nourishbot_history';
const MAX_HISTORY = 10;

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      setHistory(JSON.parse(saved));
    } catch (error) {
      console.error('Failed to parse history:', error);
    }
  }
}, []);

// Save on history change
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}, [history]);
```

### History Item Creation

```typescript
const newHistoryItem: HistoryItem = {
  id: Math.random().toString(36).slice(2, 11),
  timestamp: Date.now(),
  image,
  workflow,
  diet,
  result: finalResult,
  label: recipe?.title || ingredients[0] || 'Meal Analysis'
};

setHistory(prev => [newHistoryItem, ...prev].slice(0, MAX_HISTORY));
```

**Key Points**:
- Automatic truncation to MAX_HISTORY items
- Random ID generation (consider UUID for production)
- Stores complete result data for re-display

---

## 8. Error Handling

### API Error Handling

All Gemini service functions use try-catch:

```typescript
try {
  const result = await model.generateContent(/* ... */);
  return processedData;
} catch (error) {
  console.error('Vision agent error:', error);
  throw new Error('Failed to analyze image');
}
```

### UI Error Display

In the orchestration pipeline:

```typescript
try {
  // ... agent calls
} catch (error) {
  console.error('Multi-agent orchestration error:', error);
  addLog('System', 'An error occurred during multi-agent orchestration.', 'error');
} finally {
  setLoading(false);
}
```

### Error States in UI

Components check for error status:

```typescript
{logs.some(log => log.status === 'error') && (
  <div className="error-banner">
    An error occurred. Please try again.
  </div>
)}
```

---

## 9. Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Server runs at http://localhost:5173
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Format code
npm run format

# Check formatting (CI/CD)
npm run format:check
```

### Building

```bash
# Type check + build
npm run build

# Output in dist/

# Preview production build
npm run preview
```

### File Watching

Vite watches these file types:
- `.ts`, `.tsx` - TypeScript/React
- `.css` - Stylesheets (though we use Tailwind CDN)
- `.html` - Entry point
- `.json` - Config files

Changes trigger instant HMR (Hot Module Replacement).

---

## 10. Extending the System

### Adding a New Dietary Preference

**Step 1**: Update enum in `types.ts`

```typescript
export enum DietaryPreference {
  // ... existing
  LOW_CARB = 'Low-Carb',
  MEDITERRANEAN = 'Mediterranean'
}
```

**Step 2**: Update UI dropdown

The dropdown in `App.tsx` automatically populates from the enum:

```typescript
{Object.values(DietaryPreference).map(pref => (
  <option key={pref} value={pref}>{pref}</option>
))}
```

**Step 3**: Update Culinary Expert prompt (optional)

Add specific instructions in `services/geminiService.ts`:

```typescript
const prompt = `... The recipe MUST follow these dietary restrictions: ${preference}.
${preference === DietaryPreference.LOW_CARB ? 'Keep carbs under 20g per serving.' : ''}`;
```

### Adding a New Agent

**Step 1**: Create agent function in `services/geminiService.ts`

```typescript
export async function mealPlannerAgent(
  nutritionData: NutritionData,
  goals: string
): Promise<MealPlanData> {
  const prompt = `Create a 7-day meal plan based on these nutrition targets...`;
  
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: { /* ... */ }
    }
  });

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

**Step 2**: Add type in `types.ts`

```typescript
export interface MealPlanData {
  days: Array<{
    date: string;
    meals: Array<{ name: string; recipe: string }>;
  }>;
}
```

**Step 3**: Integrate into pipeline in `App.tsx`

```typescript
if (workflow === Workflow.MEAL_PLAN) {
  addLog('Meal Planner', 'Creating 7-day plan...', 'processing');
  const plan = await mealPlannerAgent(nutrition, userGoals);
  setMealPlanResult(plan);
  addLog('Meal Planner', 'Plan ready', 'completed');
}
```

**Step 4**: Create UI component

```typescript
// components/MealPlanView.tsx
export const MealPlanView: React.FC<{ plan: MealPlanData }> = ({ plan }) => {
  return (
    <div>
      {plan.days.map((day, i) => (
        <div key={i}>
          <h3>{day.date}</h3>
          {day.meals.map((meal, j) => (
            <div key={j}>{meal.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

### Adding New Data to History

**Step 1**: Update `HistoryItem` type

```typescript
export interface HistoryItem {
  // ... existing fields
  userNotes?: string;  // Add optional field
}
```

**Step 2**: Update history creation

```typescript
const newHistoryItem: HistoryItem = {
  // ... existing
  userNotes: userNotes || undefined
};
```

**Step 3**: Update HistoryLog display

```typescript
{item.userNotes && (
  <p className="text-sm text-slate-500">{item.userNotes}</p>
)}
```

---

## 11. Performance Considerations

### Image Optimization

Current implementation converts to base64. For production, consider:

```typescript
// Resize before upload
const resizeImage = (file: File, maxWidth: number): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
```

### Memoization

For expensive computations:

```typescript
import { useMemo } from 'react';

const chartData = useMemo(() => [
  { name: 'Protein', value: data.macros.protein },
  { name: 'Carbs', value: data.macros.carbs },
  { name: 'Fat', value: data.macros.fat },
], [data.macros]);
```

### Debouncing

For search/filter features:

```typescript
import { useState, useEffect } from 'react';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

---

## 12. Troubleshooting Guide

### Common Issues

#### 1. "Module not found: @google/generative-ai"

**Cause**: Package not installed or using old import

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

Verify import:
```typescript
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
```

#### 2. API Calls Fail with 400 Error

**Causes**:
- Invalid API key
- Incorrect schema
- Rate limiting

**Solutions**:
```typescript
// Verify API key
console.log('API Key exists:', !!import.meta.env.VITE_GEMINI_API_KEY);

// Add error logging
catch (error) {
  console.error('Full error:', error);
  if (error.response) {
    console.error('Response:', error.response.data);
  }
}
```

#### 3. History Not Persisting

**Cause**: localStorage quota exceeded or privacy mode

**Solution**:
```typescript
// Check quota
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage available');
} catch (e) {
  console.error('localStorage not available:', e);
}

// Add error handling
useEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history:', error);
    // Fallback: keep in memory only
  }
}, [history]);
```

#### 4. Charts Not Rendering

**Causes**:
- Missing data
- Container size issues
- Recharts import errors

**Solutions**:
```typescript
// Validate data
if (!data || !data.macros) {
  return <div>No data available</div>;
}

// Ensure container has dimensions
<div style={{ width: '100%', height: '300px' }}>
  <ResponsiveContainer>
    <PieChart>...</PieChart>
  </ResponsiveContainer>
</div>
```

#### 5. TypeScript Errors After Update

**Solution**:
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Reinstall
npm install

# Restart TypeScript server in IDE
# VSCode: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

### Debug Mode

Add environment variable for verbose logging:

```typescript
// .env
VITE_DEBUG_MODE=true

// App.tsx
const DEBUG = import.meta.env.VITE_DEBUG_MODE === 'true';

if (DEBUG) {
  console.log('State:', { image, workflow, diet, loading });
}
```

---

## 🎓 Best Practices

### Code Organization
1. Keep components focused on single responsibility
2. Extract complex logic into custom hooks
3. Use TypeScript strictly (no `any` types)
4. Add JSDoc comments for complex functions

### State Management
1. Minimize state - derive when possible
2. Colocate state with components that use it
3. Use callbacks for child-to-parent communication
4. Consider Context for deeply nested props

### Error Handling
1. Always wrap API calls in try-catch
2. Provide user-friendly error messages
3. Log detailed errors to console
4. Show retry options to users

### Performance
1. Memoize expensive calculations
2. Use React.memo for pure components
3. Implement virtual scrolling for long lists
4. Lazy load heavy components

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Google Generative AI SDK](https://ai.google.dev/tutorials/node_quickstart)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🤝 Contributing

When extending this codebase:

1. Follow existing patterns and conventions
2. Update types in `types.ts` first
3. Add comprehensive error handling
4. Write JSDoc comments for new functions
5. Update this walkthrough with new features
6. Test thoroughly before committing
