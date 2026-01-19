
import React, { useState, useEffect } from 'react';
import { AssetPosition } from '../types';
import { fetchTreasuryRates, TreasuryBond } from '../services/finance';

interface Props {
  positions: AssetPosition[];
}

const TesouroDiretoView: React.FC<Props> = ({ positions }) => {
  const [activeTab, setActiveTab] = useState<'Cotações' | 'Posições' | 'Operações'>('Cotações');
  const [marketBonds, setMarketBonds] = useState<TreasuryBond[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const treasuryPositions = positions.filter(p => p.type === 'Tesouro Direto');

  useEffect(() => {
    const loadRates = async () => {
      setIsLoading(true);
      const rates = await fetchTreasuryRates();
      setMarketBonds(rates);
      setIsLoading(false);
    };
    loadRates();
  }, []);

  const getHighlights = () => {
    const selic = marketBonds.find(b => b.name?.includes('Selic'));
    const ipca = [...marketBonds]
      .filter(b => b.name?.includes('IPCA'))
      .sort((a,b) => parseFloat(String(b.rate || '0')) - parseFloat(String(a.rate || '0')))[0];
    const pre = [...marketBonds]
      .filter(b => b.name?.includes('Prefixado'))
      .sort((a,b) => parseFloat(String(b.rate || '0')) - parseFloat(String(a.rate || '0')))[0];
    return { selic, ipca, pre };
  };

  const highlights = getHighlights();

  return (
    <div className="bg-[#F8F9FB] min-h-screen p-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#0A1E32] tracking-tighter">Tesouro Direto</h1>
          <p className="text-slate-400 font-medium">Títulos Públicos Federais: A segurança máxima do mercado</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl flex items-center space-x-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Garantia Soberana FGC-Exempt</span>
        </div>
      </div>

      {/* Destaques do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          { label: 'Tesouro Selic', bond: highlights.selic, icon: 'fa-university', color: 'blue' },
          { label: 'Melhor IPCA+', bond: highlights.ipca, icon: 'fa-chart-line', color: 'emerald' },
          { label: 'Melhor Prefixado', bond: highlights.pre, icon: 'fa-clock', color: 'purple' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
               <div className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${item.icon} text-${item.color}-500 text-xl`}></i>
               </div>
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{item.label}</span>
            </div>
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-50 rounded w-1/2"></div>
              </div>
            ) : (
              <div>
                 <p className="text-sm font-black text-slate-400 uppercase tracking-tight mb-1">{item.bond?.name || '---'}</p>
                 <p className="text-3xl font-black text-[#0A1E32] mb-4">{item.bond?.rate || '---'}</p>
                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Mínimo: R$ {item.bond?.minAmount || '---'}</span>
                    <span className="bg-slate-50 px-2 py-1 rounded">Vence em {item.bond?.maturity || '---'}</span>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs System */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm min-h-[500px]">
        <div className="flex space-x-8 border-b border-slate-100 mb-10">
          {['Cotações', 'Posições', 'Operações'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-2 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#0A1E32]' : 'text-slate-300 hover:text-slate-500'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0A1E32] animate-in slide-in-from-left duration-300"></div>}
            </button>
          ))}
          <div className="ml-auto flex space-x-4 mb-4">
             <button onClick={() => window.location.reload()} className="px-6 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
               <i className="fas fa-sync-alt mr-2"></i> Sincronizar Tesouro
             </button>
          </div>
        </div>

        {activeTab === 'Cotações' && (
          <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-left">
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Título</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vencimento</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxa de Rendimento</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Investimento Mín.</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Preço Unit. (Mercado)</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {marketBonds.map((bond, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-5 text-sm font-black text-slate-800">{bond.name}</td>
                       <td className="px-6 py-5 text-sm font-medium text-slate-500">{bond.maturity}</td>
                       <td className="px-6 py-5 text-sm font-black text-emerald-600">{bond.rate}</td>
                       <td className="px-6 py-5 text-sm font-bold text-slate-700">{bond.minAmount}</td>
                       <td className="px-6 py-5 text-sm font-black text-[#0A1E32] text-right">R$ {(bond.price || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Posições' && (
          <div>
            {treasuryPositions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Título</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qtde</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">P. Médio</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">V. Investido</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">V. Atual</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Rent. Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {treasuryPositions.map((pos, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-6 py-5 text-sm font-black text-blue-600">{pos.ticker}</td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-700 text-center">{pos.quantity}</td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-700 text-right">R$ {pos.averagePrice.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-700 text-right">R$ {pos.totalInvested.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-5 text-sm font-black text-slate-900 text-right">R$ {pos.totalCurrent.toLocaleString('pt-BR')}</td>
                        <td className={`px-6 py-5 text-sm font-black text-right ${pos.plPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                           {pos.plPercent >= 0 ? '+' : ''}{pos.plPercent.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 opacity-20">
                <i className="fas fa-landmark text-6xl text-slate-400 mb-6"></i>
                <p className="text-lg font-black text-slate-800 uppercase tracking-tight">Você ainda não tem títulos públicos</p>
                <p className="text-xs font-medium text-slate-400 mt-2">Explore as cotações para começar a investir</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Operações' && (
           <div className="flex flex-col items-center justify-center py-24 opacity-20">
              <i className="fas fa-history text-5xl text-slate-400 mb-6"></i>
              <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Histórico de Movimentações TD</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default TesouroDiretoView;
