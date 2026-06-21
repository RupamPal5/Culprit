'use client';

import { useState } from 'react';

interface TerminalProps {
  logs: string[];
}

export default function Terminal({ logs }: TerminalProps) {
  const [internalLogs, setInternalLogs] = useState<string[]>([
    '[INFO] WebContainer initialized',
    '[INFO] Ready for backend execution',
  ]);

  const allLogs = [...internalLogs, ...logs];

  const clearTerminal = () => {
    setInternalLogs(['[INFO] Terminal cleared']);
  };

  return (
    <div className="h-full bg-slate-950 border-t border-slate-700 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-slate-400">⌨️ Terminal</span>
          <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded">Ready</span>
        </div>
        <button
          onClick={clearTerminal}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          🗑️ Clear
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
        {allLogs.map((log, index) => {
          const isError = log.includes('ERROR') || log.includes('Error');
          const isWarning = log.includes('WARN') || log.includes('Warning');
          const isBackend = log.includes('[API]') || log.includes('[Server]') || log.includes('[Prisma]');
          const isFrontend = log.includes('[Build]') || log.includes('[Client]');
          
          return (
            <div
              key={index}
              className={`${
                isError ? 'text-red-400' :
                isWarning ? 'text-yellow-400' :
                isBackend ? 'text-blue-300' :
                isFrontend ? 'text-purple-300' :
                'text-slate-300'
              }`}
            >
              <span className="text-slate-600 mr-2">{new Date().toLocaleTimeString()}</span>
              {log}
            </div>
          );
        })}
        
        {allLogs.length === 0 && (
          <div className="text-slate-600 italic">No logs yet. Start the dev server to see output.</div>
        )}
      </div>
    </div>
  );
}
