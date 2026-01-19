
import React from 'react';

const ProventosView: React.FC = () => {
  const proventosHistory = [
    { date: '16/01/2026', ticker: 'ITSA4', name: 'Itaúsa', type: 'Dividendo', value: 0.0244 },
    { date: '16/01/2026', ticker: 'TAEE11', name: 'Taesa', type: 'Rend. FII', value: 0.0610 },
    { date: '16/01/2026', ticker: 'CPLE6', name: 'Copel', type: 'Dividendo', value: 0.0362 },
    { date: '16/01/2026', ticker: 'HGLG11', name: 'CSHG Logística', type: 'Rend. FII', value: 0.8194 },
    { date: '16/01/2026', ticker: 'KNRI11', name: 'Kinea Renda Imobiliária', type: 'Rend. FII', value: 0.6966 },
    { date: '16/01/2026', ticker: 'MXRF11', name: 'Maxi Renda', type: 'Rend. FII', value: 1.0068 },
  ];

  const monthlyData = [
    { month: 'jan. de 26', value: 80 },
    { month: 'dez. de 25', value: 80 },
    { month: 'nov. de 25', value: 80 },
    { month: 'out. de 25', value: 45 },
    { month: 'set. de 25', value: 25 },
    { month: 'ago. de 25', value: 35 },
    { month: 'jul. de 25', value: 65 },
    { month: 'jun. de 25', value: 48 },
    { month: 'mai. de 25', value: 52 },
    { month: 'abr. de 25', value: 50 },
    { month: 'mar. de 25', value: 50 },
    { month: 'fev. de 25', value: 50 },
  ];

  return (
    <div className="bg-[#F8F9FB] min-h-screen p-10 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#0A1E32] tracking-tighter">Proventos</h1>
        <p className="text-slate-400 font-medium">Acompanhe dividendos, JCP e rendimentos de FIIs em tempo real</p>
      </div>

      {/* Demo Mode Alert */}
      <div className="bg-[#FEF9E7] border border-amber-100 p-6 rounded-2xl flex items-start space-x-4 mb-10">
        <i className="fas fa-exclamation-triangle text-amber-600 mt-1"></i>
        <div>
           <p className="text-sm font-black text-amber-800 uppercase tracking-tight">Modo Demonstração Ativo</p>
           <p className="text-xs text-amber-700 font-medium mt-1">Os dados exibidos são exemplos para demonstração. O plano atual não inclui acesso aos dados reais de proventos.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#12304d] p-8 rounded-[2rem] text-white flex flex-col justify-between min-h-[160px] shadow-xl">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Recebidos (12m)</p>
              <i className="fas fa-dollar-sign text-slate-400"></i>
           </div>
           <div>
              <p className="text-3xl font-black">R$ 21,06</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">59 eventos</p>
           </div>
        </div>
        {['Média Mensal', 'Maior Pagador', 'Próximos Pagamentos'].map((label, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-between min-h-[160px] shadow-sm">
             <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <i className={`fas ${i === 0 ? 'fa-chart-line text-emerald-500' : i === 1 ? 'fa-trophy text-amber-500' : 'fa-calendar text-amber-500'}`}></i>
             </div>
             <div>
                <p className="text-3xl font-black text-slate-800">{i === 0 ? 'R$ 1,76' : i === 1 ? 'KNRI11' : 'Em breve'}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">{i === 0 ? 'Últimos 12 meses' : i === 1 ? 'R$ 7,05' : 'Funcionalidade futura'}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Distribution Chart */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 mb-10 shadow-sm">
        <h3 className="text-xl font-black text-[#0A1E32] mb-10">Distribuição Mensal</h3>
        <div className="h-[250px] flex items-end justify-between space-x-4">
           {monthlyData.map((d, i) => (
             <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-[#C4953D] rounded-t-lg transition-all hover:bg-[#B38535]" style={{ height: `${d.value}%` }}></div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-4 rotate-0 text-center">{d.month}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Detailed History */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
           <h3 className="text-xl font-black text-[#0A1E32]">Histórico Detalhado</h3>
           <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {['Todos', 'Dividendo', 'Rend. FII'].map(filter => (
                <button key={filter} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl ${filter === 'Todos' ? 'bg-[#0A1E32] text-white' : 'text-slate-400'}`}>
                  {filter}
                </button>
              ))}
           </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Ex</th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticker</th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor por Cota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {proventosHistory.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="px-4 py-5 text-sm font-medium text-slate-500">{item.date}</td>
                <td className="px-4 py-5 text-sm font-black text-[#0A1E32]">{item.ticker}</td>
                <td className="px-4 py-5 text-sm font-medium text-slate-500">{item.name}</td>
                <td className="px-4 py-5">
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${item.type === 'Dividendo' ? 'bg-[#0A1E32] text-white' : 'bg-emerald-600 text-white'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-5 text-sm font-black text-emerald-600 text-right">R$ {item.value.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProventosView;
