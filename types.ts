export enum Workflow {
  ANALYSIS = 'analysis',
  RECIPE = 'recipe',
}

export enum DietaryPreference {
  NONE = 'none',
  VEGAN = 'vegan',
  VEGETARIAN = 'vegetarian',
  DAIRY_FREE = 'dairy-free',
  GLUTEN_FREE = 'gluten-free',
  KETO = 'keto',
  PALEO = 'paleo',
  LOW_CARB = 'low-carb',
}

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

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
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
  diet: DietaryPreference;
  result: NutritionData | RecipeData;
  label: string;
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isRecipeIngredientArray = (value: unknown): value is RecipeIngredient[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>).name === 'string' &&
      typeof (item as Record<string, unknown>).amount === 'number' &&
      typeof (item as Record<string, unknown>).unit === 'string',
  );

const isDietaryPreferenceArray = (value: unknown): value is DietaryPreference[] =>
  Array.isArray(value) &&
  value.every((item) => typeof item === 'string' && Object.values(DietaryPreference).includes(item as DietaryPreference));

export function isNutritionData(result: NutritionData | RecipeData): result is NutritionData {
  return 'calories' in result && 'healthScore' in result && !('title' in result);
}

export function isRecipeData(result: NutritionData | RecipeData): result is RecipeData {
  return 'title' in result && 'ingredients' in result && !('healthScore' in result);
}

export function validateNutritionData(data: unknown): NutritionData | null {
  if (!data || typeof data !== 'object') return null;

  const obj = data as Record<string, unknown>;

  if (
    typeof obj.calories !== 'number' ||
    typeof obj.protein !== 'number' ||
    typeof obj.carbohydrates !== 'number' ||
    typeof obj.fat !== 'number' ||
    typeof obj.healthScore !== 'number' ||
    !isStringArray(obj.tags)
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
    tags: obj.tags,
    notes: typeof obj.notes === 'string' ? obj.notes : undefined,
  };
}

export function validateRecipeData(data: unknown): RecipeData | null {
  if (!data || typeof data !== 'object') return null;

  const obj = data as Record<string, unknown>;

  if (
    typeof obj.title !== 'string' ||
    typeof obj.description !== 'string' ||
    !isRecipeIngredientArray(obj.ingredients) ||
    !isStringArray(obj.instructions) ||
    typeof obj.prepTime !== 'number' ||
    typeof obj.cookTime !== 'number' ||
    typeof obj.servings !== 'number' ||
    !isStringArray(obj.tags) ||
    !isDietaryPreferenceArray(obj.dietaryCompliance)
  ) {
    return null;
  }

  return {
    title: obj.title,
    description: obj.description,
    ingredients: obj.ingredients,
    instructions: obj.instructions,
    prepTime: obj.prepTime,
    cookTime: obj.cookTime,
    servings: obj.servings,
    calories: typeof obj.calories === 'number' ? obj.calories : undefined,
    tags: obj.tags,
    dietaryCompliance: obj.dietaryCompliance,
  };
}
