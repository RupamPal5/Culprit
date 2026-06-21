'use client';

import { useState } from 'react';
import EnvManager from '../settings/EnvManager';

export default function Header() {
  const [isEnvOpen, setIsEnvOpen] = useState(false);

  return (
    <header className="h-12 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">AI Code Editor</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsEnvOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Manage Environment Variables"
        >
          ⚙️ Env Vars
        </button>
        <button className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors">
          🌙 Dark
        </button>
      </div>

      <EnvManager isOpen={isEnvOpen} onClose={() => setIsEnvOpen(false)} />
    </header>
  );
}
