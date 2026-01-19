
export enum AppState {
  LANDING = 'LANDING',
  PROFESSIONAL = 'PROFESSIONAL',
  DASHBOARD = 'DASHBOARD',
  CARTEIRA = 'CARTEIRA',
  OPERACOES = 'OPERACOES',
  TESOURO = 'TESOURO',
  PROVENTOS = 'PROVENTOS',
  RENTABILIDADE = 'RENTABILIDADE',
  COMPOSICAO = 'COMPOSICAO',
  METAS = 'METAS',
  RELATORIOS_IR = 'RELATORIOS_IR',
  ALERTAS = 'ALERTAS',
  SEGURANCA = 'SEGURANCA',
  CONFIGURACOES = 'CONFIGURACOES'
}

export type AssetClass = 'Ações' | 'Fundos Imobiliários' | 'Tesouro Direto' | 'Renda Fixa' | 'Criptomoedas' | 'Internacional' | 'Outros';

export type OperationType = 'Compra' | 'Venda' | 'Aporte' | 'Resgate';

export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
  createdAt: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
}

export interface Operation {
  id: string;
  portfolioId?: string;
  date: string;
  ticker: string;
  type: OperationType;
  quantity: number;
  price: number;
  costs: number;
  broker: string;
  assetClass: AssetClass;
}

export interface AssetPosition {
  ticker: string;
  name: string;
  sector: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalInvested: number;
  totalCurrent: number;
  plAmount: number;
  plPercent: number;
  share: number;
  broker: string;
  type: AssetClass;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface IAInsight {
  type: 'crítico' | 'atenção' | 'informativo';
  title: string;
  description: string;
  action?: string;
}

export interface RepoInfo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
}

export interface GitHubFile {
  path: string;
  mode?: string;
  type: 'blob' | 'tree';
  sha?: string;
  size?: number;
  url?: string;
}

export interface MarketQuote {
  ticker: string;
  price: number;
  change: number;
}
