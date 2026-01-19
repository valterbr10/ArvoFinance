
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Operation, AssetPosition, User } from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import ProfessionalLandingView from './components/ProfessionalLandingView';
import DashboardView from './components/DashboardView';
import CarteiraView from './components/CarteiraView';
import OperacoesView from './components/OperacoesView';
import ProventosView from './components/ProventosView';
import TesouroDiretoView from './components/TesouroDiretoView';
import AlertasView from './components/AlertasView';
import RentabilidadeView from './components/RentabilidadeView';
import RelatoriosIRView from './components/RelatoriosIRView';
import SecurityView from './components/SecurityView';
import AuthView from './components/AuthView';
import WelcomeView from './components/WelcomeView';
import NewOperationModal from './components/NewOperationModal';
import ImportModal from './components/ImportModal';
import ConnectionGuideModal from './components/ConnectionGuideModal';
import { calculatePositions, fetchMarketQuotes } from './services/finance';
import { authService } from './services/auth';
import { databaseService } from './services/database';
import { exportProject } from './services/export';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [quotes, setQuotes] = useState<Record<string, number>>({});
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((updatedUser) => {
      setUser(updatedUser);
      if (updatedUser && appState === AppState.LANDING) {
        setAppState(AppState.DASHBOARD);
      }
    });
    return () => unsubscribe();
  }, [appState]);

  useEffect(() => {
    if (user) {
      setIsDataLoading(true);
      databaseService.fetchOperations(user.id)
        .then(ops => setOperations(ops))
        .finally(() => setIsDataLoading(false));
    }
  }, [user]);

  const updateAllQuotes = async () => {
    const tickers: string[] = Array.from(new Set(operations.map(o => o.ticker)));
    if (tickers.length === 0) return;
    setIsLoadingQuotes(true);
    const newQuotes = await fetchMarketQuotes(tickers);
    const quoteMap: Record<string, number> = {};
    newQuotes.forEach(q => { if (q && q.ticker) quoteMap[q.ticker] = q.price; });
    setQuotes(prev => ({ ...prev, ...quoteMap }));
    setIsLoadingQuotes(false);
  };

  const handleSaveOperation = async (opData: Omit<Operation, 'id'>) => {
    if (!user) return;
    try {
      const newOp: Operation = { ...opData, id: crypto.randomUUID() };
      await databaseService.saveOperation(user.id, newOp);
      const updatedOps = await databaseService.fetchOperations(user.id);
      setOperations(updatedOps);
    } catch (err) { console.error(err); }
  };

  const handleSaveBulkOperations = async (newOpsData: Omit<Operation, 'id'>[]) => {
    if (!user) return;
    try {
      const opsWithIds: Operation[] = newOpsData.map(op => ({ ...op, id: crypto.randomUUID() }));
      await databaseService.saveBulkOperations(user.id, opsWithIds);
      const updatedOps = await databaseService.fetchOperations(user.id);
      setOperations(updatedOps);
    } catch (err) { console.error(err); }
  };

  const handleDeleteOperation = async (opId: string) => {
    if (!user) return;
    try {
      await databaseService.deleteOperation(user.id, opId);
      setOperations(prev => prev.filter(op => op.id !== opId));
    } catch (err) { console.error(err); }
  };

  const positions: AssetPosition[] = useMemo(() => {
    const basicPositions = calculatePositions(operations);
    return basicPositions.map(pos => {
      const currentPrice = quotes[pos.ticker] || pos.averagePrice;
      const totalInvested = pos.quantity * pos.averagePrice;
      const totalCurrent = pos.quantity * currentPrice;
      return {
        ...pos,
        name: pos.ticker, 
        sector: pos.type === 'Fundos Imobiliários' ? 'Imobiliário' : 'Diversos',
        currentPrice,
        totalInvested,
        totalCurrent,
        plAmount: totalCurrent - totalInvested,
        plPercent: totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0
      };
    });
  }, [operations, quotes]);

  const handleExport = async () => {
    // Definimos os arquivos vitais que queremos que acompanhem o backup de dados
    const codeFiles: Record<string, string> = {
      "package.json": "{\"name\":\"arvo-financeira\",\"version\":\"1.0.0\"}",
      "data/info.txt": "Backup de dados Arvo Intelligence"
    };
    
    // Exportamos o código base + as operações reais do usuário
    await exportProject(codeFiles, operations);
  };

  const isPublicView = [AppState.LANDING, AppState.PROFESSIONAL].includes(appState);
  
  if (!user && appState === AppState.DASHBOARD) {
    return <AuthView onLoginSuccess={(u) => { setUser(u); setAppState(AppState.DASHBOARD); }} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${isPublicView ? 'bg-white' : 'bg-[#F8F9FB]'}`}>
      {isPublicView && <Navbar onNavigate={setAppState} activeView={appState} />}
      {!isPublicView && <Sidebar activeView={appState} onNavigate={setAppState} onExport={handleExport} onOpenHelp={() => setIsHelpModalOpen(true)} />}

      <main className={`flex-1 overflow-y-auto flex flex-col ${!isPublicView && 'bg-[#F8F9FB]'}`}>
        
        {!isPublicView && (
          <div className="bg-[#0A1E32] px-10 py-3 flex items-center justify-between">
             <div className="flex items-center space-x-4">
                <i className="fab fa-github text-white text-lg"></i>
                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">
                  Problemas ao conectar? Clique no ícone de <i className="fas fa-sliders-h text-blue-400 mx-1"></i> (Ajustes) ou <i className="fas fa-lock text-blue-400 mx-1"></i> (Cadeado) ao lado da URL.
                </p>
             </div>
             <button onClick={() => setIsHelpModalOpen(true)} className="text-[9px] font-black text-[#C4953D] uppercase border-b border-[#C4953D]/30 hover:text-white transition-colors">Ver tutorial completo</button>
          </div>
        )}

        {!isPublicView && (
          <header className="bg-white border-b border-slate-100 px-10 py-5 flex items-center justify-end space-x-6 sticky top-0 z-50">
             <button onClick={() => setIsImportModalOpen(true)} className="bg-white border border-slate-200 hover:bg-slate-50 text-[#0A1E32] px-6 py-3 rounded-xl text-xs font-black uppercase flex items-center transition-all">
                <i className="fas fa-file-import mr-3 text-[#C4953D]"></i> Importar Nota
             </button>
             <button onClick={() => setIsModalOpen(true)} className="bg-[#0A1E32] hover:bg-[#12304d] text-white px-6 py-3 rounded-xl text-xs font-black uppercase flex items-center shadow-xl shadow-slate-900/10 transition-all active:scale-95">
                <i className="fas fa-plus mr-3 text-emerald-400"></i> Nova Operação
             </button>
             <div className="flex items-center space-x-4 cursor-pointer" onClick={() => authService.logout()}>
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.tier || 'Investidor'}</p>
                  <p className="text-sm font-black text-[#0A1E32]">{user?.name || 'Visitante'}</p>
                </div>
                <div className="w-11 h-11 bg-[#C4953D] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner">
                  {user?.name?.[0].toUpperCase() || '?'}
                </div>
             </div>
          </header>
        )}

        <div className="flex-1">
            {isDataLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-[#0A1E32] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sincronizando dados...</p>
              </div>
            ) : (
              <>
                {appState === AppState.LANDING && (
                  <div className="flex flex-col">
                    <LandingView onNavigate={setAppState} />
                    <div className="bg-[#F8F9FB] py-20">
                       <WelcomeView 
                         onConnect={(url) => alert("Importação de repositório: " + url)} 
                         onDemo={() => setAppState(AppState.DASHBOARD)} 
                         isLoading={false} 
                         error={null} 
                       />
                    </div>
                  </div>
                )}
                {appState === AppState.PROFESSIONAL && <ProfessionalLandingView />}
                {appState === AppState.DASHBOARD && <DashboardView positions={positions} operations={operations} onRefresh={updateAllQuotes} />}
                {appState === AppState.CARTEIRA && <CarteiraView positions={positions} />}
                {appState === AppState.OPERACOES && <OperacoesView operations={operations} onDelete={handleDeleteOperation} onImport={() => setIsImportModalOpen(true)} />}
                {appState === AppState.PROVENTOS && <ProventosView />}
                {appState === AppState.TESOURO && <TesouroDiretoView positions={positions} />}
                {appState === AppState.RENTABILIDADE && <RentabilidadeView operations={operations} positions={positions} />}
                {appState === AppState.RELATORIOS_IR && <RelatoriosIRView operations={operations} positions={positions} />}
                {appState === AppState.ALERTAS && <AlertasView />}
                {appState === AppState.SEGURANCA && <SecurityView />}
              </>
            )}
        </div>
      </main>

      <NewOperationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveOperation} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onSave={handleSaveBulkOperations} />
      <ConnectionGuideModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};

export default App;
