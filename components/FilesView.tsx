
import React from 'react';
import { GitHubFile } from '../types';

interface FilesViewProps {
  files: GitHubFile[];
  onFileClick: (path: string) => void;
}

const FilesView: React.FC<FilesViewProps> = ({ files, onFileClick }) => {
  // Sort files: directories first, then alphabetical
  const sortedFiles = [...files].sort((a, b) => {
    if (a.type === b.type) return a.path.localeCompare(b.path);
    return a.type === 'tree' ? -1 : 1;
  });

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white">Estrutura do Projeto</h2>
        <p className="text-slate-400">Estes são os arquivos que importamos do seu repositório.</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-[2rem] overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-slate-700">
          {sortedFiles.map((file) => (
            <div 
              key={file.path}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-700/40 transition-colors group cursor-pointer"
              onClick={() => file.type === 'blob' && onFileClick(file.path)}
            >
              <div className="flex items-center space-x-4">
                <i className={`fas ${file.type === 'tree' ? 'fa-folder text-amber-400' : 'fa-file-code text-emerald-400'} text-lg`}></i>
                <span className={`text-sm ${file.type === 'tree' ? 'font-bold text-slate-200' : 'text-slate-300'}`}>
                  {file.path}
                </span>
              </div>
              {file.type === 'blob' && (
                <button className="opacity-0 group-hover:opacity-100 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/20 transition-all">
                  Analisar Código
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilesView;
