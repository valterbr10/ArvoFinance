
import React, { useEffect, useState } from 'react';
import { AppState } from '../types';
import { fetchMarketRankings, FullMarketData } from '../services/finance';
import Logo from './Logo';

interface Props {
  onNavigate: (view: AppState) => void;
}

const LandingView: React.FC<Props> = ({ onNavigate }) => {
  const [marketData, setMarketData] = useState<FullMarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadRankings = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await fetchMarketRankings();
      setMarketData(data);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRankings();
  }, []);

  const renderRankingList = (list: any[] | undefined, title: string, icon: string, colorClass: string) => (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[460px]">
      <div className="flex items-center space-x-3 mb-10">
        <i className={`fas ${icon} ${colorClass}`}></i>
        <h3 className="text-lg font-black text-[#0A1E32]">{title}</h3>
      </div>
      <div className="space-y-6 flex-1">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="w-16 h-3 bg-slate-100 rounded"></div>
                  <div className="w-24 h-2 bg-slate-50 rounded"></div>
                </div>
              </div>
              <div className="space-y-2 text-right">
                <div className="w-12 h-3 bg-slate-100 rounded ml-auto"></div>
                <div className="w-10 h-2 bg-slate-50 rounded ml-auto"></div>
              </div>
            </div>
          ))
        ) : (
          list && list.length > 0 ? (
            list.map((s, i) => (
              <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-xl transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-[10px] text-slate-400 group-hover:${colorClass} group-hover:bg-opacity-10 transition-colors`}>
                    {s.ticker?.slice(0, 4) || '---'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{s.ticker || '---'}</p>
                    <p className="text-[10px] font-medium text-slate-400 truncate max-w-[140px]">{s.name || '---'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-800">{s.price || '---'}</p>
                  <p className={`text-[10px] font-black uppercase ${(s.change && s.change.includes('+')) ? 'text-emerald-500' : 'text-red-500'}`}>
                    {s.change || '0,00%'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-10">
               <i className="fas fa-search mb-4 text-3xl"></i>
               <p className="text-xs font-bold uppercase">Sem dados no momento</p>
            </div>
          )
        )}
      </div>
    </div>
  );

  const defaultIndices = [
    { label: 'IBOVESPA', value: '---', change: '---', positive: true },
    { label: 'DÓLAR PTAX', value: '---', change: '---', positive: true },
    { label: 'IFIX', value: '---', change: '---', positive: true },
    { label: 'S&P 500', value: '---', change: '---', positive: true },
  ];

  const currentIndices = Array.isArray(marketData?.indices) && marketData.indices.length > 0 
    ? marketData.indices 
    : defaultIndices;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0A1E32] pt-40 pb-32 px-6 md:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full mb-8 border border-white/10">
               <i className="fas fa-shield-halved text-[#C4953D] mr-3 text-xs"></i>
               <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Mais controle. Mais crescimento.</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8">
              Sua carteira de <br/>investimentos <br/><span className="text-[#C4953D]">em um só lugar</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl mb-12 leading-relaxed">
              Consolide sua carteira de investimentos em um só lugar, com apuração automática de IR e dashboards profissionais.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-[#C4953D] hover:bg-[#B38535] text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-amber-900/40 transition-all active:scale-95">
                Crie sua conta grátis <i className="fas fa-arrow-right ml-3 text-xs"></i>
              </button>
              <button onClick={() => onNavigate(AppState.DASHBOARD)} className="border-2 border-white/10 hover:border-white/30 text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all">
                Ver demonstração
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
             <div className="bg-slate-800/20 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-4 shadow-2xl overflow-hidden">
                <div className="bg-[#0A1E32] w-full h-[400px] flex items-center justify-center p-12">
                   <Logo type="full" size={100} />
                </div>
             </div>
             <div className="absolute -top-10 -right-4 bg-[#C4953D] p-8 rounded-[2rem] shadow-2xl animate-bounce-slow flex flex-col items-center">
                <Logo type="symbol" size={48} className="mb-4" />
                <p className="text-[10px] font-black text-amber-950 uppercase tracking-widest leading-none">IR Estimado</p>
                <p className="text-xl font-black text-white mt-1">R$ 1.234,56</p>
             </div>
          </div>
        </div>
      </section>

      {/* Mercado Agora */}
      <section className="py-24 px-6 md:px-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-3xl font-black text-[#0A1E32] tracking-tighter">Mercado Agora</h2>
               <p className="text-slate-400 text-sm font-medium mt-2">Dados em tempo real via B3 <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase">{isLoading ? 'Sincronizando...' : 'Online'}</span></p>
            </div>
            <button onClick={loadRankings} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50" disabled={isLoading}>
               <i className={`fas fa-sync-alt mr-2 ${isLoading && 'animate-spin'}`}></i> Atualizar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {currentIndices.map((idx, i) => (
              <div key={i} className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:border-[#C4953D]/20 ${isLoading && 'animate-pulse'}`}>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{idx.label}</p>
                 <p className="text-3xl font-black text-slate-800">{idx.value}</p>
                 <div className={`mt-4 text-[11px] font-black ${idx.positive ? 'text-emerald-500' : 'text-red-500'} flex items-center`}>
                    <i className={`fas ${idx.positive ? 'fa-caret-up' : 'fa-caret-down'} mr-2`}></i> {idx.change}
                 </div>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center">
              <span className="w-8 h-[2px] bg-[#C4953D]/30 mr-4"></span> Ações B3
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderRankingList(marketData?.acoes?.altas, 'Maiores Altas do Dia', 'fa-chart-line', 'text-emerald-500')}
              {renderRankingList(marketData?.acoes?.baixas, 'Maiores Baixas do Dia', 'fa-chart-line rotate-180', 'text-red-500')}
            </div>
          </div>

          <div className="mb-16">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center">
              <span className="w-8 h-[2px] bg-[#C4953D]/30 mr-4"></span> Fundos Imobiliários (FIIs)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderRankingList(marketData?.fiis?.altas, 'Maiores Altas do Dia', 'fa-building', 'text-emerald-500')}
              {renderRankingList(marketData?.fiis?.baixas, 'Maiores Baixas do Dia', 'fa-building opacity-50', 'text-red-500')}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1E32] py-24 px-6 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <Logo type="symbol" size={80} className="mb-10" />
          <h2 className="text-4xl font-black text-white tracking-tighter mb-12">Tome o controle dos seus <br/><span className="text-[#C4953D]">investimentos agora</span></h2>
          <button onClick={() => onNavigate(AppState.DASHBOARD)} className="bg-[#C4953D] hover:bg-[#B38535] text-white px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-amber-900/40 transition-all">
            Comece Gratuitamente Hoje <i className="fas fa-arrow-right ml-3 text-xs"></i>
          </button>
          <div className="mt-20 pt-10 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex items-center space-x-3">
                <span className="text-xl font-black text-white tracking-tighter">Arvo</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span className="text-[10px] font-black text-[#C4953D] uppercase tracking-[0.2em]">Mais controle. Mais crescimento.</span>
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">© 2025 Arvo Wealth Intelligence</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
