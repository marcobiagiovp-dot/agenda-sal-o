import { GoogleGenAI } from "@google/genai";

// Initialize the API client
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateStyleAdvice = async (
  query: string, 
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  if (!apiKey) {
    return "A chave de API não foi configurada. Por favor, configure a variável de ambiente API_KEY para usar o consultor.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Convert history to compatible format if needed by the specific method, 
    // but here we will just concatenate for context in a single prompt for simplicity 
    // or use a chat session if we were persisting the object. 
    // For a stateless service call, we'll create a new chat context.
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `Você é um Consultor de Estilo e Cabeleireiro Sênior da 'SalonLux'. 
        Seu tom é profissional, amigável e sofisticado.
        Responda a perguntas sobre cortes de cabelo, coloração, tratamentos e tendências de moda.
        Se o usuário perguntar sobre agendamento, oriente-o a usar o calendário na tela principal.
        Mantenha as respostas concisas (máximo de 3 parágrafos) e úteis.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message: query });
    return result.text || "Desculpe, não consegui gerar uma resposta no momento.";
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return "Houve um erro ao processar sua solicitação. Tente novamente mais tarde.";
  }
};