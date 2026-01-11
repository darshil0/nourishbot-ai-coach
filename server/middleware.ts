
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey);

const NUTRITION_SCHEMA = {
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

const RECIPE_SCHEMA = {
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

async function getBody(req: any): Promise<any> {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve({});
            }
        });
    });
}

export function geminiProxyMiddleware(req: any, res: any, next: any) {
    if (req.url !== '/api/generate') {
        return next();
    }

    (async () => {
        try {
            const body = await getBody(req);
            const { agent, payload } = body;

            if (!agent || !payload) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing agent or payload' }));
                return;
            }

            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            let result;

            switch (agent) {
                case 'vision': {
                    if (!payload.imageBase64) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Missing imageBase64 for vision agent' }));
                        return;
                    }
                    const visionPrompt = [
                        { text: 'List every identifiable food ingredient or dish in this image. Return only a comma-separated list of items.' },
                        { inlineData: { mimeType: 'image/jpeg', data: payload.imageBase64 } },
                    ];
                    result = await model.generateContent(visionPrompt);
                    break;
                }
                case 'nutrition': {
                    if (!payload.items) {
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
                    const prompt = `Act as a senior nutritional scientist. Analyze this list of ingredients: ${payload.items.join(', ')}. Provide a detailed nutritional breakdown. Estimate portion sizes reasonably for a single meal.`;
                    result = await nutritionModel.generateContent(prompt);
                    break;
                }
                case 'recipe': {
                    if (!payload.items || !payload.preference) {
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
                    const prompt = `Act as a world-class chef. Create a creative recipe using these items: ${payload.items.join(', ')}. The recipe MUST follow these dietary restrictions: ${payload.preference}. Focus on high-quality flavor profile and easy preparation.`;
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
