import { GoogleGenAI, Type } from "@google/genai";
import { ContentType, Chapter } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Generate Title and Outline
export const generateStructure = async (
  topic: string,
  audience: string,
  tone: string,
  type: ContentType
): Promise<{ title: string; chapters: Chapter[] }> => {
  const ai = getClient();
  
  const systemInstruction = `Você é um editor experiente especializado em criar ${
    type === ContentType.EBOOK ? "best-sellers" : "cursos online de alto impacto"
  }. Seu objetivo é estruturar um conteúdo lógico, engajador e completo. O idioma deve ser Português do Brasil.`;

  const userPrompt = `Crie uma estrutura detalhada para um ${
    type === ContentType.EBOOK ? "e-book" : "curso online"
  } sobre o tema: "${topic}".
  Público-alvo: ${audience}.
  Tom de voz: ${tone}.
  
  Retorne um título criativo e uma lista de ${type === ContentType.EBOOK ? "capítulos" : "módulos"}.
  Para cada item, forneça um título e uma breve descrição do que será abordado.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "O título principal e chamativo do projeto." },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Título do capítulo ou módulo." },
                  description: { type: Type.STRING, description: "Breve resumo do conteúdo deste capítulo." }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["title", "chapters"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Não foi possível gerar a estrutura.");
  } catch (error) {
    console.error("Erro ao gerar estrutura:", error);
    throw error;
  }
};

// 2. Generate Chapter Content
export const generateChapterContent = async (
  projectTitle: string,
  chapterTitle: string,
  chapterDesc: string,
  tone: string,
  type: ContentType
): Promise<string> => {
  const ai = getClient();
  const context = type === ContentType.EBOOK ? "um e-book" : "um curso online";
  
  const prompt = `Escreva o conteúdo completo para o capítulo/módulo: "${chapterTitle}" do projeto "${projectTitle}" (${context}).
  Descrição do capítulo: ${chapterDesc}.
  Tom de voz: ${tone}.
  
  O conteúdo deve ser rico, formatado em Markdown (use títulos, listas, negrito para ênfase).
  Se for curso, divida em lições claras. Se for e-book, escreva de forma fluida.
  Mínimo de 600 palavras.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using flash for speed, switch to pro if deeper reasoning needed
      contents: prompt,
    });

    return response.text || "Conteúdo não gerado.";
  } catch (error) {
    console.error(`Erro ao gerar conteúdo para ${chapterTitle}:`, error);
    return "Erro ao gerar este conteúdo. Tente novamente.";
  }
};

// 3. Generate Cover Image
export const generateCoverImage = async (
  title: string,
  topic: string,
  type: ContentType
): Promise<string | undefined> => {
  const ai = getClient();
  
  // Use gemini-3-pro-image-preview for high quality images
  const model = "gemini-3-pro-image-preview";
  
  const prompt = `A professional, high-quality, minimalist cover design for a ${
    type === ContentType.EBOOK ? "book" : "online course"
  } titled "${title}". 
  Topic: ${topic}.
  Style: Modern, clean, vector art or high-end photography, cinematic lighting. 
  No text on the image other than the title if possible, but preferably just art.
  Aspect ratio 2:3 (vertical book cover).`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", // Closest to book cover from allowed list (3:4)
            imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Erro ao gerar capa:", error);
    // Don't throw, just return undefined so app doesn't crash
    return undefined;
  }
};
