
import React, { useState, useEffect } from 'react';
import { IAInsight } from '../types';

const AlertasView: React.FC = () => {
  const [insights, setInsights] = useState<IAInsight[]>([
    {
      type: 'atenção',
      title: 'Concentração em Setor',
      description: 'Sua carteira possui mais de 45% de exposição ao setor Financeiro. Considere diversificar em Consumo ou Tecnologia para reduzir riscos sistêmicos.',
      action: 'Ver Composição'
    },
    {
      type: 'informativo',
      title: 'Proventos Pendentes',
      description: 'Identificamos que PETR4 anunciou novos dividendos com data-com na próxima semana. Sua posição atual renderá aproximadamente R$ 450,00.',
      action: 'Ver Proventos'
    },
    {
      type: 'crítico',
      title: 'Divergência de Preço Médio',
      description: 'Uma operação recente de ITUB4 foi registrada com custo zero. Isso pode afetar seu cálculo de IR. Recomendamos revisar o lançamento.',
      action: 'Revisar Operações'
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'crítico': return 'fa-exclamation-circle text-red-500';
      case 'atenção': return 'fa-exclamation-triangle text-amber-500';
      default: return 'fa-info-circle text-blue-500';
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'crítico': return 'bg-red-50 border-red-100';
      case 'atenção': return 'bg-amber-50 border-amber-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="bg-[#F8F9FB] min-h-screen p-10 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-14 h-14 bg-[#0A1E32] rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
            <i className="fas fa-robot text-2xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#0A1E32] tracking-tighter">Alertas & Insights</h1>
            <p className="text-slate-400 font-medium">O Mentor Arvo explica o que está acontecendo com seu patrimônio</p>
          </div>
        </div>

        <div className="space-y-6">
          {insights.map((insight, i) => (
            <div key={i} className={`p-8 rounded-[2rem] border ${getBg(insight.type)} shadow-sm transition-all hover:scale-[1.01] flex items-start space-x-6`}>
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <i className={`fas ${getIcon(insight.type)} text-xl`}></i>
               </div>
               <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="text-lg font-black text-slate-800">{insight.title}</h3>
                     <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white border border-slate-100 text-slate-400">{insight.type}</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{insight.description}</p>
                  {insight.action && (
                    <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all">
                      {insight.action} <i className="fas fa-arrow-right ml-2 opacity-30"></i>
                    </button>
                  )}
               </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white p-10 rounded-[2.5rem] border border-slate-100 text-center">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-magic text-[#C4953D] text-3xl"></i>
           </div>
           <h4 className="text-xl font-black text-slate-800 mb-2">Como funcionam os insights?</h4>
           <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
             O Arvo utiliza inteligência artificial contextual para analisar suas movimentações e compará-las com dados de mercado em tempo real, sugerindo rebalanceamentos e alertando sobre questões fiscais.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AlertasView;
