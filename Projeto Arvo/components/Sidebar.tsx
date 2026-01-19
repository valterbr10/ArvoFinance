
import React from 'react';
import { AppState } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeView: AppState;
  onNavigate: (view: AppState) => void;
  onExport: () => void;
  onOpenHelp: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onExport, onOpenHelp }) => {
  const navItems = [
    { id: AppState.DASHBOARD, label: 'Dashboard', sub: 'Visão geral consolidada', icon: 'fa-th-large' },
    { id: AppState.CARTEIRA, label: 'Carteira', sub: 'Posições e alocação', icon: 'fa-wallet' },
    { id: AppState.OPERACOES, label: 'Operações', sub: 'Compras e vendas', icon: 'fa-exchange-alt' },
    { id: AppState.TESOURO, label: 'Tesouro Direto', sub: 'Títulos públicos federais', icon: 'fa-landmark' },
    { id: AppState.PROVENTOS, label: 'Proventos', sub: 'Dividendos e rendimentos', icon: 'fa-dollar-sign' },
    { id: AppState.RENTABILIDADE, label: 'Rentabilidade', sub: 'Performance da carteira', icon: 'fa-chart-line' },
    { id: AppState.RELATORIOS_IR, label: 'Relatórios e IR', sub: 'Apuração fiscal e impostos', icon: 'fa-file-invoice-dollar' },
    { id: AppState.SEGURANCA, label: 'Segurança', sub: 'Privacidade de dados', icon: 'fa-shield-halved' },
    { id: AppState.ALERTAS, label: 'Alertas', sub: 'Insights e notificações', icon: 'fa-bell' },
  ];

  return (
    <div className="w-[260px] bg-[#0A1E32] flex flex-col h-screen shrink-0 overflow-hidden border-r border-slate-800 shadow-2xl">
      <div className="p-6">
        <div className="mb-10 cursor-pointer group" onClick={() => onNavigate(AppState.DASHBOARD)}>
          <Logo type="horizontal" size={38} className="group-hover:scale-[1.02] transition-transform" />
        </div>

        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-420px)] pr-2 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left group ${
                activeView === item.id 
                  ? 'bg-[#12304d] text-white border border-slate-700/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center text-sm ${activeView === item.id ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}></i>
              <div>
                <p className={`text-xs font-bold ${activeView === item.id ? 'text-white' : 'text-slate-300'}`}>{item.label}</p>
                <p className="text-[9px] text-slate-500 font-medium leading-tight">{item.sub}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800/50 space-y-4 bg-slate-900/40">
        <div 
          onClick={onOpenHelp}
          className="bg-white/5 border border-white/5 rounded-2xl p-4 group cursor-pointer transition-all hover:bg-white/10"
        >
           <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ajuda GitHub</span>
              <div className="flex items-center space-x-1.5">
                 <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                 <span className="text-[8px] font-black text-amber-500 uppercase">Ver Tutorial</span>
              </div>
           </div>
           <p className="text-[9px] text-slate-400 leading-tight">
              Clique aqui para ver como resolver o erro <b className="text-slate-200">"Algo deu errado"</b>.
           </p>
        </div>

        <button 
          onClick={onExport}
          className="w-full bg-[#C4953D] hover:bg-[#B38535] text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all shadow-lg shadow-amber-900/20 active:scale-95 group"
        >
          <i className="fas fa-download mr-3 group-hover:bounce"></i>
          Exportar ZIP Local
        </button>

        <button 
          onClick={() => window.location.reload()}
          className="flex items-center space-x-3 text-slate-500 hover:text-red-400 transition-colors group w-full pt-2"
        >
            <i className="fas fa-sign-out-alt text-sm"></i>
            <span className="text-xs font-bold uppercase tracking-widest">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
