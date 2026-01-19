
import React, { useMemo } from 'react';
import { AssetPosition, Operation } from '../types';

interface Props {
  positions: AssetPosition[];
  operations: Operation[];
  onRefresh: () => void;
}

const DashboardView: React.FC<Props> = ({ positions, operations, onRefresh }) => {
  const stats = useMemo(() => {
    const totalInvested = positions.reduce((acc, p) => acc + p.totalInvested, 0);
    const totalCurrent = positions.reduce((acc, p) => acc + p.totalCurrent, 0);
    const plAmount = totalCurrent - totalInvested;
    const plPercent = totalInvested > 0 ? (plAmount / totalInvested) * 100 : 0;

    const sorted = [...positions].sort((a, b) => b.plPercent - a.plPercent);
    const topPerformer = sorted[0];
    const bottomPerformer = sorted[sorted.length - 1];

    const sectors: Record<string, number> = {};
    positions.forEach(p => {
      sectors[p.sector || 'Outros'] = (sectors[p.sector || 'Outros'] || 0) + (p.totalCurrent / totalCurrent * 100);
    });
    const mainSector = Object.entries(sectors).sort((a, b) => b[1] - a[1])[0];

    return { totalCurrent, totalInvested, plAmount, plPercent, topPerformer, bottomPerformer, mainSector };
  }, [positions]);

  const marketIndices = [
    { label: 'IBOV', value: '131.250', change: '+0.52%', positive: true },
    { label: 'IFIX', value: '3.342', change: '-0.12%', positive: false },
    { label: 'USD/BRL', value: 'R$ 5,42', change: '+0.08%', positive: true },
    { label: 'BITCOIN', value: 'R$ 545.000', change: '+2.41%', positive: true },
  ];

  return (
    <div className="bg-[#F8F9FB] min-h-screen p-6 md:p-10 text-slate-800 animate-in fade-in duration-700">
      {/* Ticker Tape */}
      <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {marketIndices.map((idx, i) => (
          <div key={i} className="bg-white border border-slate-100 px-5 py-3 rounded-2xl flex items-center space-x-6 shadow-sm min-w-[160px] hover:border-[#C4953D]/30 transition-colors">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{idx.label}</p>
              <p className="text-sm font-black text-slate-800">{idx.value}</p>
            </div>
            <div className={`text-[9px] font-black px-2 py-1 rounded-lg flex items-center ${idx.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <i className={`fas fa-caret-up mr-1 ${!idx.positive && 'rotate-180'}`}></i>
              {idx.change}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Main Cards */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A1E32] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white min-h-[220px] flex flex-col justify-between">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Patrimônio Consolidado</p>
                <p className="text-5xl font-black tracking-tighter">R$ {stats.totalCurrent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-[10px] font-bold text-emerald-400">
                  <i className="fas fa-arrow-up mr-2"></i>
                  Histórico crescente
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Baseado em B3 Real-time</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[220px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Resultado Líquido</p>
                    <p className={`text-4xl font-black ${stats.plAmount >= 0 ? 'text-emerald-500' : 'text-red-500'} tracking-tighter`}>
                        {stats.plAmount >= 0 ? '+' : ''}R$ {stats.plAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </p>
                 </div>
                 <div className={`w-12 h-12 ${stats.plPercent >= 0 ? 'bg-emerald-50' : 'bg-red-50'} rounded-2xl flex items-center justify-center`}>
                    <i className={`fas fa-chart-line ${stats.plPercent >= 0 ? 'text-emerald-500' : 'text-red-500'} text-lg`}></i>
                 </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rentabilidade</span>
                 <span className={`text-sm font-black ${stats.plPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stats.plPercent >= 0 ? '+' : ''}{stats.plPercent.toFixed(2)}%
                 </span>
              </div>
            </div>
          </div>

          {/* Quick Insights Bar */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-[#0A1E32] uppercase tracking-[0.15em] mb-6 flex items-center">
              <i className="fas fa-robot mr-3 text-[#C4953D]"></i> Smart Insights Arvo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><i className="fas fa-layer-group"></i></div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Exposição Setorial</p>
                   <p className="text-xs font-bold text-slate-700 mt-1">{stats.mainSector ? `${stats.mainSector[0]} (${stats.mainSector[1].toFixed(1)}%)` : '--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><i className="fas fa-trophy"></i></div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Principal Ativo</p>
                   <p className="text-xs font-bold text-slate-700 mt-1">{stats.topPerformer?.ticker || '--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><i className="fas fa-exclamation-triangle"></i></div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Revisão Sugerida</p>
                   <p className="text-xs font-bold text-slate-700 mt-1">{stats.bottomPerformer?.ticker || '--'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Asset List & Rebalancing */}
        <div className="w-full lg:w-[400px] space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-black text-[#0A1E32]">Sua Carteira</h3>
                 <button onClick={onRefresh} className="text-[#C4953D] hover:rotate-180 transition-all duration-500"><i className="fas fa-sync-alt"></i></button>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[400px] custom-scrollbar">
                {positions.length === 0 ? (
                  <div className="text-center py-20 opacity-20">
                     <i className="fas fa-folder-open text-4xl mb-4"></i>
                     <p className="text-xs font-bold uppercase">Nenhum ativo</p>
                  </div>
                ) : (
                  positions.map((pos, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xs font-black text-[#0A1E32] shadow-sm group-hover:bg-[#0A1E32] group-hover:text-white transition-all">
                             {pos.ticker.slice(0, 4)}
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-800">{pos.ticker}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">{pos.quantity} cotas</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-slate-800">R$ {pos.totalCurrent.toLocaleString('pt-BR')}</p>
                          <p className={`text-[9px] font-black ${pos.plPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                             {pos.plPercent >= 0 ? '+' : ''}{pos.plPercent.toFixed(2)}%
                          </p>
                       </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                 <button className="w-full bg-[#0A1E32] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#12304d] transition-all shadow-xl shadow-slate-900/10">
                    Gerar Relatório PDF
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
