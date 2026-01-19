
import React from 'react';
import { AssetPosition } from '../types';

interface Props {
  positions: AssetPosition[];
}

const CarteiraView: React.FC<Props> = ({ positions }) => {
  const totalInvested = positions.reduce((acc, p) => acc + p.totalInvested, 0);
  const totalCurrent = positions.reduce((acc, p) => acc + p.totalCurrent, 0);
  const totalPL = totalCurrent - totalInvested;
  const plPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  const groupedPositions = {
    'Ações': positions.filter(p => p.type === 'Ações'),
    'Fundos Imobiliários': positions.filter(p => p.type === 'Fundos Imobiliários'),
  };

  const renderTable = (title: string, assets: AssetPosition[]) => {
    if (assets.length === 0) return null;
    
    const subTotalInvested = assets.reduce((acc, p) => acc + p.totalInvested, 0);
    const subTotalCurrent = assets.reduce((acc, p) => acc + p.totalCurrent, 0);
    const subPL = subTotalCurrent - subTotalInvested;
    const subPLPercent = subTotalInvested > 0 ? (subPL / subTotalInvested) * 100 : 0;

    return (
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center space-x-4">
             <i className={`fas ${title === 'Ações' ? 'fa-chart-line text-blue-500' : 'fa-building text-amber-500'} text-xl`}></i>
             <h3 className="text-xl font-black text-[#0A1E32]">{title} <span className="ml-3 bg-amber-500 text-white text-[10px] px-2 py-1 rounded-lg uppercase">{assets.length} ativos</span></h3>
          </div>
          <div className="flex space-x-12">
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Investido</p>
                <p className="text-sm font-black text-slate-700">R$ {subTotalInvested.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor Atual</p>
                <p className="text-sm font-black text-slate-700">R$ {subTotalCurrent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">P/L (R$)</p>
                <p className={`text-sm font-black ${subPL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {subPL >= 0 ? '+' : ''}R$ {subPL.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">P/L (%)</p>
                <p className={`text-sm font-black ${subPLPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {subPLPercent >= 0 ? '+' : ''}{subPLPercent.toFixed(2)}%
                </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white text-left">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticker</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa/Fundo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qtde</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">PM (R$)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Preço (R$)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor (R$)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">P/L (R$)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">P/L (%)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Part. (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {assets.map((asset, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm font-black text-blue-600">{asset.ticker}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{asset.name || asset.ticker}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-700 text-center">{asset.quantity}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-700 text-right">R$ {asset.averagePrice.toFixed(2)}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-700 text-right">R$ {asset.currentPrice.toFixed(2)}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900 text-right">R$ {asset.totalCurrent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td className={`px-8 py-5 text-sm font-black text-right ${asset.plAmount >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {asset.plAmount >= 0 ? '+' : ''}R$ {asset.plAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                  <td className={`px-8 py-5 text-sm font-black text-right ${asset.plPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {asset.plPercent >= 0 ? '+' : ''}{asset.plPercent.toFixed(2)}%
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-500 text-right">{( (asset.totalCurrent / totalCurrent) * 100 ).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#F8F9FB] min-h-screen p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#0A1E32] tracking-tighter">Carteira de Investimentos</h1>
        <p className="text-slate-400 font-medium">Posições atuais, alocação e desempenho</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {[
            { label: 'Valor Investido', value: `R$ ${totalInvested.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, icon: 'fa-wallet', color: 'blue' },
            { label: 'Valor Atual', value: `R$ ${totalCurrent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, icon: 'fa-chart-pie', color: 'emerald' },
            { label: 'P/L (R$)', value: `${totalPL >= 0 ? '+' : ''}R$ ${totalPL.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, icon: 'fa-chart-line', color: totalPL >= 0 ? 'emerald' : 'red' },
            { label: 'P/L (%)', value: `${plPercent >= 0 ? '+' : ''}${plPercent.toFixed(2)}%`, icon: 'fa-percentage', color: plPercent >= 0 ? 'emerald' : 'red' },
            { label: 'Dividendos (mês)', value: 'R$ 0,00', icon: 'fa-dollar-sign', color: 'purple' },
            { label: 'Exposição Cambial', value: '0,00%', icon: 'fa-globe', color: 'amber' },
        ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className={`w-10 h-10 bg-${kpi.color}-50 rounded-xl flex items-center justify-center`}>
                    <i className={`fas ${kpi.icon} text-${kpi.color}-500 text-sm`}></i>
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                    <p className="text-sm font-black text-slate-800">{kpi.value}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8 flex space-x-8">
          <div className="flex-1">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Agrupamento</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                  <option>Por Classe</option>
              </select>
          </div>
          <div className="flex-[2]">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Buscar</label>
              <div className="relative">
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                  <input type="text" placeholder="Buscar por ticker ou nome..." className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold outline-none" />
              </div>
          </div>
          <div className="flex items-end">
              <button className="px-6 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50">
                <i className="fas fa-sync-alt mr-2"></i> Recalcular posições
              </button>
          </div>
      </div>

      {renderTable('Ações', groupedPositions['Ações'])}
      {renderTable('Fundos Imobiliários', groupedPositions['Fundos Imobiliários'])}
    </div>
  );
};

export default CarteiraView;
