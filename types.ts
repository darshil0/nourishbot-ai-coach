export enum Workflow {
  ANALYSIS = 'ANALYSIS',
  RECIPE = 'RECIPE',
}

export enum DietaryPreference {
  NONE = 'None',
  VEGAN = 'Vegan',
  VEGETARIAN = 'Vegetarian',
  GLUTEN_FREE = 'Gluten-Free',
  KETO = 'Keto',
  PALEO = 'Paleo',
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionData {
  foodItems: string[];
  totalCalories: number;
  macros: MacroNutrients;
  micros: string[];
  healthScore: number;
  healthSummary: string;
  suggestions: string[];
}

export interface RecipeData {
  title: string;
  description: string;
  prepTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  dietaryTags: string[];
}

export interface AgentLog {
  agentName: string;
  message: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  timestamp: Date;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string;
  workflow: Workflow;
  diet?: DietaryPreference;
  result: NutritionData | RecipeData;
  label: string;
}
