
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData, RecipeData, DietaryPreference } from "../types";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Agent 1: Vision Specialist
 * Analyzes image to identify food components.
 */
export async function visionAgent(imageBase64: string): Promise<string[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
      {
        text:
          "List every identifiable food ingredient or dish in this image. Return only a comma-separated list of items.",
      },
    ],
  });

  const text = (response.text || "").trim();
  if (!text) {
    return [];
  }

  return text
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Agent 2: Nutrition Analyst
 * Calculates nutritional value based on identified items.
 */
export async function nutritionAnalyst(items: string[]): Promise<NutritionData> {
  const prompt = `Act as a senior nutritional scientist. Analyze this list of ingredients: ${items.join(', ')}. Provide a detailed nutritional breakdown. 
  Estimate portion sizes reasonably for a single meal. Return strictly JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodItems: { type: Type.ARRAY, items: { type: Type.STRING } },
          totalCalories: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER }
            },
            required: ['protein', 'carbs', 'fat']
          },
          micros: { type: Type.ARRAY, items: { type: Type.STRING } },
          healthScore: { type: Type.NUMBER, description: "Scale 1-100" },
          healthSummary: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['foodItems', 'totalCalories', 'macros', 'healthScore', 'healthSummary']
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

/**
 * Agent 3: Culinary Expert
 * Generates a recipe based on ingredients and dietary preferences.
 */
export async function culinaryExpert(items: string[], preference: DietaryPreference): Promise<RecipeData> {
  const prompt = `Act as a world-class chef. Create a creative recipe using these items: ${items.join(', ')}. 
  The recipe MUST follow these dietary restrictions: ${preference}. 
  Focus on high-quality flavor profile and easy preparation. Return strictly JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          prepTime: { type: Type.STRING },
          servings: { type: Type.NUMBER },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['title', 'description', 'ingredients', 'instructions']
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
