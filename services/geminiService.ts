import { GoogleGenAI, Type } from "@google/genai";
import { SiteJsonNode } from '../types';

// FIX: Conditionally initialize GoogleGenAI client only if the API key exists
// to prevent runtime errors from an undefined key.
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

if (!ai) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const siteNodeSchema = {
    type: Type.OBJECT,
    properties: {
        type: {
            type: Type.STRING,
            description: "The HTML tag name (e.g., 'div', 'h1', 'p', 'img').",
        },
        props: {
            type: Type.OBJECT,
            description: "An object of HTML attributes like 'className', 'src', 'alt', 'href'. Use TailwindCSS classes for styling.",
            properties: {
                className: { type: Type.STRING },
            },
        },
        children: {
            type: Type.ARRAY,
            description: "An array of child elements. Each element can be a string or another nested element object.",
            items: {
                // This is a simplification; Gemini schema doesn't fully support recursive self-reference easily.
                // We describe it in the prompt instead.
                type: Type.OBJECT, 
            }
        },
    },
    required: ["type"],
};


export const generateSiteJson = async (prompt: string): Promise<SiteJsonNode> => {
    // FIX: Check for the initialized 'ai' client, not the raw API key.
    if (!ai) {
        throw new Error("Gemini API key is not configured.");
    }
    
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an expert web designer. Your task is to generate a JSON object representing a complete webpage structure based on the user's prompt. The JSON must conform to this structure: { type: string, props: { [key: string]: any }, children: (string | object)[] }. Use TailwindCSS classes within the 'props.className' for styling. The design should be modern, clean, and adhere to a dark theme. The root element should typically be a 'div' with classes for layout and styling. Be creative and generate a rich, nested structure.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Generate a JSON structure for a website based on this description: "${prompt}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: siteNodeSchema,
            },
        });

        const jsonString = response.text;
        const generatedJson = JSON.parse(jsonString);

        // Basic validation
        if (typeof generatedJson.type !== 'string') {
          throw new Error("Invalid JSON structure: 'type' is missing or not a string.");
        }

        return generatedJson as SiteJsonNode;

    } catch (error) {
        console.error("Error generating site JSON with Gemini:", error);
        throw new Error("Failed to generate site structure. Please try again.");
    }
};
