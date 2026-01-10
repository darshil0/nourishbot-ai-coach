import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NutritionData, RecipeData, DietaryPreference } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!apiKey) {
  console.error(
    'VITE_GEMINI_API_KEY is not set. Please add it to your .env file.'
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Agent 1: Vision Specialist
 * Analyzes image to identify food components.
 */
export async function visionAgent(imageBase64: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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

    if (!text) {
      return [];
    }

    return text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  } catch (error) {
    console.error('Vision agent error:', error);
    throw new Error('Failed to analyze image');
  }
}

/**
 * Agent 2: Nutrition Analyst
 * Calculates nutritional value based on identified items.
 */
export async function nutritionAnalyst(
  items: string[]
): Promise<NutritionData> {
  try {
    const prompt = `Act as a senior nutritional scientist. Analyze this list of ingredients: ${items.join(
      ', '
    )}. Provide a detailed nutritional breakdown. 
  Estimate portion sizes reasonably for a single meal. Return strictly JSON following the schema.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            foodItems: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            totalCalories: { type: SchemaType.NUMBER },
            macros: {
              type: SchemaType.OBJECT,
              properties: {
                protein: { type: SchemaType.NUMBER },
                carbs: { type: SchemaType.NUMBER },
                fat: { type: SchemaType.NUMBER },
              },
              required: ['protein', 'carbs', 'fat'],
            },
            micros: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            healthScore: {
              type: SchemaType.NUMBER,
              description: 'Scale 1-100',
            },
            healthSummary: { type: SchemaType.STRING },
            suggestions: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
          },
          required: [
            'foodItems',
            'totalCalories',
            'macros',
            'healthScore',
            'healthSummary',
          ],
        },
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error('Nutrition analyst error:', error);
    throw new Error('Failed to analyze nutrition');
  }
}

/**
 * Agent 3: Culinary Expert
 * Generates a recipe based on ingredients and dietary preferences.
 */
export async function culinaryExpert(
  items: string[],
  preference: DietaryPreference
): Promise<RecipeData> {
  try {
    const prompt = `Act as a world-class chef. Create a creative recipe using these items: ${items.join(
      ', '
    )}. 
  The recipe MUST follow these dietary restrictions: ${preference}. 
  Focus on high-quality flavor profile and easy preparation. Return strictly JSON following the schema.`;

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
            ingredients: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            instructions: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            dietaryTags: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
          },
          required: ['title', 'description', 'ingredients', 'instructions'],
        },
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error('Culinary expert error:', error);
    throw new Error('Failed to generate recipe');
  }
}
