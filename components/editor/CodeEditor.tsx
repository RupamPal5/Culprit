'use client';
import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useFileStore } from '@/lib/store/useFileStore';
import { cn } from '@/lib/utils/cn';

export function CodeEditor() {
  const { files, activeFileId, updateFile } = useFileStore();
  const [mounted, setMounted] = useState(false);
  const activeFile = files.find(f => f.id === activeFileId);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !activeFile) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Select a file to edit</div>;
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={activeFile.language}
        value={activeFile.content}
        theme="vs-dark"
        onChange={(val) => val && updateFile(activeFile.id, val)}
        options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
      />
    </div>
  );
}
