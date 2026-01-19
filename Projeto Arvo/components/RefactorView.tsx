
import React, { useState } from 'react';
import { refactorCode } from '../services/gemini';

const RefactorView: React.FC = () => {
  const [inputCode, setInputCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefactor = async () => {
    if (!inputCode.trim()) return;
    setIsLoading(true);
    try {
      const result = await refactorCode(inputCode);
      setOutput(result);
    } catch (err) {
      setOutput("Error: Failed to refactor code. " + (err instanceof Error ? err.message : ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputCode('');
    setOutput(null);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Smart Code Refactor</h2>
        <p className="text-gray-400">Paste your code below. Gemini Pro will analyze it for performance, readability, and modern best practices.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[70vh]">
        {/* Input Pane */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-[#21262d] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Source Code</span>
              <button 
                onClick={handleClear}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              className="flex-1 w-full bg-transparent p-6 font-mono text-sm text-blue-100 focus:outline-none resize-none"
              placeholder="// Paste your code here..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          </div>
          <button
            onClick={handleRefactor}
            disabled={isLoading || !inputCode.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-blue-600/20"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Reasoning...</span>
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i>
                <span>Optimize with Gemini Pro</span>
              </>
            )}
          </button>
        </div>

        {/* Output Pane */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden flex flex-col">
          <div className="bg-[#21262d] px-4 py-2 border-b border-[#30363d] flex items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Feedback & Refactored Code</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-[#0d1117]">
            {output ? (
              <div className="prose prose-invert max-w-none text-gray-300">
                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-sm">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <i className="fas fa-microchip text-5xl"></i>
                <p>Waiting for code to process...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefactorView;
