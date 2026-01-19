
import { Operation } from '../types';
import { supabase } from './supabase';

export const databaseService = {
  fetchOperations: async (userId: string): Promise<Operation[]> => {
    if (supabase.supabaseUrl.includes('nao-configurado')) {
        const saved = localStorage.getItem(`arvo_ops_${userId}`);
        return saved ? JSON.parse(saved) : [];
    }

    try {
      const { data, error } = await supabase
        .from('operations')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.warn("⚠️ Tabela 'operations' não existe. Execute o SQL no Supabase.");
        } else {
          console.error("❌ Erro Supabase:", error.message);
        }
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        date: item.date,
        ticker: item.ticker,
        type: item.type,
        quantity: item.quantity,
        price: item.price,
        costs: item.costs,
        broker: item.broker,
        assetClass: item.asset_class,
        portfolioId: item.portfolio_id
      }));
    } catch (e) {
      console.error("❌ Falha na conexão com banco:", e);
      return [];
    }
  },

  saveOperation: async (userId: string, op: Operation): Promise<void> => {
    if (supabase.supabaseUrl.includes('nao-configurado')) {
        const ops = await databaseService.fetchOperations(userId);
        localStorage.setItem(`arvo_ops_${userId}`, JSON.stringify([...ops, op]));
        return;
    }

    const { error } = await supabase
      .from('operations')
      .insert([{
        user_id: userId,
        ticker: op.ticker,
        type: op.type,
        quantity: op.quantity,
        price: op.price,
        costs: op.costs,
        broker: op.broker,
        asset_class: op.assetClass,
        date: op.date
      }]);

    if (error) {
      console.error("❌ Erro ao salvar:", error.message);
      if (error.code === '42P01') {
          throw new Error("A tabela 'operations' não existe. Vá no SQL Editor do Supabase e execute o script de criação.");
      }
      throw new Error("Erro ao salvar: " + error.message);
    }
  },

  saveBulkOperations: async (userId: string, newOps: Operation[]): Promise<void> => {
    if (supabase.supabaseUrl.includes('nao-configurado')) {
        const ops = await databaseService.fetchOperations(userId);
        localStorage.setItem(`arvo_ops_${userId}`, JSON.stringify([...ops, ...newOps]));
        return;
    }

    const payload = newOps.map(op => ({
      user_id: userId,
      ticker: op.ticker,
      type: op.type,
      quantity: op.quantity,
      price: op.price,
      costs: op.costs,
      broker: op.broker,
      asset_class: op.assetClass,
      date: op.date
    }));

    const { error } = await supabase.from('operations').insert(payload);
    if (error) throw error;
  },

  deleteOperation: async (userId: string, opId: string): Promise<void> => {
    if (supabase.supabaseUrl.includes('nao-configurado')) {
        const ops = await databaseService.fetchOperations(userId);
        const filtered = ops.filter(o => o.id !== opId);
        localStorage.setItem(`arvo_ops_${userId}`, JSON.stringify(filtered));
        return;
    }

    const { error } = await supabase
      .from('operations')
      .delete()
      .eq('id', opId)
      .eq('user_id', userId);

    if (error) throw error;
  }
};
