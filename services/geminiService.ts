
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Fix: Differentiate between image generation and image editing.
// Use `imagen-4.0-generate-001` for generation (no input images) and `gemini-2.5-flash-image-preview` for editing.
// Updated API calls to align with the latest `@google/genai` SDK guidelines.
export const generateImage = async (prompt: string, images: { data: string; mimeType: string }[]): Promise<string> => {
    try {
        if (images.length > 0) {
            // Image Editing
            const textPart = { text: prompt };
            const imageParts = images.map(image => ({
                inlineData: {
                    data: image.data,
                    mimeType: image.mimeType,
                },
            }));

            const contents = {
                parts: [...imageParts, textPart]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents,
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            if (response.candidates && response.candidates.length > 0) {
                const candidate = response.candidates[0];
                const imagePart = candidate.content.parts.find(part => part.inlineData);
                
                if (imagePart && imagePart.inlineData) {
                    return imagePart.inlineData.data;
                } else {
                    const textPart = candidate.content.parts.find(part => part.text);
                    if (textPart && textPart.text) {
                         throw new Error(`API returned text instead of an image: "${textPart.text.substring(0, 100)}..." Try rephrasing your prompt.`);
                    }
                    throw new Error("No image data found in the API response for editing.");
                }
            }
            throw new Error("Invalid response from API for editing.");
        } else {
            // Image Generation
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/png',
                },
            });
            
            if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
                return response.generatedImages[0].image.imageBytes;
            }
            throw new Error("No image data found in the API response for generation.");
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image. ${error.message}`);
        }
        throw new Error("Failed to generate image. Please check the console for details.");
    }
};
