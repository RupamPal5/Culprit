'use client';
import { useFileStore } from '@/lib/store/useFileStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils/cn';
import { File as FileIcon } from 'lucide-react';

export function FileExplorer() {
  const { files, activeFileId, openFile, setActiveFile } = useFileStore();
  const { sidebarOpen } = useUIStore();

  if (!sidebarOpen) return null;

  return (
    <div className="w-64 border-r bg-card h-full flex flex-col">
      <div className="p-3 border-b font-semibold text-sm">Explorer</div>
      <ScrollArea className="flex-1 p-2">
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-accent",
              activeFileId === file.id && "bg-accent"
            )}
            onClick={() => { openFile(file.id); setActiveFile(file.id); }}
          >
            <FileIcon className="w-4 h-4" />
            <span>{file.name}</span>
            {file.isDirty && <span className="ml-auto text-xs text-muted-foreground">●</span>}
          </div>
        ))}
        {files.length === 0 && (
          <div className="text-xs text-muted-foreground p-2">No files yet. Ask AI to create some!</div>
        )}
      </ScrollArea>
    </div>
  );
}
