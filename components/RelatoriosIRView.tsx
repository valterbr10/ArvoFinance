
import React, { useMemo, useState } from 'react';
import { Operation, AssetPosition } from '../types';
import { calculateTaxReports } from '../services/finance';

interface Props {
  operations: Operation[];
  positions: AssetPosition[];
}

const RelatoriosIRView: React.FC<Props> = ({ operations, positions }) => {
  const [activeTab, setActiveTab] = useState<'Mensal' | 'Anual' | 'Documentos'>('Mensal');
  const taxReports = useMemo(() => calculateTaxReports(operations), [operations]);

  return (
    <div className="bg-[#F8F9FB] min-h-screen p-10 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#0A1E32] tracking-tighter">Relatórios & IR</h1>
            <p className="text-slate-400 font-medium">Sua conformidade fiscal em dia e automatizada</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 px-6 py-3 rounded-2xl flex items-center space-x-3">
             <i className="fas fa-shield-alt text-amber-500"></i>
             <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Apuração Baseada em Instruções da RFB</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <div className="flex space-x-8 border-b border-slate-100 mb-10">
              {['Mensal', 'Anual', 'Documentos'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-6 px-2 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#0A1E32]' : 'text-slate-300 hover:text-slate-500'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C4953D] rounded-t-full"></div>}
                </button>
              ))}
           </div>

           {activeTab === 'Mensal' && (
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Vendas no Mês Atual</p>
                      <p className="text-2xl font-black text-slate-800">R$ 0,00</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Isenção Utilizada</p>
                      <p className="text-2xl font-black text-emerald-500">0%</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Imposto Devido</p>
                      <p className="text-2xl font-black text-red-500">R$ 0,00</p>
                   </div>
                   <div className="p-6 bg-[#0A1E32] rounded-2xl border border-[#0A1E32] flex items-center justify-center text-white cursor-pointer hover:bg-slate-800 transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest">Gerar DARF Simplificado</span>
                   </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full">
                      <thead>
                         <tr className="text-left">
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Período</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ativo</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Vendas</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Lucro/Prejuízo</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">IR Devido</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {taxReports.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                             <td className="px-4 py-5 text-sm font-black text-slate-800">{r.month}</td>
                             <td className="px-4 py-5 text-sm font-medium text-slate-500">{r.assetClass}</td>
                             <td className="px-4 py-5 text-sm font-bold text-slate-700 text-right">R$ {r.salesTotal.toLocaleString('pt-BR')}</td>
                             <td className="px-4 py-5 text-sm font-black text-emerald-600 text-right">R$ {r.profit.toLocaleString('pt-BR')}</td>
                             <td className="px-4 py-5 text-center">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${r.isExempt ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                   {r.isExempt ? 'Isento' : 'Tributável'}
                                </span>
                             </td>
                             <td className="px-4 py-5 text-sm font-black text-slate-900 text-right">R$ {r.taxDue.toLocaleString('pt-BR')}</td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
           )}

           {activeTab === 'Anual' && (
             <div className="space-y-10">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-center justify-between">
                   <div>
                      <h4 className="text-xl font-black text-[#0A1E32] mb-2">Bens e Direitos - Ano Calendário 2024</h4>
                      <p className="text-slate-400 text-sm">Resumo consolidado para preenchimento do software IRPF 2025.</p>
                   </div>
                   <button className="bg-emerald-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                      Copiar Todos os Dados
                   </button>
                </div>

                <div className="space-y-6">
                   {positions.map((pos, i) => (
                     <div key={i} className="p-8 border border-slate-100 rounded-[2rem] hover:border-slate-300 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Código RFB: {pos.type === 'Ações' ? '31' : '73'}</span>
                              <h5 className="text-lg font-black text-slate-800">{pos.ticker} - {pos.name}</h5>
                           </div>
                           <p className="text-sm font-black text-slate-900">Custo Total: R$ {pos.totalInvested.toLocaleString('pt-BR')}</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl text-[11px] font-medium text-slate-500 leading-relaxed relative">
                           <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-600"><i className="far fa-copy"></i></button>
                           Discriminação: {pos.quantity} COTAS DO ATIVO {pos.ticker} ({pos.type.toUpperCase()}) CUSTODIADAS NA CORRETORA {pos.broker.toUpperCase()}. PREÇO MÉDIO DE AQUISIÇÃO: R$ {pos.averagePrice.toFixed(2)}.
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RelatoriosIRView;
