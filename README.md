═══════════════════════════════════════════════════════════════════════════
                    AI-POWERED CODE EDITOR PLATFORM
                    Complete Development Specification
═══════════════════════════════════════════════════════════════════════════

OBJECTIVE:
Build a production-ready, browser-based integrated development environment 
(IDE) with AI code generation capabilities similar to Bolt.new, Cursor, and 
Replit. The platform must enable users to generate, edit, and preview 
full-stack applications through natural language conversations with an AI 
assistant, with real-time code synchronization and live preview.

═══════════════════════════════════════════════════════════════════════════
                           TECHNICAL ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════

CORE TECHNOLOGY STACK:
─────────────────────
1. Framework: Next.js 14.2+ (App Router, Server Components)
2. Language: TypeScript 5.4+ (strict mode enabled)
3. Styling: Tailwind CSS 3.4+ with CSS Variables
4. Code Editor: Monaco Editor (@monaco-editor/react v4.6+)
5. AI Integration: OpenAI API (GPT-4o) + Vercel AI SDK (ai v3.0+)
6. State Management: Zustand 4.5+ with persistence
7. Live Runtime: WebContainers API (@webcontainer/api v1.1.8+)
8. UI Components: shadcn/ui + Radix UI primitives
9. Icons: Lucide React 0.344+
10. Terminal: XTerm.js (for container logs)
11. Validation: Zod for runtime type checking
12. Utilities: date-fns, clsx, tailwind-merge

═══════════════════════════════════════════════════════════════════════════
                        SYSTEM ARCHITECTURE DIAGRAM
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER (Browser)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Chat UI   │  │  File Tree   │  │ Monaco Editor│  │   Preview   │ │
│  │  (Sidebar)  │  │  (Explorer)  │  │   (Center)   │  │  (iframe)   │ │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                │                  │                  │        │
│         └────────────────┴──────────────────┴──────────────────┘        │
│                              │                                            │
│                     ┌────────▼────────┐                                  │
│                     │  Zustand Store  │                                  │
│                     │  (Global State) │                                  │
│                     └────────┬────────┘                                  │
│                              │                                            │
│         ┌────────────────────┼────────────────────┐                      │
│         │                    │                    │                      │
│  ┌──────▼──────┐    ┌───────▼────────┐   ┌──────▼──────┐                │
│  │ WebContainer│    │  File System   │   │   Terminal  │                │
│  │   (Node.js) │    │   (Virtual)    │   │   (XTerm)   │                │
│  └─────────────┘    └────────────────┘   └─────────────┘                │
└─────────────────────────────────────────────────────────────────────────┘
                              │ HTTPS/WSS
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SERVER LAYER (Next.js API)                     │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────────────────┐ │
│  │  /api/chat      │  │  /api/files  │  │  /api/container/*          │ │
│  │  (OpenAI Stream)│  │  (CRUD Ops)  │  │  (WebContainer Proxy)      │ │
│  └─────────────────┘  └──────────────┘  └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │  OpenAI API  │  │  npm Registry│  │  GitHub OAuth│                   │
│  │  (GPT-4o)    │  │  (Packages)  │  │  (Optional)  │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                          FILE STRUCTURE
═══════════════════════════════════════════════════════════════════════════

ai-code-editor/
├── .env.local                          # Environment variables
├── .env.example                        # Template for env vars
├── next.config.js                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind CSS config
├── tsconfig.json                       # TypeScript config
├── package.json                        # Dependencies
├── README.md                           # Documentation
│
├── app/
│   ├── layout.tsx                      # Root layout with providers
│   ├── page.tsx                        # Main IDE interface
│   ├── globals.css                     # Global styles + Tailwind
│   │
│   └── api/
│       ├── chat/
│       │   └── route.ts                # POST: AI chat streaming endpoint
│       │
│       ├── files/
│       │   ├── route.ts                # GET/POST: File operations
│       │   └── [path]/
│       │       └── route.ts            # GET/PUT/DELETE: Single file
│       │
│       └── container/
│           ├── boot/
│           │   └── route.ts            # POST: Initialize WebContainer
│           ├── execute/
│           │   └── route.ts            # POST: Run commands
│           └── preview/
│               └── route.ts            # GET: Get preview URL
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                  # Top navigation bar
│   │   ├── Sidebar.tsx                 # Collapsible left sidebar
│   │   └── MainLayout.tsx              # 3-panel layout wrapper
│   │
│   ├── chat/
│   │   ├── ChatSidebar.tsx             # Main chat interface
│   │   ├── ChatMessage.tsx             # Individual message bubble
│   │   ├── ChatInput.tsx               # Input field with submit
│   │   ├── CodeBlock.tsx               # Syntax-highlighted code display
│   │   └── ApplyChangesButton.tsx      # Button to apply AI suggestions
│   │
│   ├── editor/
│   │   ├── CodeEditor.tsx              # Monaco Editor wrapper
│   │   ├── FileTabs.tsx                # Open file tabs bar
│   │   ├── EditorToolbar.tsx           # Editor actions (save, format)
│   │   └── DiffViewer.tsx              # Before/after comparison
│   │
│   ├── explorer/
│   │   ├── FileExplorer.tsx            # Tree view of files
│   │   ├── FileTree.tsx                # Recursive tree component
│   │   ├── FileItem.tsx                # Single file/folder item
│   │   └── ContextMenu.tsx             # Right-click menu
│   │
│   ├── preview/
│   │   ├── LivePreview.tsx             # WebContainer iframe
│   │   ├── PreviewToolbar.tsx          # Preview controls (refresh, open)
│   │   └── PreviewFrame.tsx            # Sandboxed iframe component
│   │
│   ├── terminal/
│   │   ├── Terminal.tsx                # XTerm.js wrapper
│   │   └── TerminalOutput.tsx          # Read-only output viewer
│   │
│   └── ui/                             # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── scroll-area.tsx
│       ├── tabs.tsx
│       ├── tooltip.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       └── toast.tsx
│
├── lib/
│   ├── store/
│   │   ├── index.ts                    # Zustand store export
│   │   ├── useFileStore.ts             # File state management
│   │   ├── useChatStore.ts             # Chat history management
│   │   ├── useContainerStore.ts        # WebContainer state
│   │   └── useUIStore.ts               # UI state (sidebar, theme)
│   │
│   ├── services/
│   │   ├── openai.ts                   # OpenAI API client
│   │   ├── webcontainer.ts             # WebContainer manager
│   │   ├── fileSystem.ts               # Virtual file system ops
│   │   └── codeParser.ts               # Parse AI responses
│   │
│   ├── hooks/
│   │   ├── useChat.ts                  # Chat logic hook
│   │   ├── useFiles.ts                 # File operations hook
│   │   ├── usePreview.ts               # Preview management hook
│   │   └── useKeyboardShortcuts.ts     # Global key bindings
│   │
│   ├── utils/
│   │   ├── cn.ts                       # Class name merger
│   │   ├── debounce.ts                 # Debounce utility
│   │   ├── storage.ts                  # LocalStorage helpers
│   │   └── validators.ts               # Zod schemas
│   │
│   └── constants/
│       ├── languages.ts                # Language configurations
│       ├── prompts.ts                  # System prompts
│       └── templates.ts                # Project templates
│
├── types/
│   ├── index.ts                        # Core type exports
│   ├── file.ts                         # File-related types
│   ├── chat.ts                         # Chat message types
│   ├── container.ts                    # WebContainer types
│   └── api.ts                          # API response types
│
├── public/
│   ├── logo.svg                        # Application logo
│   └── favicon.ico                     # Favicon
│
└── styles/
    ├── themes/
    │   ├── dark.ts                     # Dark theme config
    │   └── light.ts                    # Light theme config
    └── monaco/
        └── theme.ts                    # Monaco editor theme

═══════════════════════════════════════════════════════════════════════════
                      CORE TYPE DEFINITIONS
═══════════════════════════════════════════════════════════════════════════

Create the following TypeScript types in types/index.ts:

// File System Types
export interface File {
  id: string;
  path: string;
  name: string;
  content: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  isDirty: boolean;
}

export interface FileTree {
  [key: string]: File | FileTree;
}

// Chat Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    files?: File[];
    explanation?: string;
    error?: string;
  };
}

export interface ChatRequest {
  messages: Message[];
  files: File[];
  options?: {
    model?: string;
    temperature?: number;
  };
}

// AI Response Types
export interface AIFileChange {
  path: string;
  content: string;
  action: 'create' | 'update' | 'delete';
}

export interface AIResponse {
  files: AIFileChange[];
  explanation: string;
  summary: string;
}

// WebContainer Types
export interface ContainerStatus {
  isReady: boolean;
  url: string | null;
  port: number | null;
  logs: string[];
  error: string | null;
}

// Store Types
export interface AppState {
  files: File[];
  activeFileId: string | null;
  openFileIds: string[];
  messages: Message[];
  isLoading: boolean;
  container: ContainerStatus;
  ui: {
    sidebarOpen: boolean;
    theme: 'dark' | 'light';
    activePanel: 'explorer' | 'search' | 'git';
  };
}

═══════════════════════════════════════════════════════════════════════════
                    ZUSTAND STORE IMPLEMENTATION
═══════════════════════════════════════════════════════════════════════════

Implement Zustand stores with the following structure:

// lib/store/useFileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { File } from '@/types';

interface FileState {
  files: File[];
  activeFileId: string | null;
  openFileIds: string[];
  
  // Actions
  addFile: (file: Omit<File, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  setActiveFile: (id: string | null) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  applyChanges: (changes: AIFileChange[]) => void;
  getFiles: () => File[];
  getFileByPath: (path: string) => File | undefined;
}

export const useFileStore = create<FileState>()(
  persist(
    (set, get) => ({
      files: [],
      activeFileId: null,
      openFileIds: [],
      
      addFile: (fileData) => {
        const newFile: File = {
          ...fileData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          isDirty: false,
        };
        set((state) => ({ files: [...state.files, newFile] }));
      },
      
      updateFile: (id, content) => {
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id
              ? { ...file, content, updatedAt: new Date(), isDirty: true }
              : file
          ),
        }));
      },
      
      deleteFile: (id) => {
        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
          openFileIds: state.openFileIds.filter((fid) => fid !== id),
          activeFileId: state.activeFileId === id ? null : state.activeFileId,
        }));
      },
      
      setActiveFile: (id) => set({ activeFileId: id }),
      
      openFile: (id) => {
        set((state) => ({
          openFileIds: state.openFileIds.includes(id)
            ? state.openFileIds
            : [...state.openFileIds, id],
          activeFileId: id,
        }));
      },
      
      closeFile: (id) => {
        set((state) => {
          const newOpenIds = state.openFileIds.filter((fid) => fid !== id);
          return {
            openFileIds: newOpenIds,
            activeFileId: state.activeFileId === id
              ? newOpenIds[newOpenIds.length - 1] || null
              : state.activeFileId,
          };
        });
      },
      
      applyChanges: (changes) => {
        changes.forEach((change) => {
          if (change.action === 'delete') {
            const file = get().getFileByPath(change.path);
            if (file) get().deleteFile(file.id);
          } else {
            const existingFile = get().getFileByPath(change.path);
            if (existingFile) {
              get().updateFile(existingFile.id, change.content);
            } else {
              get().addFile({
                path: change.path,
                name: change.path.split('/').pop() || '',
                content: change.content,
                language: getLanguageFromPath(change.path),
              });
            }
          }
        });
      },
      
      getFiles: () => get().files,
      
      getFileByPath: (path) => get().files.find((f) => f.path === path),
    }),
    {
      name: 'file-storage',
      partialize: (state) => ({ files: state.files }),
    }
  )
);

// Similar stores for chat, container, and UI state

═══════════════════════════════════════════════════════════════════════════
                      API ROUTE IMPLEMENTATIONS
═══════════════════════════════════════════════════════════════════════════

// app/api/chat/route.ts
import { OpenAI } from 'openai';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FileChangeSchema = z.object({
  path: z.string(),
  content: z.string(),
  action: z.enum(['create', 'update', 'delete']),
});

const AIResponseSchema = z.object({
  files: z.array(FileChangeSchema),
  explanation: z.string(),
  summary: z.string(),
});

const SYSTEM_PROMPT = `You are an expert full-stack developer AI assistant.

CRITICAL INSTRUCTIONS:
1. ALWAYS respond with valid JSON matching this exact schema:
   {
     "files": [
       {
         "path": "relative/path/to/file.tsx",
         "content": "complete file content",
         "action": "create" | "update" | "delete"
       }
     ],
     "explanation": "Detailed explanation of changes",
     "summary": "Brief one-line summary"
   }

2. Provide COMPLETE, production-ready file contents - never partial snippets
3. Include all necessary imports and dependencies
4. Use modern best practices (React hooks, TypeScript, Tailwind CSS)
5. For React apps, create proper component structure
6. Add package.json with all required dependencies
7. NEVER use markdown code blocks - return raw JSON only
8. Ensure code is functional and error-free
9. If user requests modifications, preserve existing functionality
10. Use proper error handling and loading states

Current project context will be provided in the user message.`;

export async function POST(req: Request) {
  try {
    const { messages, files } = await req.json();
    
    const currentFilesContext = files
      .map((f: File) => `File: ${f.path}\n\`\`\`${getLanguageMarker(f.language)}\n${f.content}\n\`\`\``)
      .join('\n\n');
    
    const userMessage = messages[messages.length - 1];
    
    const enhancedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Current project files:\n${currentFilesContext}\n\nUser request: ${userMessage.content}`,
      },
    ];
    
    const response = await streamText({
      model: openai.chat('gpt-4o'),
      messages: enhancedMessages,
      temperature: 0.7,
      maxTokens: 4000,
      onFinish: async ({ text }) => {
        // Log the response for debugging
        console.log('AI Response:', text);
      },
    });
    
    return response.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function getLanguageMarker(language: string): string {
  const markers: Record<string, string> = {
    typescript: 'tsx',
    javascript: 'jsx',
    css: 'css',
    html: 'html',
    json: 'json',
  };
  return markers[language] || 'text';
}

// app/api/container/boot/route.ts
import { WebContainer } from '@webcontainer/api';
import { NextResponse } from 'next/server';

let webContainerInstance: WebContainer | null = null;

export async function POST() {
  try {
    if (!webContainerInstance) {
      webContainerInstance = await WebContainer.boot();
    }
    
    return NextResponse.json({
      success: true,
      message: 'WebContainer booted successfully',
    });
  } catch (error) {
    console.error('Failed to boot WebContainer:', error);
    return NextResponse.json(
      { error: 'Failed to boot container' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    isReady: !!webContainerInstance,
  });
}

═══════════════════════════════════════════════════════════════════════════
                    WEBCONTAINER SERVICE CLASS
═══════════════════════════════════════════════════════════════════════════

// lib/services/webcontainer.ts
import { WebContainer } from '@webcontainer/api';
import { File } from '@/types';

export class WebContainerService {
  private container: WebContainer | null = null;
  private process: any = null;
  private url: string | null = null;
  private logs: string[] = [];
  private listeners: Set<(logs: string[]) => void> = new Set();

  async boot(): Promise<void> {
    if (this.container) return;
    
    this.container = await WebContainer.boot();
    
    // Listen for server-ready events
    this.container.on('server-ready', (port: number, url: string) => {
      this.url = url;
      this.addLog(`Server ready on port ${port}: ${url}`);
    });
  }

  async mountFiles(files: File[]): Promise<void> {
    if (!this.container) throw new Error('Container not booted');
    
    const fileTree = this.buildFileTree(files);
    await this.container.mount(fileTree);
    
    this.addLog('Files mounted to virtual file system');
  }

  async installDependencies(): Promise<void> {
    if (!this.container) throw new Error('Container not booted');
    
    this.addLog('Installing dependencies...');
    
    const installProcess = await this.container.spawn('npm', ['install']);
    
    installProcess.output.pipeTo(
      new WritableStream({
        write: (data) => {
          this.addLog(data);
        },
      })
    );
    
    const exitCode = await installProcess.exit;
    
    if (exitCode !== 0) {
      throw new Error(`npm install failed with exit code ${exitCode}`);
    }
    
    this.addLog('Dependencies installed successfully');
  }

  async startDevServer(): Promise<string> {
    if (!this.container) throw new Error('Container not booted');
    
    this.addLog('Starting development server...');
    
    this.process = await this.container.spawn('npm', ['run', 'dev']);
    
    this.process.output.pipeTo(
      new WritableStream({
        write: (data) => {
          this.addLog(data);
        },
      })
    );
    
    // Wait for server-ready event
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server start timeout'));
      }, 30000);
      
      this.container!.on('server-ready', (port: number, url: string) => {
        clearTimeout(timeout);
        this.url = url;
        resolve(url);
      });
    });
  }

  async executeCommand(command: string, args: string[]): Promise<string> {
    if (!this.container) throw new Error('Container not booted');
    
    const process = await this.container.spawn(command, args);
    let output = '';
    
    process.output.pipeTo(
      new WritableStream({
        write: (data) => {
          output += data;
          this.addLog(data);
        },
      })
    );
    
    await process.exit;
    return output;
  }

  private buildFileTree(files: File[]): Record<string, any> {
    const tree: Record<string, any> = {};
    
    files.forEach((file) => {
      const parts = file.path.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // This is the file
          current[part] = {
            file: {
              contents: file.content,
            },
          };
        } else {
          // This is a directory
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      });
    });
    
    return tree;
  }

  private addLog(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener([...this.logs]));
  }

  onLogsChange(callback: (logs: string[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getUrl(): string | null {
    return this.url;
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  async shutdown(): Promise<void> {
    if (this.process) {
      await this.process.kill();
    }
    this.container = null;
    this.url = null;
    this.logs = [];
    this.process = null;
  }
}

export const webContainerService = new WebContainerService();

═══════════════════════════════════════════════════════════════════════════
                    MAIN COMPONENT IMPLEMENTATIONS
═══════════════════════════════════════════════════════════════════════════

// app/page.tsx - Main IDE Interface
'use client';

import { useEffect, useState } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { FileExplorer } from '@/components/explorer/FileExplorer';
import { LivePreview } from '@/components/preview/LivePreview';
import { Terminal } from '@/components/terminal/Terminal';
import { FileTabs } from '@/components/editor/FileTabs';
import { useFileStore } from '@/lib/store/useFileStore';
import { useChatStore } from '@/lib/store/useChatStore';
import { useContainerStore } from '@/lib/store/useContainerStore';
import { webContainerService } from '@/lib/services/webcontainer';
import { Loader2 } from 'lucide-react';

export default function IDEPage() {
  const { files, activeFileId } = useFileStore();
  const { isLoading } = useChatStore();
  const { isReady, error } = useContainerStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<'explorer' | 'terminal'>('explorer');

  useEffect(() => {
    // Initialize WebContainer on mount
    async function init() {
      try {
        await webContainerService.boot();
        useContainerStore.getState().setReady(true);
      } catch (err) {
        useContainerStore.getState().setError(err instanceof Error ? err.message : 'Failed to boot');
      }
    }
    
    init();
  }, []);

  useEffect(() => {
    // Sync files to WebContainer when they change
    if (isReady && files.length > 0) {
      syncFilesToContainer();
    }
  }, [files, isReady]);

  async function syncFilesToContainer() {
    try {
      await webContainerService.mountFiles(files);
      await webContainerService.installDependencies();
      const url = await webContainerService.startDevServer();
      useContainerStore.getState().setUrl(url);
    } catch (err) {
      console.error('Failed to sync files:', err);
    }
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* AI Chat Sidebar */}
      <ChatSidebar 
        isOpen={sidebarOpen && activePanel === 'chat'}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center px-4 gap-4">
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setActivePanel('explorer');
            }}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          
          <h1 className="font-semibold text-lg">AI Code Editor</h1>
          
          <div className="flex-1" />
          
          {!isReady && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Initializing environment...
            </div>
          )}
        </header>
        
        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          {sidebarOpen && activePanel === 'explorer' && (
            <div className="w-64 border-r border-slate-800 bg-slate-900/50">
              <FileExplorer />
            </div>
          )}
          
          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-w-0">
            <FileTabs />
            <div className="flex-1 relative">
              {activeFileId ? (
                <CodeEditor fileId={activeFileId} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">No file open</p>
                    <p className="text-sm">Select a file from the explorer or ask AI to create one</p>
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center">
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="text-slate-300">AI is working...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Live Preview */}
          <div className="w-1/2 border-l border-slate-800 flex flex-col">
            <LivePreview />
          </div>
        </div>
        
        {/* Terminal Panel */}
        {sidebarOpen && activePanel === 'terminal' && (
          <div className="h-48 border-t border-slate-800 bg-slate-900">
            <Terminal />
          </div>
        )}
      </div>
    </div>
  );
}

// components/chat/ChatSidebar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { useFileStore } from '@/lib/store/useFileStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { files } = useFileStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { files },
    onFinish: async (message) => {
      // Parse AI response and apply changes
      await handleAIResponse(message.content);
    },
  });

  async function handleAIResponse(content: string) {
    try {
      const parsed = JSON.parse(content);
      
      if (parsed.files && Array.isArray(parsed.files)) {
        useFileStore.getState().applyChanges(parsed.files);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) {
    return (
      <button
        onClick={onClose}
        className="fixed left-4 top-20 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors z-50"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-96 border-r border-slate-800 bg-slate-900 flex flex-col h-full">
      {/* Header */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Start a conversation</p>
              <p className="text-xs mt-1">Describe what you want to build</p>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>AI is thinking...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

// components/editor/CodeEditor.tsx
'use client';

import Editor from '@monaco-editor/react';
import { useFileStore } from '@/lib/store/useFileStore';
import { useEffect, useState } from 'react';
import { File } from '@/types';

interface CodeEditorProps {
  fileId: string;
}

export function CodeEditor({ fileId }: CodeEditorProps) {
  const { files, updateFile } = useFileStore();
  const [editorInstance, setEditorInstance] = useState<any>(null);
  
  const file = files.find((f) => f.id === fileId);
  
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        File not found
      </div>
    );
  }

  const handleEditorMount = (editor: any) => {
    setEditorInstance(editor);
  };

  const handleChange = (value: string | undefined) => {
    if (value !== undefined && file) {
      updateFile(file.id, value);
    }
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage={getMonacoLanguage(file.language)}
        language={getMonacoLanguage(file.language)}
        value={file.content}
        theme="vs-dark"
        onChange={handleChange}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 24,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          detectIndentation: true,
          formatOnPaste: true,
          formatOnType: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          folding: true,
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
        }}
      />
    </div>
  );
}

function getMonacoLanguage(language: string): string {
  const mapping: Record<string, string> = {
    typescript: 'typescript',
    javascript: 'javascript',
    tsx: 'typescript',
    jsx: 'javascript',
    css: 'css',
    html: 'html',
    json: 'json',
    markdown: 'markdown',
  };
  return mapping[language] || 'plaintext';
}

// components/preview/LivePreview.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useContainerStore } from '@/lib/store/useContainerStore';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { webContainerService } from '@/lib/services/webcontainer';

export function LivePreview() {
  const { url, isReady } = useContainerStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to WebContainer URL changes
    const unsubscribe = webContainerService.onLogsChange(() => {
      const newUrl = webContainerService.getUrl();
      if (newUrl) {
        useContainerStore.getState().setUrl(newUrl);
      }
    });
    
    return unsubscribe;
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleOpenInNewTab = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (!isReady) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="text-center text-slate-500">
          <p className="mb-2">Initializing preview environment...</p>
          <p className="text-sm">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="text-center text-slate-500">
          <p>No preview available</p>
          <p className="text-sm mt-1">Start the dev server to see your app</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-10 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Preview Ready</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenInNewTab}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Preview Frame */}
      <div className="flex-1 relative bg-white">
        <iframe
          key={key}
          ref={iframeRef}
          src={url}
          className="absolute inset-0 w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="Live Preview"
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/10 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}

// components/explorer/FileExplorer.tsx
'use client';

import { useFileStore } from '@/lib/store/useFileStore';
import { FileTree } from './FileTree';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderOpen, FileCode } from 'lucide-react';

export function FileExplorer() {
  const { files, activeFileId } = useFileStore();

  const buildTree = () => {
    const tree: Record<string, any> = {};
    
    files.forEach((file) => {
      const parts = file.path.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = { type: 'file', data: file };
        } else {
          if (!current[part]) {
            current[part] = { type: 'folder', children: {} };
          }
          current = current[part].children;
        }
      });
    });
    
    return tree;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-10 border-b border-slate-800 flex items-center px-3 gap-2">
        <FolderOpen className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium">Explorer</span>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <FileTree 
          tree={buildTree()} 
          path="" 
          activeFileId={activeFileId}
        />
      </ScrollArea>
    </div>
  );
}

// components/explorer/FileTree.tsx
'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, FileCode, Folder } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useFileStore } from '@/lib/store/useFileStore';
import { File } from '@/types';

interface TreeNode {
  type: 'file' | 'folder';
  data?: File;
  children?: Record<string, TreeNode>;
}

interface FileTreeProps {
  tree: Record<string, TreeNode>;
  path: string;
  activeFileId: string | null;
  depth?: number;
}

export function FileTree({ tree, path, activeFileId, depth = 0 }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const { setActiveFile, openFile } = useFileStore();

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  const handleFileClick = (file: File) => {
    openFile(file.id);
    setActiveFile(file.id);
  };

  const entries = Object.entries(tree);

  return (
    <div className="space-y-0.5">
      {entries.map(([name, node]) => {
        const fullPath = path ? `${path}/${name}` : name;
        const isExpanded = expandedFolders.has(fullPath);

        if (node.type === 'folder') {
          return (
            <div key={fullPath}>
              <button
                onClick={() => toggleFolder(fullPath)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-800/50 rounded-md text-sm text-slate-300 transition-colors"
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
                <Folder className="w-4 h-4 text-blue-500" />
                <span>{name}</span>
              </button>
              
              {isExpanded && node.children && (
                <FileTree
                  tree={node.children}
                  path={fullPath}
                  activeFileId={activeFileId}
                  depth={depth + 1}
                />
              )}
            </div>
          );
        }

        if (node.type === 'file' && node.data) {
          const isActive = node.data.id === activeFileId;
          
          return (
            <button
              key={fullPath}
              onClick={() => handleFileClick(node.data!)}
              className={cn(
                "w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-blue-600/20 text-blue-400"
                  : "hover:bg-slate-800/50 text-slate-300"
              )}
              style={{ paddingLeft: `${depth * 12 + 24}px` }}
            >
              <FileCode className="w-4 h-4" />
              <span className="truncate">{name}</span>
            </button>
          );
        }

        return null;
      })}
    </div>
  );
}

═══════════════════════════════════════════════════════════════════════════
                    ENVIRONMENT & CONFIGURATION
═══════════════════════════════════════════════════════════════════════════

// .env.example
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000

// package.json
{
  "name": "ai-code-editor",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@monaco-editor/react": "4.6.0",
    "zustand": "4.5.2",
    "ai": "3.0.27",
    "openai": "4.47.1",
    "@webcontainer/api": "1.1.8",
    "lucide-react": "0.378.0",
    "zod": "3.23.8",
    "date-fns": "3.6.0",
    "clsx": "2.1.1",
    "tailwind-merge": "2.3.0",
    "class-variance-authority": "0.7.0",
    "@radix-ui/react-scroll-area": "1.0.5",
    "@radix-ui/react-dialog": "1.0.5",
    "@radix-ui/react-dropdown-menu": "2.0.6",
    "@radix-ui/react-tooltip": "1.0.7"
  },
  "devDependencies": {
    "typescript": "5.4.5",
    "tailwindcss": "3.4.3",
    "autoprefixer": "10.4.19",
    "postcss": "8.4.38",
    "@types/node": "20.12.12",
    "@types/react": "18.3.2",
    "@types/react-dom": "18.3.0",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.3"
  }
}

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    return config;
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
      ],
    },
  ],
};

module.exports = nextConfig;

// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

═══════════════════════════════════════════════════════════════════════════
                    UTILITY FUNCTIONS & HELPERS
═══════════════════════════════════════════════════════════════════════════

// lib/utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/utils/storage.ts
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },
};

// lib/constants/prompts.ts
export const SYSTEM_PROMPT = `You are an expert full-stack developer AI assistant.

CRITICAL INSTRUCTIONS:
1. ALWAYS respond with valid JSON matching this exact schema:
   {
     "files": [
       {
         "path": "relative/path/to/file.tsx",
         "content": "complete file content",
         "action": "create" | "update" | "delete"
       }
     ],
     "explanation": "Detailed explanation of changes",
     "summary": "Brief one-line summary"
   }

2. Provide COMPLETE, production-ready file contents - never partial snippets
3. Include all necessary imports and dependencies
4. Use modern best practices (React hooks, TypeScript, Tailwind CSS)
5. For React apps, create proper component structure
6. Add package.json with all required dependencies
7. NEVER use markdown code blocks - return raw JSON only
8. Ensure code is functional and error-free
9. If user requests modifications, preserve existing functionality
10. Use proper error handling and loading states`;

export const WELCOME_MESSAGE = `Welcome to AI Code Editor! 👋

I can help you:
• Create full-stack applications from scratch
• Add new features to existing code
• Fix bugs and errors
• Refactor and optimize code
• Explain how code works

Just describe what you want to build, and I'll generate the code for you!

Try: "Create a todo app with React and Tailwind CSS"`;

// lib/constants/templates.ts
export const PROJECT_TEMPLATES = {
  'react-vite': {
    name: 'React + Vite',
    files: [
      {
        path: 'package.json',
        content: `{
  "name": "react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}`,
        language: 'json',
      },
      {
        path: 'src/main.tsx',
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
        language: 'typescript',
      },
      {
        path: 'src/App.tsx',
        content: `function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900">
        Hello World
      </h1>
    </div>
  )
}

export default App`,
        language: 'typescript',
      },
      {
        path: 'src/index.css',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
        language: 'css',
      },
    ],
  },
};

═══════════════════════════════════════════════════════════════════════════
                    ERROR HANDLING & BOUNDARIES
═══════════════════════════════════════════════════════════════════════════

// components/ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-100 mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// app/providers.tsx
'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

// app/layout.tsx
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Code Editor',
  description: 'Build applications with AI assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

═══════════════════════════════════════════════════════════════════════════
                    KEYBOARD SHORTCUTS
═══════════════════════════════════════════════════════════════════════════

// lib/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

interface Shortcut {
  key: string;
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  handler: (event: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, modifiers = {}, handler }) => {
        const matchesModifiers =
          (!!modifiers.ctrl === event.ctrlKey || modifiers.ctrl === undefined) &&
          (!!modifiers.shift === event.shiftKey || modifiers.shift === undefined) &&
          (!!modifiers.alt === event.altKey || modifiers.alt === undefined) &&
          (!!modifiers.meta === event.metaKey || modifiers.meta === undefined);

        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          matchesModifiers
        ) {
          event.preventDefault();
          handler(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Usage in main component:
/*
useKeyboardShortcuts([
  {
    key: 's',
    modifiers: { ctrl: true },
    handler: () => {
      // Save file
      console.log('Save triggered');
    },
  },
  {
    key: 'p',
    modifiers: { ctrl: true },
    handler: () => {
      // Open file search
      console.log('Quick open triggered');
    },
  },
  {
    key: '`',
    modifiers: { ctrl: true },
    handler: () => {
      // Toggle terminal
      toggleTerminal();
    },
  },
]);
*/

═══════════════════════════════════════════════════════════════════════════
                    STYLES & THEME
═══════════════════════════════════════════════════════════════════════════

// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-slate-900;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-slate-700 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-600;
  }
}

/* Monaco Editor Customization */
.monaco-editor {
  --vscode-editor-background: #0f172a;
  --vscode-editor-foreground: #e2e8f0;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

═══════════════════════════════════════════════════════════════════════════
                    README & DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════

# AI Code Editor

A production-ready, browser-based IDE with AI-powered code generation capabilities.

## Features

- 🤖 **AI Code Generation** - Chat with AI to create and modify code
- 📝 **Monaco Editor** - Full-featured code editor (same as VS Code)
- 🖥️ **Live Preview** - Real-time application preview with WebContainers
- 📁 **File Management** - Organize files with tree explorer
- 💬 **Streaming Responses** - Real-time AI responses with streaming
- 🎨 **Modern UI** - Beautiful dark theme interface

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-code-editor
