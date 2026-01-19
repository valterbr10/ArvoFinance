
import React from 'react';
import { AppState } from '../types';
import Logo from './Logo';

interface Props {
  onNavigate: (view: AppState) => void;
  activeView: AppState;
}

const Navbar: React.FC<Props> = ({ onNavigate, activeView }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 md:px-20 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate(AppState.LANDING)}>
        <Logo type="symbol" size={32} className="group-hover:scale-105 transition-transform" />
        <span className="text-xl font-black text-[#0A1E32] tracking-tighter">Arvo</span>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
        <button onClick={() => onNavigate(AppState.LANDING)} className={`hover:text-[#0A1E32] transition-colors ${activeView === AppState.LANDING ? 'text-[#0A1E32]' : ''}`}>Recursos</button>
        <button className="hover:text-[#0A1E32] transition-colors">Preços</button>
        <button onClick={() => onNavigate(AppState.PROFESSIONAL)} className={`hover:text-[#0A1E32] transition-colors ${activeView === AppState.PROFESSIONAL ? 'text-[#0A1E32]' : ''}`}>Profissional</button>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => onNavigate(AppState.DASHBOARD)}
          className="text-[11px] font-black uppercase tracking-widest text-[#0A1E32] px-4 py-2 hover:bg-slate-50 rounded-lg transition-all"
        >
          Entrar
        </button>
        <button className="text-[11px] font-black uppercase tracking-widest bg-[#0A1E32] text-white px-6 py-2.5 rounded-lg shadow-lg shadow-slate-900/10 hover:bg-[#12304d] transition-all">
          Criar Conta Grátis
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
