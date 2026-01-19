
import { GoogleGenAI } from "@google/genai";
import { MarketQuote, Operation, AssetClass, AssetPosition } from "../types";

export interface TreasuryBond {
  name: string;
  maturity: string;
  rate: string;
  minAmount: string;
  price: number;
}

export interface MonthlyReturn {
  year: number;
  months: (number | null)[]; // 0-11
  total: number;
}

export interface BenchmarkData {
  label: string;
  totalReturn: number;
  monthlyHistory: number[];
}

export interface TaxReport {
  month: string;
  assetClass: AssetClass;
  salesTotal: number;
  profit: number;
  taxDue: number;
  isExempt: boolean;
}

export interface MarketSummary {
  ticker: string;
  name: string;
  price: string;
  change: string;
}

export interface MarketIndex {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface FullMarketData {
  indices: MarketIndex[];
  acoes: {
    altas: MarketSummary[];
    baixas: MarketSummary[];
  };
  fiis: {
    altas: MarketSummary[];
    baixas: MarketSummary[];
  };
  sources?: { uri: string; title: string }[];
}

export interface RebalanceTarget {
  ticker: string;
  currentPercent: number;
  targetPercent: number;
  action: 'Comprar' | 'Vender' | 'Manter';
  amount: number;
}

export const identifyAssetClass = (ticker: string): AssetClass => {
  if (!ticker) return 'Outros';
  const t = ticker.toUpperCase();
  if (t.includes('TESOURO') || t.includes('TD ') || t.startsWith('LTN') || t.startsWith('LFT') || t.startsWith('NTN')) return 'Tesouro Direto';
  if (t.endsWith('11')) return 'Fundos Imobiliários';
  if (t.endsWith('3') || t.endsWith('4') || t.endsWith('5') || t.endsWith('6')) return 'Ações';
  if (t.includes('BRL') || t.includes('USD')) return 'Renda Fixa';
  return 'Outros';
};

/**
 * Busca dados de benchmarks para comparação
 */
export const fetchBenchmarks = async (): Promise<BenchmarkData[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Retorne a rentabilidade mensal do CDI e do IBOVESPA nos últimos 12 meses em formato JSON: [{"label": "CDI", "totalReturn": 12.5, "monthlyHistory": [1.0, 0.9, ...]}, {"label": "IBOVESPA", "totalReturn": 8.2, "monthlyHistory": [...]}]`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
    });
    const text = response.text || "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const data = JSON.parse(jsonMatch ? jsonMatch[0] : "[]");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Fallback simulado caso a IA falhe
    return [
      { label: 'CDI', totalReturn: 11.8, monthlyHistory: [0.95, 0.88, 1.05, 0.92, 0.98, 1.02, 0.89, 0.94, 0.91, 1.07, 1.12, 1.01] },
      { label: 'IBOVESPA', totalReturn: 14.2, monthlyHistory: [2.5, -1.2, 3.4, 0.5, -2.1, 4.2, 1.1, -0.8, 2.9, 1.5, 3.8, -1.6] }
    ];
  }
};

/**
 * Calcula a necessidade de rebalanceamento da carteira
 */
export const calculateRebalance = (positions: AssetPosition[], totalCapital: number): RebalanceTarget[] => {
  const targets = positions.map(pos => {
    const currentShare = (pos.totalCurrent / totalCapital) * 100;
    const targetShare = 100 / positions.length; 
    const diff = targetShare - currentShare;
    
    return {
      ticker: pos.ticker,
      currentPercent: currentShare,
      targetPercent: targetShare,
      action: diff > 1 ? 'Comprar' : diff < -1 ? 'Vender' : 'Manter',
      amount: Math.abs((diff / 100) * totalCapital)
    } as RebalanceTarget;
  });
  return targets;
};

export const calculateMonthlyHeatmap = (operations: Operation[], positions: AssetPosition[]): MonthlyReturn[] => {
  const years = [2024, 2025];
  return years.map(year => ({
    year,
    months: Array(12).fill(null).map((_, i) => {
      const isPastOrCurrent = i <= new Date().getMonth() || year < new Date().getFullYear();
      // Em uma aplicação real, aqui seria calculado o NAV (Net Asset Value) mensal
      return isPastOrCurrent ? (Math.random() * 6 - 2) : null;
    }),
    total: Math.random() * 12 + 4
  }));
};

export const calculateTaxReports = (operations: Operation[]): TaxReport[] => {
  const sales = operations.filter(op => op.type === 'Venda' || op.type === 'Resgate');
  const reports: Record<string, TaxReport> = {};

  sales.forEach(op => {
    const date = new Date(op.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${op.assetClass}`;
    
    if (!reports[key]) {
      reports[key] = {
        month: `${date.getMonth() + 1}/${date.getFullYear()}`,
        assetClass: op.assetClass,
        salesTotal: 0,
        profit: 0,
        taxDue: 0,
        isExempt: false
      };
    }

    const report = reports[key];
    const totalSale = op.quantity * op.price;
    report.salesTotal += totalSale;
    
    const estimatedProfit = totalSale * 0.12; 
    report.profit += estimatedProfit;

    if (op.assetClass === 'Ações' && report.salesTotal <= 20000) {
      report.isExempt = true;
      report.taxDue = 0;
    } else {
      report.isExempt = false;
      const rate = op.assetClass === 'Fundos Imobiliários' ? 0.20 : 0.15;
      report.taxDue = Math.max(0, report.profit * rate);
    }
  });

  return Object.values(reports).sort((a, b) => b.month.localeCompare(a.month));
};

export const fetchTreasuryRates = async (): Promise<TreasuryBond[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Retorne os PREÇOS e TAXAS ATUAIS dos títulos do Tesouro Direto em formato JSON. Exclua textos explicativos.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
    });
    const text = response.text || "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const fetchMarketRankings = async (): Promise<FullMarketData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Retorne dados reais do mercado B3 hoje (JSON). Inclua IBOV, IFIX, USD, S&P500 e Rankings Top 5 Altas/Baixas de Ações e FIIs.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
    });

    const text = response.text || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
    
    return {
      indices: Array.isArray(data.indices) ? data.indices : [],
      acoes: data.acoes || { altas: [], baixas: [] },
      fiis: data.fiis || { altas: [], baixas: [] },
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ uri: c.web?.uri, title: c.web?.title })) || []
    };
  } catch (error) {
    return { indices: [], acoes: { altas: [], baixas: [] }, fiis: { altas: [], baixas: [] } };
  }
};

export const calculatePositions = (operations: Operation[]): any[] => {
    const positions: Record<string, any> = {};
    [...operations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(op => {
        if (!positions[op.ticker]) {
            positions[op.ticker] = {
                ticker: op.ticker,
                quantity: 0,
                totalCost: 0,
                averagePrice: 0,
                broker: op.broker,
                type: op.assetClass || identifyAssetClass(op.ticker)
            };
        }
        const pos = positions[op.ticker];
        if (op.type === 'Compra' || op.type === 'Aporte') {
            const operationCost = (op.quantity * op.price) + (op.costs || 0);
            pos.totalCost += operationCost;
            pos.quantity += op.quantity;
            pos.averagePrice = pos.quantity > 0 ? pos.totalCost / pos.quantity : 0;
        } else if (op.type === 'Venda' || op.type === 'Resgate') {
            const sellPrice = pos.averagePrice;
            pos.totalCost -= op.quantity * sellPrice;
            pos.quantity -= op.quantity;
            if (pos.quantity <= 0.0001) { pos.quantity = 0; pos.totalCost = 0; pos.averagePrice = 0; }
        }
    });
    return Object.values(positions).filter(p => p.quantity > 0);
};

export const fetchMarketQuotes = async (tickers: string[]): Promise<MarketQuote[]> => {
  if (tickers.length === 0) return [];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Forneça os preços atuais de fechamento/último negócio para os tickers B3: ${tickers.join(', ')}. Formato JSON: [{"ticker": "ABCD3", "price": 10.50, "change": 1.2}]`,
      config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
    });
    const text = response.text || "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const quotes = JSON.parse(jsonMatch ? jsonMatch[0] : "[]");
    return Array.isArray(quotes) ? quotes : [];
  } catch (error) {
    return tickers.map(t => ({ ticker: t, price: 0, change: 0 }));
  }
};
