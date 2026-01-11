import { NutritionData, RecipeData, DietaryPreference } from '../types';

async function callProxy(agent: string, payload: any) {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agent, payload }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'API request failed');
    }

    const result = await response.json();
    return JSON.parse(result.text);
}

export async function visionAgent(imageBase64: string): Promise<string[]> {
    try {
        const result = await callProxy('vision', { imageBase64 });
        if (typeof result === 'string') {
            return result.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return [];
    } catch (error) {
        console.error('Vision agent error:', error);
        throw new Error('Failed to analyze image via proxy');
    }
}

export async function nutritionAnalyst(items: string[]): Promise<NutritionData> {
    try {
        return await callProxy('nutrition', { items });
    } catch (error) {
        console.error('Nutrition analyst error:', error);
        throw new Error('Failed to analyze nutrition via proxy');
    }
}

export async function culinaryExpert(items: string[], preference: DietaryPreference): Promise<RecipeData> {
    try {
        return await callProxy('recipe', { items, preference });
    } catch (error) {
        console.error('Culinary expert error:', error);
        throw new Error('Failed to generate recipe via proxy');
    }
}
