
import React from 'react';

const ProfessionalLandingView: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-32">
      {/* Hero Profissional */}
      <section className="bg-[#0A1E32] py-32 px-6 md:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full mb-8 border border-white/10">
               <i className="fas fa-briefcase text-[#C4953D] mr-2 text-xs"></i>
               <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Feito para contadores e consultores financeiros</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8">
              Simplifique a gestão de <br/><span className="text-[#C4953D]">investimentos</span> <br/>dos seus clientes
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl mb-12 leading-relaxed">
              Com o Arvo Profissional, contadores e consultores controlam todas as carteiras em um só painel, com apuração automática de IR.
            </p>
            <button className="bg-[#C4953D] hover:bg-[#B38535] text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-amber-900/40">
              Testar o Arvo Profissional grátis
            </button>
          </div>
          
          <div className="flex-1 relative">
             <div className="bg-white rounded-[3rem] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-black text-slate-800 tracking-tight">Painel Multi-Cliente</h3>
                   <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">15 Clientes Ativos</span>
                </div>
                <div className="space-y-6">
                   {[
                     { name: 'João Silva', val: 'R$ 425k', status: 'IR Atualizado', color: 'emerald' },
                     { name: 'Maria Santos', val: 'R$ 315k', status: 'Pendente', color: 'amber' },
                     { name: 'Carlos Oliveira', val: 'R$ 280k', status: 'IR Atualizado', color: 'emerald' },
                   ].map((c, i) => (
                     <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                        <div>
                           <p className="text-sm font-black text-slate-800">{c.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{c.val}</p>
                        </div>
                        <div className={`text-[10px] font-black text-${c.color}-600 uppercase flex items-center`}>
                           <i className={`fas ${c.color === 'emerald' ? 'fa-check' : 'fa-clock'} mr-2`}></i> {c.status}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="absolute -bottom-6 -left-6 bg-[#C4953D] p-6 rounded-[2rem] shadow-2xl">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Economize</p>
                <p className="text-xl font-black text-white">80% do tempo</p>
             </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-32 px-6 md:px-20">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-5xl font-black text-[#0A1E32] tracking-tighter mb-4">Como funciona?</h2>
           <p className="text-slate-400 font-medium mb-20">Em três passos simples, você está pronto para gerenciar todas as carteiras.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { n: '1', t: 'Cadastre seus clientes', d: 'Adicione clientes ao painel profissional com acesso individualizado e seguro.', icon: 'fa-user-plus' },
                { n: '2', t: 'Importe as carteiras', d: 'Integre automaticamente com corretoras ou importe planilhas de movimentações.', icon: 'fa-cloud-upload-alt' },
                { n: '3', t: 'Gere relatórios', d: 'Apure IR, exporte relatórios e envie para seus clientes com um clique.', icon: 'fa-file-invoice-dollar' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-8 relative">
                      <i className={`fas ${step.icon} text-slate-400 text-xl`}></i>
                      <span className="absolute -top-3 -right-3 w-8 h-8 bg-[#0A1E32] text-white rounded-full flex items-center justify-center text-xs font-black">{step.n}</span>
                   </div>
                   <h3 className="text-xl font-black text-slate-800 mb-4">{step.t}</h3>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed">{step.d}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Planos Pro */}
      <section className="py-32 px-6 md:px-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black text-[#0A1E32] tracking-tighter mb-16">Planos profissionais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {[
               { name: 'Profissional', price: '79', desc: 'Para contadores independentes', limit: 'Até 10 clientes' },
               { name: 'Escritório', price: '199', desc: 'Para escritórios em crescimento', limit: 'Até 50 clientes', featured: true },
               { name: 'Premium', price: 'Sob consulta', desc: 'Para grandes escritórios', limit: 'Clientes ilimitados' }
             ].map((p, i) => (
                <div key={i} className={`p-12 rounded-[3rem] bg-white border ${p.featured ? 'border-[#C4953D] shadow-2xl relative' : 'border-slate-100 shadow-sm'}`}>
                   {p.featured && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C4953D] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase">Mais Popular</span>}
                   <p className="text-lg font-black text-slate-800 mb-2">{p.name}</p>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">{p.desc}</p>
                   <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase mb-10 inline-block">{p.limit}</span>
                   <p className="text-5xl font-black text-[#0A1E32] mb-12">
                     {p.price === 'Sob consulta' ? p.price : `R$ ${p.price}`}
                     {p.price !== 'Sob consulta' && <span className="text-sm text-slate-400 font-medium">/mês</span>}
                   </p>
                   <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${p.featured ? 'bg-[#C4953D] text-white' : 'bg-[#0A1E32] text-white'}`}>
                     {p.price === 'Sob consulta' ? 'Falar com especialista' : 'Começar Teste Grátis'}
                   </button>
                </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalLandingView;
