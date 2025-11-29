import { GoogleGenAI } from "@google/genai";

export const generateCVAdvice = async (jobTitle: string): Promise<string> => {
  let apiKey = '';
  try {
    // Safe check for process.env to avoid "ReferenceError: process is not defined" in browsers
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Environnement process non disponible");
  }

  if (!apiKey) return "Clé API manquante ou inaccessible. Impossible de générer des conseils.";

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