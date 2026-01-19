
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GitHubFile } from '../types';
import { getFinancialAdvice } from '../services/gemini';
import { fetchFileContent } from '../services/github';

interface ChatViewProps {
  projectFiles: GitHubFile[];
  readme: string;
  projectName: string;
  fullName: string;
}

const ChatView: React.FC<ChatViewProps> = ({ projectFiles, readme, projectName, fullName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const contextBase = `
    Arquivos do projeto: ${projectFiles.map(f => f.path).join(', ')}
    README: ${readme.substring(0, 1000)}
  `;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const finalInput = customInput || input;
    if (!finalInput.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: finalInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Logic to see if user is asking about a specific file
      let extraContext = "";
      const mentionedFile = projectFiles.find(f => finalInput.toLowerCase().includes(f.path.toLowerCase()));
      if (mentionedFile && mentionedFile.type === 'blob') {
        const content = await fetchFileContent(fullName, mentionedFile.path);
        extraContext = `\nCONTEÚDO DO ARQUIVO ${mentionedFile.path}:\n${content.substring(0, 5000)}`;
      }

      const response = await getFinancialAdvice(finalInput, projectName, contextBase + extraContext);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Desculpe, tive um problema ao processar seu pedido.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Erro ao conectar com a inteligência do Arvo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-slate-800/40 border border-slate-700 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="bg-slate-800/80 p-6 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <i className="fas fa-robot text-xl text-slate-900"></i>
            </div>
            <div>
                <h3 className="font-extrabold text-white text-lg">Mentor Arvo IA</h3>
                <span className="text-[10px] text-emerald-400 flex items-center font-bold tracking-widest uppercase">
                    Analisando {projectFiles.length} arquivos do GitHub
                </span>
            </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-12">
            <i className="fab fa-github text-6xl mb-6 text-emerald-500"></i>
            <p className="text-xl font-medium">Projeto Importado!</p>
            <p className="text-sm text-slate-400 mt-2">Como eu já conheço a estrutura do seu código, você pode me perguntar coisas específicas. Se você citar o nome de um arquivo, eu vou ler o conteúdo dele agora mesmo.</p>
            <div className="mt-8 grid grid-cols-1 gap-3 w-full">
                <button onClick={(e) => handleSend(e as any, "Pode me dar um resumo do que o projeto Arvo faz baseado nos arquivos?")} className="p-4 bg-slate-700/50 rounded-2xl text-xs hover:bg-slate-700 border border-slate-600 text-left">
                  <i className="fas fa-file-alt mr-2"></i> O que o projeto faz no total?
                </button>
                <button onClick={(e) => handleSend(e as any, "Quais são as principais regras de IR implementadas no código?")} className="p-4 bg-slate-700/50 rounded-2xl text-xs hover:bg-slate-700 border border-slate-600 text-left">
                  <i className="fas fa-calculator mr-2"></i> Quais as regras de IR no código?
                </button>
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl ${
              m.role === 'user' 
                ? 'bg-emerald-500 text-slate-900 font-semibold rounded-tr-none' 
                : 'bg-slate-700 text-slate-100 border border-slate-600 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 p-5 rounded-3xl rounded-tl-none border border-slate-600">
               <div className="flex space-x-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-6 bg-slate-900 border-t border-slate-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Explique o que tem no arquivo 'package.json'"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-emerald-500/20"
          >
            <i className="fas fa-paper-plane text-slate-900 text-lg"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
