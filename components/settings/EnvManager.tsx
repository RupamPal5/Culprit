'use client';

import { useState, useEffect } from 'react';
import { useFileStore } from '@/lib/store/useFileStore';

interface EnvVar {
  key: string;
  value: string;
  isLocked: boolean;
}

export default function EnvManager({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [envVars, setEnvVars] = useState<EnvVar[]>([
    { key: 'DATABASE_URL', value: 'file:./dev.db', isLocked: false },
    { key: 'OPENAI_API_KEY', value: '', isLocked: true },
  ]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const getFileByPath = useFileStore((state) => state.getFileByPath);
  const addFile = useFileStore((state) => state.addFile);
  const updateFile = useFileStore((state) => state.updateFile);

  // Load .env.local content on mount
  useEffect(() => {
    const envFile = getFileByPath('.env.local');
    if (envFile?.content) {
      const lines = envFile.content.split('\n');
      const parsed = lines
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => {
          const [key, ...valueParts] = line.split('=');
          return {
            key: key.trim(),
            value: valueParts.join('=').replace(/["']/g, '').trim(),
            isLocked: ['API_KEY', 'SECRET', 'PASSWORD'].some(k => key.toUpperCase().includes(k))
          };
        });
      if (parsed.length > 0) {
        setEnvVars(parsed);
      }
    }
  }, [getFileByPath]);

  const saveEnvVars = () => {
    const content = '# Environment Variables\n' + 
      envVars.map(v => `${v.key}="${v.value}"`).join('\n') + '\n';
    
    const existingFile = getFileByPath('.env.local');
    if (existingFile) {
      updateFile(existingFile.id, content);
    } else {
      addFile({
        path: '.env.local',
        name: '.env.local',
        content,
        language: 'plaintext',
      });
    }
    
    onClose();
  };

  const addEnvVar = () => {
    if (newKey && !envVars.find(v => v.key === newKey)) {
      setEnvVars([...envVars, { 
        key: newKey, 
        value: newValue, 
        isLocked: ['API_KEY', 'SECRET', 'PASSWORD'].some(k => newKey.toUpperCase().includes(k))
      }]);
      setNewKey('');
      setNewValue('');
    }
  };

  const deleteEnvVar = (key: string) => {
    setEnvVars(envVars.filter(v => v.key !== key));
  };

  const toggleLock = (key: string) => {
    setEnvVars(envVars.map(v => 
      v.key === key ? { ...v, isLocked: !v.isLocked } : v
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Environment Variables</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
          {envVars.map((envVar) => (
            <div key={envVar.key} className="flex items-center gap-2 bg-slate-800 p-2 rounded">
              <input
                type="text"
                value={envVar.key}
                disabled
                className="flex-1 bg-transparent text-slate-300 font-mono text-sm focus:outline-none"
              />
              <input
                type={envVar.isLocked ? 'password' : 'text'}
                value={envVar.value}
                onChange={(e) => setEnvVars(envVars.map(v => 
                  v.key === envVar.key ? { ...v, value: e.target.value } : v
                ))}
                className="flex-1 bg-slate-700 text-white font-mono text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Value"
              />
              <button
                onClick={() => toggleLock(envVar.key)}
                className="text-slate-400 hover:text-yellow-400 transition-colors"
                title={envVar.isLocked ? 'Unlock' : 'Lock'}
              >
                {envVar.isLocked ? '🔒' : '🔓'}
              </button>
              <button
                onClick={() => deleteEnvVar(envVar.key)}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="KEY_NAME"
            className="flex-1 bg-slate-800 text-white font-mono text-sm px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            className="flex-1 bg-slate-800 text-white font-mono text-sm px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={addEnvVar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Add
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveEnvVars}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
          >
            Save & Restart
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          💡 Changes will update .env.local and trigger a WebContainer restart with new variables.
        </p>
      </div>
    </div>
  );
}
