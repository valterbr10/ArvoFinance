
import React, { useState, useRef } from 'react';
import { Operation } from '../types';
import { parseBrokerageNote, parseCSVFile } from '../services/parser';

const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ops: Omit<Operation, 'id'>[]) => void;
}

const ImportModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'review'>('upload');
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewOps, setPreviewOps] = useState<Omit<Operation, 'id'>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const { getDocument, GlobalWorkerOptions } = await import(PDFJS_URL);
      GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
      }
      return fullText;
    } catch (err) {
      throw new Error("Erro ao ler o PDF.");
    }
  };

  const handleFile = async (file: File) => {
    const isPDF = file.name.toLowerCase().endsWith('.pdf');
    const isCSV = file.name.toLowerCase().endsWith('.csv');

    if (!isPDF && !isCSV) {
      setError("Formato não suportado. Use PDF ou CSV.");
      return;
    }

    setFileName(file.name);
    setStep('processing');
    setError(null);

    try {
      let ops: Omit<Operation, 'id'>[] = [];
      
      if (isPDF) {
        const text = await extractTextFromPDF(file);
        const result = await parseBrokerageNote(text);
        ops = result.operations;
      } else {
        const text = await file.text();
        ops = await parseCSVFile(text);
      }

      setPreviewOps(ops);
      setStep('review');
    } catch (err: any) {
      setError(err.message || "Falha ao processar arquivo.");
      setStep('upload');
      setFileName(null);
    }
  };

  const resetState = () => {
    setStep('upload');
    setRawText('');
    setFileName(null);
    setPreviewOps([]);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1E32]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0A1E32] p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Importar Dados</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">PDF, CSV ou Sincronização B3</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-10">
          {step === 'upload' && (
            <div className="space-y-8">
              <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} accept=".pdf,.csv" className="hidden" />
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
                className={`border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all cursor-pointer bg-slate-50/50 ${
                  isDragging ? 'border-[#C4953D] bg-amber-50/50' : 'border-slate-100 hover:border-[#C4953D]/30'
                }`}
              >
                <div className="flex justify-center space-x-4 mb-6">
                  <i className="fas fa-file-pdf text-4xl text-slate-200"></i>
                  <i className="fas fa-file-csv text-4xl text-slate-200"></i>
                </div>
                <h4 className="text-lg font-black text-slate-800">Arraste seus arquivos ou clique aqui</h4>
                <p className="text-xs text-slate-400 font-medium mt-2">Notas em PDF ou planilhas CSV do Portal B3.</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-start space-x-4">
                 <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Dica B3</p>
                    <p className="text-[11px] text-blue-600 font-medium mt-1">
                      Você pode baixar suas movimentações no <b>Portal do Investidor B3</b> em formato CSV e importar diretamente aqui. O Arvo reconhece o formato automaticamente.
                    </p>
                 </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <span className="bg-white px-4">Entrada Manual</span>
                </div>
              </div>

              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Cole o texto da sua nota aqui..."
                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono focus:ring-2 focus:ring-[#C4953D] outline-none"
              />

              {error && <div className="bg-red-50 p-4 rounded-xl text-red-500 text-[10px] font-black uppercase border border-red-100"><i className="fas fa-exclamation-triangle mr-2"></i>{error}</div>}

              {rawText.trim() && (
                <button onClick={() => parseBrokerageNote(rawText).then(r => {setPreviewOps(r.operations); setStep('review');})} className="w-full bg-[#0A1E32] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#12304d] transition-all">Analisar Texto</button>
              )}
            </div>
          )}

          {step === 'processing' && (
            <div className="py-20 text-center space-y-8 animate-pulse">
               <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 border-4 border-[#C4953D]/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#C4953D] border-t-transparent rounded-full animate-spin"></div>
                  <i className="fas fa-robot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-[#0A1E32]"></i>
               </div>
               <h4 className="text-xl font-black text-[#0A1E32]">Processando {fileName}...</h4>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-lg font-black text-slate-800">Revisão de Dados</h4>
                 <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase">{previewOps.length} Operações</span>
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-left border-b border-slate-100">
                       <th className="py-3 text-[9px] font-black text-slate-400 uppercase">Data</th>
                       <th className="py-3 text-[9px] font-black text-slate-400 uppercase">Ticker</th>
                       <th className="py-3 text-[9px] font-black text-slate-400 uppercase">Tipo</th>
                       <th className="py-3 text-right text-[9px] font-black text-slate-400 uppercase">Qtd</th>
                       <th className="py-3 text-right text-[9px] font-black text-slate-400 uppercase">Preço</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {previewOps.map((op, i) => (
                      <tr key={i}>
                        <td className="py-4 text-[10px] font-bold text-slate-400">{op.date}</td>
                        <td className="py-4 text-xs font-black text-blue-600">{op.ticker}</td>
                        <td className="py-4 text-[10px] font-black uppercase text-slate-500">{op.type}</td>
                        <td className="py-4 text-xs font-black text-slate-800 text-right">{op.quantity}</td>
                        <td className="py-4 text-xs font-black text-slate-800 text-right">R$ {op.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={resetState} className="py-5 border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50">Recomeçar</button>
                <button onClick={() => { onSave(previewOps); onClose(); resetState(); }} className="py-5 bg-[#C4953D] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#B38535] shadow-xl shadow-amber-900/10">Confirmar Importação</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
