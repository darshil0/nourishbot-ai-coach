
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const NUTRITION_SCHEMA: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        foodItems: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
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
        micros: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        healthScore: { type: SchemaType.NUMBER },
        healthSummary: { type: SchemaType.STRING },
        suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    },
    required: ['foodItems', 'totalCalories', 'macros', 'healthScore', 'healthSummary'],
};

const RECIPE_SCHEMA: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
        prepTime: { type: SchemaType.STRING },
        servings: { type: SchemaType.NUMBER },
        ingredients: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        instructions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        dietaryTags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    },
    required: ['title', 'description', 'ingredients', 'instructions'],
};

import { IncomingMessage, ServerResponse } from 'http';

async function getBody(req: IncomingMessage): Promise<Record<string, unknown>> {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                resolve({});
            }
        });
    });
}

export function geminiProxyMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
    if (req.url !== '/api/generate') {
        return next();
    }

    (async () => {
        try {
            const body = await getBody(req);
            const agent = body.agent as string;
            const payload = body.payload as Record<string, unknown>;

            if (!agent || !payload) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing agent or payload' }));
                return;
            }

            if (!genAI) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server' }));
                return;
            }
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            let result;

            switch (agent) {
                case 'vision': {
                    const imageBase64 = payload.imageBase64 as string;
                    if (!imageBase64) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Missing imageBase64 for vision agent' }));
                        return;
                    }
                    const visionPrompt = [
                        { text: 'List every identifiable food ingredient or dish in this image. Return only a comma-separated list of items.' },
                        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                    ];
                    result = await model.generateContent(visionPrompt);
                    break;
                }
                case 'nutrition': {
                    const items = payload.items as string[];
                    if (!items) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Missing items for nutrition agent' }));
                        return;
                    }
                    const nutritionModel = genAI.getGenerativeModel({
                        model: 'gemini-1.5-flash',
                        generationConfig: {
                            responseMimeType: 'application/json',
                            responseSchema: NUTRITION_SCHEMA,
                        },
                    });
                    const prompt = `Act as a senior nutritional scientist. Analyze this list of ingredients: ${items.join(', ')}. Provide a detailed nutritional breakdown. Estimate portion sizes reasonably for a single meal.`;
                    result = await nutritionModel.generateContent(prompt);
                    break;
                }
                case 'recipe': {
                    const items = payload.items as string[];
                    const preference = payload.preference as string;
                    if (!items || !preference) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Missing items or preference for recipe agent' }));
                        return;
                    }
                    const recipeModel = genAI.getGenerativeModel({
                        model: 'gemini-1.5-flash',
                        generationConfig: {
                            responseMimeType: 'application/json',
                            responseSchema: RECIPE_SCHEMA,
                        },
                    });
                    const prompt = `Act as a world-class chef. Create a creative recipe using these items: ${items.join(', ')}. The recipe MUST follow these dietary restrictions: ${preference}. Focus on high-quality flavor profile and easy preparation.`;
                    result = await recipeModel.generateContent(prompt);
                    break;
                }
                default:
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid agent type' }));
                    return;
            }

            const response = await result.response;
            const text = response.text();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ text }));

        } catch (error) {
            console.error('Error in Gemini proxy:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    })();
}
