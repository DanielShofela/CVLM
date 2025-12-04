import { GoogleGenAI } from "@google/genai";

export const generateCVAdvice = async (jobTitle: string): Promise<string> => {
  let apiKey = '';
  
  // Extremely defensive check for environment variables to prevent browser crashes
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process?.env?.API_KEY) {
      // @ts-ignore
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    // Silently fail on env access, handled below
  }

  if (!apiKey) {
    console.warn("Gemini API Key missing. Skipping AI generation.");
    return "L'assistant IA n'est pas configuré (Clé API manquante).";
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Donne-moi 3 conseils très brefs, percutants et professionnels pour améliorer un CV de "${jobTitle}". Format liste à puces.`,
    });
    return response.text || "Aucun conseil disponible pour le moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Impossible de contacter l'IA pour le moment.";
  }
};