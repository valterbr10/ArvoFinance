
import React from 'react';
import { Operation } from '../types';

interface Props {
  operations: Operation[];
  onDelete: (id: string) => void;
  onImport: () => void;
}

const OperacoesView: React.FC<Props> = ({ operations, onDelete, onImport }) => {
  return (
    <div className="bg-[#F8F9FB] min-h-screen p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#0A1E32] tracking-tighter">Operações</h1>
          <p className="text-slate-400 font-medium">Compras e vendas registradas</p>
        </div>
        <div className="flex space-x-4">
           <button 
            onClick={onImport}
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
           >
              <i className="fas fa-file-import mr-2 text-[#C4953D]"></i> Importar Notas
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white text-left">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticker</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tipo</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qtde</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Preço (R$)</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Taxas (R$)</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Corretora</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {operations.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((op) => (
              <tr key={op.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 text-sm font-medium text-slate-500">{new Date(op.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-8 py-6 text-sm font-black text-slate-800">{op.ticker}</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${op.type === 'Compra' || op.type === 'Aporte' ? 'bg-[#0A1E32] text-white' : 'bg-[#C4953D] text-white'}`}>
                    {op.type}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-slate-700 text-center">{op.quantity}</td>
                <td className="px-8 py-6 text-sm font-bold text-slate-800 text-right">R$ {op.price.toFixed(2)}</td>
                <td className="px-8 py-6 text-sm font-bold text-slate-400 text-right">{op.costs > 0 ? `R$ ${op.costs.toFixed(2)}` : '0,00'}</td>
                <td className="px-8 py-6 text-sm font-bold text-slate-500">{op.broker}</td>
                <td className="px-8 py-6 text-right space-x-4">
                  <button className="text-slate-300 hover:text-slate-600 transition-colors"><i className="fas fa-edit"></i></button>
                  <button onClick={() => onDelete(op.id)} className="text-slate-300 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            ))}
            {operations.length === 0 && (
              <tr>
                <td colSpan={8} className="px-8 py-20 text-center text-slate-300 italic font-medium">Nenhuma operação cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperacoesView;
