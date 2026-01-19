
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectionGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0A1E32]/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0A1E32] p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Guia de Conexão</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Resolvendo problemas de acesso</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <section className="space-y-4">
            <div className="flex items-center space-x-3">
               <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-black">1</div>
               <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Acesso Rápido (URL Pública)</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Você pode usar o botão <b>"Deploy"</b> ou <b>"Implantar App"</b> que aparece no menu do próprio Google AI Studio. Ele gera um link para você abrir o Arvo sem precisar de nenhuma configuração técnica.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center space-x-3">
               <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-black">2</div>
               <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Configuração do Chrome</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Se a conexão GitHub falhar, clique no ícone de <b>Ajustes</b> <i className="fas fa-sliders-h mx-1 text-slate-400"></i> ou <b>Cadeado</b> à esquerda da URL e habilite os cookies de terceiros para este site.
            </p>
          </section>

          <section className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100">
            <div className="flex items-center space-x-4 mb-4">
               <i className="fas fa-cloud-download-alt text-amber-600 text-xl"></i>
               <h3 className="font-black text-amber-900 uppercase text-xs tracking-widest">Backup de Segurança</h3>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed mb-4">
              Use o botão <b>"Download App"</b> no AI Studio para baixar o código e o botão <b>"Exportar ZIP Local"</b> no Arvo para salvar seus investimentos.
            </p>
          </section>
        </div>

        <div className="p-10 pt-0">
           <button onClick={onClose} className="w-full bg-[#0A1E32] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Entendi, perfeito</button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionGuideModal;
