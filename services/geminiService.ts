import { DietaryPreference } from '../types';

// Mock implementation - replace with actual Gemini API calls
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callGemini(prompt: string, imageBase64?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Fallback mock response for development
    return mockGeminiResponse(prompt);
  }

  const contents: unknown[] = [];
  
  if (imageBase64) {
    contents.push({
      parts: [
        { text: prompt },
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
      ]
    });
  } else {
    contents.push({
      parts: [{ text: prompt }]
    });
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Mock responses for development without API key
function mockGeminiResponse(prompt: string): string {
  if (prompt.includes('identify ingredients') || prompt.includes('visual processing')) {
    return JSON.stringify(['chicken', 'rice', 'broccoli', 'carrots']);
  }
  
  if (prompt.includes('nutrition') || prompt.includes('caloric')) {
    return JSON.stringify({
      calories: 450,
      protein: 35,
      carbohydrates: 50,
      fat: 12,
      fiber: 6,
      sugar: 4,
      sodium: 680,
      healthScore: 82,
      tags: ['high-protein', 'balanced', 'whole-food'],
      notes: 'Well-balanced meal with good protein-to-carb ratio'
    });
  }

  if (prompt.includes('recipe') || prompt.includes('compliant')) {
    const diet = prompt.match(/(vegan|vegetarian|keto|gluten-free)/i)?.[1] || 'standard';
    return JSON.stringify({
      title: `Healthy ${diet} Chicken Rice Bowl`,
      description: `A nutritious and ${diet}-compliant meal featuring tender chicken and fresh vegetables`,
      ingredients: [
        { name: 'Chicken breast', amount: 200, unit: 'g' },
        { name: 'Brown rice', amount: 150, unit: 'g' },
        { name: 'Broccoli', amount: 100, unit: 'g' },
        { name: 'Carrots', amount: 80, unit: 'g' },
        { name: 'Olive oil', amount: 1, unit: 'tbsp' }
      ],
      instructions: [
        'Cook brown rice according to package directions',
        'Season and grill chicken breast until golden',
        'Steam broccoli and carrots until tender-crisp',
        'Slice chicken and arrange over rice',
        'Top with vegetables and drizzle with olive oil'
      ],
      prepTime: 15,
      cookTime: 25,
      servings: 2,
      calories: 450,
      tags: ['high-protein', 'balanced', 'meal-prep-friendly'],
      dietaryCompliance: [diet as DietaryPreference]
    });
  }

  return JSON.stringify(['unknown ingredients']);
}

// Vision Agent: Identifies food ingredients from image
export async function visionAgent(imageBase64: string): Promise<string[]> {
  const prompt = 'Identify all food ingredients in this image. Return only a JSON array of ingredient names like ["chicken", "rice", "broccoli"].';
  
  try {
    const response = await callGemini(prompt, imageBase64);
    const parsed = JSON.parse(response);
    
    if (Array.isArray(parsed)) {
      return parsed.filter(item => typeof item === 'string');
    }
    
    // Fallback parsing
    return response.match(/["']([^"']+)["']/g)?.map(s => s.slice(1, -1)) || ['unknown food'];
  } catch (error) {
    console.error('Vision Agent error:', error);
    return ['unknown food'];
  }
}

// Nutrition Analyst: Calculates nutritional data from ingredients
export async function nutritionAnalyst(ingredients: string[]): Promise<NutritionData> {
  const prompt = `Calculate nutrition data for these ingredients: ${ingredients.join(', ')}. Return JSON with calories, protein, carbohydrates, fat, fiber, sugar, sodium, healthScore, tags, and notes.`;
  
  try {
    const response = await callGemini(prompt);
    const parsed = JSON.parse(response);
    
    // Validate and return
    if (
      typeof parsed.calories === 'number' &&
      typeof parsed.protein === 'number' &&
      typeof parsed.healthScore === 'number'
    ) {
      return parsed as NutritionData;
    }
    
    // Fallback mock data
    return {
      calories: 400,
      protein: 30,
      carbohydrates: 45,
      fat: 10,
      fiber: 5,
      healthScore: 75,
      tags: ['balanced'],
      notes: 'Estimated nutrition data'
    };
  } catch (error) {
    console.error('Nutrition Analyst error:', error);
    
    return {
      calories: 400,
      protein: 30,
      carbohydrates: 45,
      fat: 10,
      fiber: 5,
      healthScore: 75,
      tags: ['balanced'],
      notes: 'Estimated nutrition data'
    };
  }
}

// Culinary Expert: Creates recipe based on ingredients and dietary preference
export async function culinaryExpert(
  ingredients: string[],
  diet: DietaryPreference
): Promise<RecipeData> {
  const prompt = `Create a ${diet} compliant recipe using: ${ingredients.join(', ')}. Return JSON with title, description, ingredients (array of {name, amount, unit}), instructions (array), prepTime, cookTime, servings, calories, tags, and dietaryCompliance.`;
  
  try {
    const response = await callGemini(prompt);
    const parsed = JSON.parse(response);
    
    // Validate and return
    if (
      typeof parsed.title === 'string' &&
      Array.isArray(parsed.ingredients) &&
      Array.isArray(parsed.instructions)
    ) {
      return parsed as RecipeData;
    }
    
    // Fallback mock data
    return {
      title: `${diet} Meal Bowl`,
      description: `A nutritious ${diet}-compliant meal`,
      ingredients: ingredients.map(ing => ({
        name: ing,
        amount: 100,
        unit: 'g'
      })),
      instructions: ['Cook all ingredients according to best practices', 'Serve hot'],
      prepTime: 10,
      cookTime: 20,
      servings: 2,
      calories: 400,
      tags: [diet, 'balanced'],
      dietaryCompliance: [diet]
    };
  } catch (error) {
    console.error('Culinary Expert error:', error);
    
    return {
      title: `${diet} Meal Bowl`,
      description: `A nutritious ${diet}-compliant meal`,
      ingredients: ingredients.map(ing => ({
        name: ing,
        amount: 100,
        unit: 'g'
      })),
      instructions: ['Cook all ingredients according to best practices', 'Serve hot'],
      prepTime: 10,
      cookTime: 20,
      servings: 2,
      calories: 400,
      tags: [diet, 'balanced'],
      dietaryCompliance: [diet]
    };
  }
}
