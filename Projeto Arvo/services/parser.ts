
import { GoogleGenAI } from "@google/genai";
import { Operation } from "../types";
import { identifyAssetClass } from "./finance";

export interface ParsedNoteResult {
  operations: Omit<Operation, 'id'>[];
  broker: string;
  date: string;
  totalCosts: number;
}

/**
 * Usa IA para extrair dados estruturados de um texto bruto de nota de corretagem
 */
export const parseBrokerageNote = async (rawText: string): Promise<ParsedNoteResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analise o texto abaixo de uma Nota de Corretagem da B3 (Brasil) ou extrato de corretora.
    Extraia todas as operações de compra e venda.
    Retorne APENAS um JSON seguindo este esquema:
    {
      "broker": "Nome da Corretora",
      "date": "YYYY-MM-DD",
      "totalCosts": 0.00,
      "operations": [
        {
          "ticker": "PETR4",
          "type": "Compra",
          "quantity": 100,
          "price": 25.50,
          "costs": 0.05
        }
      ]
    }
    
    Texto:
    ${rawText.substring(0, 8000)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    if (result.operations) {
      result.operations = result.operations.map((op: any) => ({
        ...op,
        assetClass: identifyAssetClass(op.ticker),
        broker: result.broker || 'Não Identificado',
        date: result.date || new Date().toISOString().split('T')[0]
      }));
    }

    return result as ParsedNoteResult;
  } catch (error) {
    console.error("Erro no parsing da nota:", error);
    throw new Error("Não foi possível interpretar a nota automaticamente.");
  }
};

/**
 * Converte CSV em operações, tentando mapear colunas automaticamente
 */
export const parseCSVFile = async (csvText: string): Promise<Omit<Operation, 'id'>[]> => {
  const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase();
  
  // Se for um formato conhecido (ex: B3 ou Corretora comum), processamos direto
  // Caso contrário, pedimos para a IA mapear o CSV
  if (!headers.includes('ticker') && !headers.includes('ativo') && !headers.includes('negociação')) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Converta as linhas de CSV abaixo em um array JSON de operações de investimento.
      Campos necessários: ticker, type (Compra/Venda), quantity, price, date (YYYY-MM-DD).
      CSV:
      ${lines.slice(0, 20).join('\n')}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "[]");
      return data.map((op: any) => ({
        ...op,
        assetClass: identifyAssetClass(op.ticker),
        broker: 'Importação CSV Inteligente',
        costs: op.costs || 0
      }));
    } catch (e) {
      console.error("Falha no CSV inteligente", e);
    }
  }

  // Fallback: Parser manual simplificado
  const delimiter = csvText.includes(';') ? ';' : ',';
  const columns = lines[0].split(delimiter).map(c => c.trim().toLowerCase());
  
  return lines.slice(1).map(line => {
    const vals = line.split(delimiter).map(v => v.trim());
    const op: any = {};
    
    // Mapeamento básico
    const tickerIdx = columns.findIndex(c => c.includes('ticker') || c.includes('ativo') || c.includes('papel'));
    const typeIdx = columns.findIndex(c => c.includes('tipo') || c.includes('operacao') || c.includes('compra'));
    const qtyIdx = columns.findIndex(c => c.includes('qtd') || c.includes('quantidade'));
    const priceIdx = columns.findIndex(c => c.includes('preco') || c.includes('valor unit'));
    const dateIdx = columns.findIndex(c => c.includes('data'));

    const ticker = vals[tickerIdx] || 'UNKNOWN';
    return {
      ticker: ticker.toUpperCase(),
      type: (vals[typeIdx]?.toLowerCase().includes('v') ? 'Venda' : 'Compra') as any,
      quantity: Math.abs(parseFloat(vals[qtyIdx]?.replace(',', '.') || '0')),
      price: parseFloat(vals[priceIdx]?.replace(',', '.') || '0'),
      date: vals[dateIdx] || new Date().toISOString().split('T')[0],
      costs: 0,
      broker: 'Importação CSV',
      assetClass: identifyAssetClass(ticker)
    };
  });
};
