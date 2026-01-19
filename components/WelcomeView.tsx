
import React, { useState } from 'react';
import Logo from './Logo';

interface WelcomeViewProps {
  onConnect: (url: string) => void;
  onDemo: () => void;
  isLoading: boolean;
  error: string | null;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onConnect, onDemo, isLoading, error }) => {
  const [url, setUrl] = useState('https://github.com/valterbr10/Arvo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onConnect(url.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center px-6 items-center text-center py-20">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-[#0A1E32] tracking-tighter mb-4">
           Conecte seu Projeto
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Importe seu repositório GitHub para que o Arvo possa analisar seu código e ajudar no desenvolvimento da sua plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl mb-12">
        <div className="relative group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/usuario/projeto"
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-[#0A1E32] text-lg font-bold focus:outline-none focus:border-[#C4953D] transition-all shadow-xl shadow-slate-200/50"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="absolute right-3 top-3 bottom-3 px-8 bg-[#0A1E32] hover:bg-[#12304d] disabled:opacity-50 text-white font-black rounded-2xl transition-all flex items-center space-x-3 shadow-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="uppercase text-[10px] tracking-widest">Conectar Repositório</span>
                <i className="fas fa-cloud-download-alt"></i>
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-500 mt-6 text-xs font-black uppercase tracking-widest flex items-center justify-center bg-red-50 p-4 rounded-xl border border-red-100">
            <i className="fas fa-exclamation-circle mr-3"></i>
            {error}
          </p>
        )}
      </form>

      <div className="flex flex-col items-center space-y-8">
        <button 
          onClick={onDemo}
          className="text-[#C4953D] hover:text-[#B38535] transition-colors font-black text-[10px] uppercase tracking-widest flex items-center group"
        >
          <span className="mr-3">Ou visualizar Dashboard de Exemplo</span>
          <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
            <i className="fab fa-github text-[#0A1E32] mb-4 text-2xl"></i>
            <h3 className="text-[#0A1E32] font-black text-[10px] uppercase tracking-widest mb-1">GitHub Sync</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Sincronização Ativa</p>
          </div>
          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
            <i className="fas fa-brain text-[#C4953D] mb-4 text-2xl"></i>
            <h3 className="text-[#0A1E32] font-black text-[10px] uppercase tracking-widest mb-1">Análise IA</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Contexto Inteligente</p>
          </div>
          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
            <i className="fas fa-code text-blue-500 mb-4 text-2xl"></i>
            <h3 className="text-[#0A1E32] font-black text-[10px] uppercase tracking-widest mb-1">Clean Code</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Refatoração Sugerida</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
