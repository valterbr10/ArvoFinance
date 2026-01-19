
import React from 'react';

const SecurityView: React.FC = () => {
  const securityFeatures = [
    {
      title: 'Criptografia de Ponta a Ponta',
      desc: 'Seus dados de investimento são criptografados usando AES-256 antes de serem gravados no disco.',
      icon: 'fa-lock',
      status: 'Ativo'
    },
    {
      title: 'Row-Level Security (RLS)',
      desc: 'Garantia de que apenas você pode ler ou escrever em seus próprios dados diretamente no nível do banco de dados.',
      icon: 'fa-user-shield',
      status: 'Ativo'
    },
    {
      title: 'Conformidade LGPD',
      desc: 'Estamos em total conformidade com a Lei Geral de Proteção de Dados, garantindo sua privacidade.',
      icon: 'fa-gavel',
      status: 'Auditado'
    },
    {
      title: 'Backup Georeplicado',
      desc: 'Seus dados são replicados em 3 zonas de disponibilidade diferentes para evitar perda de informação.',
      icon: 'fa-server',
      status: 'Ativo'
    }
  ];

  return (
    <div className="bg-[#F8F9FB] min-h-screen p-10 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
           <h1 className="text-4xl font-black text-[#0A1E32] tracking-tighter">Centro de Segurança</h1>
           <p className="text-slate-400 font-medium">Arquitetura de proteção Arvo Wealth Intelligence</p>
        </div>

        <div className="bg-[#0A1E32] p-10 rounded-[3rem] text-white shadow-2xl mb-12 relative overflow-hidden">
           <div className="absolute right-[-5%] top-[-10%] opacity-10">
              <i className="fas fa-shield-halved text-[15rem]"></i>
           </div>
           <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-900">
                    <i className="fas fa-check-shield text-xl"></i>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Proteção Ativa</span>
              </div>
              <h2 className="text-3xl font-black mb-4">Seus dados são propriedade sua.</h2>
              <p className="text-slate-400 leading-relaxed max-w-xl">
                 A Arvo utiliza uma infraestrutura de banco de dados isolada por usuário. Nem mesmo nossos administradores podem acessar os detalhes das suas operações sem sua autorização explícita.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {securityFeatures.map((f, i) => (
             <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0A1E32]">
                      <i className={`fas ${f.icon} text-xl`}></i>
                   </div>
                   <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1 rounded-lg uppercase">{f.status}</span>
                </div>
                <h3 className="text-lg font-black text-[#0A1E32] mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
             </div>
           ))}
        </div>

        <div className="mt-12 p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem] flex items-center space-x-6">
           <i className="fas fa-fingerprint text-3xl text-blue-500"></i>
           <div>
              <h4 className="text-sm font-black text-blue-900 uppercase">Token de Autenticação</h4>
              <p className="text-xs text-blue-700 mt-1 font-medium">Sua sessão é protegida por JWT (JSON Web Tokens) com expiração curta e rotação de chaves.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityView;
