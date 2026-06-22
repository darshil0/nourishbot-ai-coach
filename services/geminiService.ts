import { DietaryPreference, NutritionData, RecipeData } from '../types';

async function callProxy(agent: string, payload: any): Promise<string> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent, payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Proxy error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.text || '';
}

// Vision Agent: Identifies food ingredients from image
export async function visionAgent(imageBase64: string): Promise<string[]> {
  try {
    const response = await callProxy('vision', { imageBase64 });
    
    // The proxy returns a comma-separated list for vision agent
    if (response) {
      return response.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    
    return ['unknown food'];
  } catch (error) {
    console.error('Vision Agent error:', error);
    return ['unknown food'];
  }
}

// Nutrition Analyst: Calculates nutritional data from ingredients
export async function nutritionAnalyst(ingredients: string[]): Promise<NutritionData> {
  try {
    const response = await callProxy('nutrition', { items: ingredients });
    const parsed = JSON.parse(response);
    
    return parsed as NutritionData;
  } catch (error) {
    console.error('Nutrition Analyst error:', error);
    
    return {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      healthScore: 0,
      tags: [],
      notes: 'Error calculating nutrition'
    };
  }
}

// Culinary Expert: Creates recipe based on ingredients and dietary preference
export async function culinaryExpert(
  ingredients: string[],
  diet: DietaryPreference
): Promise<RecipeData> {
  try {
    const response = await callProxy('recipe', { items: ingredients, preference: diet });
    const parsed = JSON.parse(response);
    
    return parsed as RecipeData;
  } catch (error) {
    console.error('Culinary Expert error:', error);
    
    return {
      title: 'Error generating recipe',
      description: '',
      ingredients: [],
      instructions: [],
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      tags: [],
      dietaryCompliance: [diet]
    };
  }
}
