// Workflow enum for analysis vs recipe modes
export enum Workflow {
  ANALYSIS = 'analysis',
  RECIPE = 'recipe',
}

// Dietary preference options
export enum DietaryPreference {
  NONE = 'none',
  VEGAN = 'vegan',
  VEGETARIAN = 'vegetarian',
  DAIRY_FREE = 'dairy-free',
  GLUTEN_FREE = 'gluten-free',
  KETO = 'keto',
  PALEO = 'paleo',
  LOW_CARD = 'low-carb',
}

// Nutrition data structure returned by nutritionAnalyst
export interface NutritionData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  healthScore: number;
  tags: string[];
  notes?: string;
}

// Recipe data structure returned by culinaryExpert
export interface RecipeData {
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories?: number;
  tags: string[];
  dietaryCompliance: DietaryPreference[];
}

// Individual recipe ingredient
export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

// Agent log entry for orchestration debugging
export interface AgentLog {
  agentName: string;
  message: string;
  status: 'processing' | 'completed' | 'error';
  timestamp: Date;
}

// History item for persisted analyses
export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string;
  workflow: Workflow;
  diet: DietaryPreference;
  result: NutritionData | RecipeData;
  label: string;
}

// Type guards for runtime validation
export function isNutritionData(result: NutritionData | RecipeData): result is NutritionData {
  return 'calories' in result && 'healthScore' in result && !('title' in result);
}

export function isRecipeData(result: NutritionData | RecipeData): result is RecipeData {
  return 'title' in result && 'ingredients' in result && !('healthScore' in result);
}

// Runtime validation helpers for API responses
export function validateNutritionData(data: unknown): NutritionData | null {
  if (!data || typeof data !== 'object') return null;
  
  const obj = data as Record<string, unknown>;
  
  if (
    typeof obj.calories !== 'number' ||
    typeof obj.protein !== 'number' ||
    typeof obj.carbohydrates !== 'number' ||
    typeof obj.fat !== 'number' ||
    typeof obj.healthScore !== 'number' ||
    !Array.isArray(obj.tags)
  ) {
    return null;
  }
  
  return {
    calories: obj.calories,
    protein: obj.protein,
    carbohydrates: obj.carbohydrates,
    fat: obj.fat,
    fiber: typeof obj.fiber === 'number' ? obj.fiber : undefined,
    sugar: typeof obj.sugar === 'number' ? obj.sugar : undefined,
    sodium: typeof obj.sodium === 'number' ? obj.sodium : undefined,
    healthScore: obj.healthScore,
    tags: obj.tags as string[],
    notes: typeof obj.notes === 'string' ? obj.notes : undefined,
  };
}

export function validateRecipeData(data: unknown): RecipeData | null {
  if (!data || typeof data !== 'object') return null;
  
  const obj = data as Record<string, unknown>;
  
  if (
    typeof obj.title !== 'string' ||
    typeof obj.description !== 'string' ||
    !Array.isArray(obj.ingredients) ||
    !Array.isArray(obj.instructions) ||
    typeof obj.prepTime !== 'number' ||
    typeof obj.cookTime !== 'number' ||
    typeof obj.servings !== 'number' ||
    !Array.isArray(obj.tags) ||
    !Array.isArray(obj.dietaryCompliance)
  ) {
    return null;
  }
  
  return {
    title: obj.title,
    description: obj.description,
    ingredients: obj.ingredients as RecipeIngredient[],
    instructions: obj.instructions as string[],
    prepTime: obj.prepTime,
    cookTime: obj.cookTime,
    servings: obj.servings,
    calories: typeof obj.calories === 'number' ? obj.calories : undefined,
    tags: obj.tags as string[],
    dietaryCompliance: obj.dietaryCompliance as DietaryPreference[],
  };
}
