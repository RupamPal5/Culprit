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

export interface ContainerStatus {
  isReady: boolean;
  url: string | null;
  port: number | null;
  logs: string[];
  error: string | null;
}

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
