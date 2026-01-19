
import React, { useState } from 'react';
import { Operation, OperationType, AssetClass } from '../types';
import { identifyAssetClass } from '../services/finance';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (op: Omit<Operation, 'id'>) => void;
}

const NewOperationModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ticker: '',
    type: 'Compra' as OperationType,
    quantity: 0,
    price: 0,
    costs: 0,
    broker: 'XP Investimentos',
    assetClass: 'Ações' as AssetClass
  });

  if (!isOpen) return null;

  const handleTickerChange = (ticker: string) => {
    const upperTicker = ticker.toUpperCase();
    setFormData({
      ...formData,
      ticker: upperTicker,
      assetClass: identifyAssetClass(upperTicker)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A1E32]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="bg-[#0A1E32] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Nova Operação</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Alimente sua inteligência Arvo</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form className="p-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
            onClose();
        }}>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Classe de Ativo</label>
                <select 
                  value={formData.assetClass} 
                  onChange={e => setFormData({...formData, assetClass: e.target.value as AssetClass})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#C4953D] outline-none"
                >
                   <option value="Ações">Ações</option>
                   <option value="Fundos Imobiliários">FIIs</option>
                   <option value="Tesouro Direto">Tesouro Direto</option>
                   <option value="Renda Fixa">Renda Fixa</option>
                   <option value="Criptomoedas">Criptomoedas</option>
                   <option value="Internacional">Internacional</option>
                </select>
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Tipo de Movimentação</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as OperationType})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#C4953D] outline-none">
                   <option value="Compra">Compra</option>
                   <option value="Venda">Venda</option>
                   <option value="Aporte">Aporte (Renda Fixa)</option>
                   <option value="Resgate">Resgate (Renda Fixa)</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Ativo (Ticker)</label>
                <input type="text" placeholder="Ex: PETR4" value={formData.ticker} onChange={e => handleTickerChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-[#0A1E32] outline-none" required />
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Data</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0A1E32] outline-none" required />
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Quantidade</label>
                <input type="number" step="0.0001" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0A1E32] outline-none" required />
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Preço Unit. (R$)</label>
                <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0A1E32] outline-none" required />
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Taxas (R$)</label>
                <input type="number" step="0.01" value={formData.costs} onChange={e => setFormData({...formData, costs: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0A1E32] outline-none" />
             </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center border border-slate-100">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Estimado</p>
                <p className="text-xl font-black text-[#0A1E32]">R$ {((formData.quantity * formData.price) + formData.costs).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
             </div>
             <i className="fas fa-calculator text-slate-200 text-2xl"></i>
          </div>

          <button type="submit" className="w-full bg-[#0A1E32] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#12304d] transition-all shadow-xl shadow-slate-900/10 mt-4">
            Registrar na Carteira
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewOperationModal;
