
import React, { useMemo, useEffect, useState } from 'react';
import { Operation, AssetPosition } from '../types';
import { calculateMonthlyHeatmap, fetchBenchmarks, BenchmarkData } from '../services/finance';

interface Props {
  operations: Operation[];
  positions: AssetPosition[];
}

const RentabilidadeView: React.FC<Props> = ({ operations, positions }) => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const heatmapData = useMemo(() => calculateMonthlyHeatmap(operations, positions), [operations, positions]);
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const portfolioTotalReturn = useMemo(() => {
    // Cálculo simplificado da rentabilidade total acumulada baseada nos últimos dados do heatmap
    const validMonths = heatmapData.flatMap(d => d.months).filter(m => m !== null) as number[];
    if (validMonths.length === 0) return 0;
    return validMonths.reduce((acc, val) => (1 + acc / 100) * (1 + val / 100) - 1, 0) * 100;
  }, [heatmapData]);

  useEffect(() => {
    const loadBenchmarks = async () => {
      setIsLoading(true);
      const data = await fetchBenchmarks();
      setBenchmarks(data);
      setIsLoading(false);
    };
    loadBenchmarks();
  }, []);

  const getCellColor = (val: number | null) => {
    if (val === null) return 'bg-slate-50 text-slate-300';
    if (val > 2) return 'bg-emerald-500 text-white';
    if (val > 0.5) return 'bg-emerald-400 text-white';
    if (val >= 0) return 'bg-emerald-200 text-emerald-800';
    if (val > -1) return 'bg-red-200 text-red-800';
    if (val > -3) return 'bg-red-400 text-white';
    return 'bg-red-600 text-white';
  };

  // Helper para renderizar um mini-gráfico de linha em SVG
  const renderSparkline = (data: number[], color: string) => {
    if (data.length < 2) return null;
    const width = 200;
    const height = 40;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="bg-[#F8F9FB] min-h-screen p-10 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
           <div>
              <h1 className="text-4xl font-black text-[#0A1E32] tracking-tighter">Rentabilidade</h1>
              <p className="text-slate-400 font-medium">Comparação de performance real e benchmarks</p>
           </div>
           <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95">
              <i className="fas fa-sync-alt mr-2"></i> Recalcular Ativos
           </button>
        </div>

        {/* Comparativo de Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
           {/* Portfolio Card */}
           <div className="bg-[#0A1E32] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Minha Carteira (Líquido)</p>
              <div className="flex items-end justify-between">
                <div>
                   <p className="text-5xl font-black text-emerald-400">{portfolioTotalReturn >= 0 ? '+' : ''}{portfolioTotalReturn.toFixed(2)}%</p>
                   <p className="text-[11px] text-slate-500 mt-2 font-bold uppercase">Acumulado 12m</p>
                </div>
                <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                   {renderSparkline(heatmapData[0]?.months.filter(m => m !== null) as number[] || [], '#10b981')}
                </div>
              </div>
           </div>

           {/* CDI Card */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                 <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">CDI (100%)</p>
                    <span className={`text-xs font-black ${portfolioTotalReturn > (benchmarks.find(b => b.label === 'CDI')?.totalReturn || 0) ? 'text-emerald-500' : 'text-slate-400'}`}>
                       {portfolioTotalReturn > (benchmarks.find(b => b.label === 'CDI')?.totalReturn || 0) ? 'Acima do CDI' : 'Abaixo do CDI'}
                    </span>
                 </div>
                 <p className="text-4xl font-black text-slate-800">
                   {isLoading ? '...' : benchmarks.find(b => b.label === 'CDI')?.totalReturn.toFixed(2) + '%'}
                 </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                 <div className="opacity-30">
                    {renderSparkline(benchmarks.find(b => b.label === 'CDI')?.monthlyHistory || [], '#94a3b8')}
                 </div>
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                    <i className="fas fa-university"></i>
                 </div>
              </div>
           </div>

           {/* IBOVESPA Card */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                 <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">IBOVESPA</p>
                    <span className={`text-xs font-black ${portfolioTotalReturn > (benchmarks.find(b => b.label === 'IBOVESPA')?.totalReturn || 0) ? 'text-emerald-500' : 'text-slate-400'}`}>
                       {portfolioTotalReturn > (benchmarks.find(b => b.label === 'IBOVESPA')?.totalReturn || 0) ? 'Vencendo o IBOV' : 'Perdendo p/ IBOV'}
                    </span>
                 </div>
                 <p className="text-4xl font-black text-slate-800">
                    {isLoading ? '...' : benchmarks.find(b => b.label === 'IBOVESPA')?.totalReturn.toFixed(2) + '%'}
                 </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                 <div className="opacity-30">
                    {renderSparkline(benchmarks.find(b => b.label === 'IBOVESPA')?.monthlyHistory || [], '#94a3b8')}
                 </div>
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                    <i className="fas fa-chart-line"></i>
                 </div>
              </div>
           </div>
        </div>

        {/* Heatmap Grid */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-xl font-black text-[#0A1E32]">Performance Mensal (%)</h3>
             <div className="flex items-center space-x-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button className="px-6 py-2 bg-white rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest text-[#0A1E32]">Sua Carteira</button>
                <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Ver p/ Classe</button>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
               <thead>
                  <tr>
                     <th className="p-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ano</th>
                     {months.map(m => (
                       <th key={m} className="p-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{m}</th>
                     ))}
                     <th className="p-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 rounded-tr-xl">Total</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white">
                  {heatmapData.map((row, i) => (
                    <tr key={i}>
                       <td className="p-3 text-sm font-black text-[#0A1E32]">{row.year}</td>
                       {row.months.map((val, mi) => (
                         <td key={mi} className="p-1">
                            <div className={`h-12 w-full flex items-center justify-center rounded-xl text-xs font-black transition-all hover:scale-105 hover:shadow-lg cursor-default ${getCellColor(val)}`}>
                               {val !== null ? `${val.toFixed(2)}%` : '--'}
                            </div>
                         </td>
                       ))}
                       <td className="p-3 text-right">
                          <div className={`text-sm font-black ${row.total >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                             {row.total >= 0 ? '+' : ''}{row.total.toFixed(2)}%
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
          
          <div className="mt-10 flex items-center justify-center space-x-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <div className="flex items-center"><div className="w-4 h-4 bg-red-600 rounded-lg mr-2"></div> Pânico</div>
             <div className="flex items-center"><div className="w-4 h-4 bg-red-200 rounded-lg mr-2"></div> Negativo</div>
             <div className="flex items-center"><div className="w-4 h-4 bg-emerald-200 rounded-lg mr-2"></div> Estável</div>
             <div className="flex items-center"><div className="w-4 h-4 bg-emerald-500 rounded-lg mr-2"></div> Alvo</div>
          </div>
        </div>

        {/* Alpha Insight */}
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center space-x-8 animate-pulse-slow">
           <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-500 text-2xl shadow-sm shrink-0">
              <i className="fas fa-magic"></i>
           </div>
           <div>
              <h4 className="text-lg font-black text-emerald-900">Alpha da Carteira: +{(portfolioTotalReturn - (benchmarks.find(b => b.label === 'CDI')?.totalReturn || 0)).toFixed(2)}%</h4>
              <p className="text-sm text-emerald-700 font-medium leading-relaxed mt-1">
                Sua estratégia superou o CDI no período analisado. Isso indica que a gestão ativa de ativos e a diversificação em {positions.length} ativos estão gerando valor real acima do custo de oportunidade.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RentabilidadeView;
