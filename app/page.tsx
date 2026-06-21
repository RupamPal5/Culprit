'use client';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { FileExplorer } from '@/components/explorer/FileExplorer';
import { CodeEditor } from '@/components/editor/CodeEditor';
import Terminal from '@/components/terminal/Terminal';
import Header from '@/components/layout/Header';
import { useUIStore } from '@/lib/store/useUIStore';
import { useState } from 'react';

export default function Home() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />
      <FileExplorer />
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 p-4 overflow-auto">
          <CodeEditor />
        </div>
        <div className="h-48">
          <Terminal logs={terminalLogs} />
        </div>
      </main>
    </div>
  );
}
