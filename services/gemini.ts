
import { GoogleGenAI, Type } from "@google/genai";

const getSystemInstruction = (projectName: string, context: string) => `
Você é o "Arvo AI", o mentor e desenvolvedor do projeto "${projectName}".
Seu objetivo é ajudar um desenvolvedor iniciante a continuar o desenvolvimento desta plataforma de investimentos.
O contexto do projeto atual (arquivos e README) é:
${context}

Conhecimentos obrigatórios:
- Regras de IRPF (Imposto de Renda Pessoa Física).
- Cálculo de Preço Médio.
- Tributação de FIIs e Ações.
- Mercado Brasileiro (B3).

Sempre explique o código e as regras de negócio de forma didática.
Ao sugerir mudanças, mencione em qual arquivo do projeto elas devem ser feitas.
`;

export const getFinancialAdvice = async (message: string, projectName: string, context: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: message,
    config: {
      systemInstruction: getSystemInstruction(projectName, context),
    },
  });
  return response.text;
};

export const analyzeTaxRule = async (transactionData: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise estes dados de transação e explique o cálculo de IR devido: ${transactionData}`,
      config: {
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });
    return response.text;
};

export const refactorCode = async (code: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: code,
    config: {
      systemInstruction: "Refatore este código para performance e legibilidade, mantendo as regras de negócio financeiras.",
      thinkingConfig: { thinkingBudget: 2000 }
    },
  });
  return response.text;
};
