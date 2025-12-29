
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DayOfWeek } from "../types";

export const generatePostText = async (day: DayOfWeek): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Eres el community manager de Radio Cartaya 107.2 FM. 
  Redacta una publicación creativa para Facebook para el día ${day}. 
  Contexto: Son las 14:00, la programación matinal informativa ha terminado y comienza el bloque de programación musical. 
  Debes animar a la audiencia a seguir conectados a la 107.2 FM. 
  Usa muchos emoticonos, un tono dinámico, cercano y profesional. 
  Menciona que la programación detallada está en el primer comentario. 
  Asegúrate de que el texto sea pegajoso y adecuado para compartir en redes sociales de una emisora municipal.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.8,
    }
  });

  return response.text || "No se pudo generar el texto.";
};

export const generatePostImage = async (day: DayOfWeek): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prompt mejorado para coherencia visual y orientación lógica
  const prompt = `A coherent, professional radio broadcasting workstation for 'Radio Cartaya 107.2 FM'. 
  In the center, there is an ergonomic broadcaster's chair. 
  A high-end studio microphone on a boom arm is positioned and angled precisely pointing towards the chair's headrest area. 
  A digital sound mixing console with glowing faders is on the desk, oriented for the person sitting in the chair. 
  Professional headphones are resting on the table next to the microphone. 
  The lighting is warm and professional, creating an inviting 'on-air' atmosphere. 
  The composition is realistic and functional, showing a real workspace ready for a host.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  let imageUrl = "";
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) throw new Error("No se pudo generar la imagen");
  return imageUrl;
};
