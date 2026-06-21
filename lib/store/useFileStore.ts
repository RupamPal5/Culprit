import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { File, AIFileChange } from '@/types';

const getLanguageFromPath = (path: string): string => {
  const ext = path.split('.').pop();
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    py: 'python', html: 'html', css: 'css', json: 'json', md: 'markdown',
    prisma: 'prisma', sql: 'sql', sh: 'shell', env: 'plaintext'
  };
  return map[ext || ''] || 'plaintext';
};

interface FileState {
  files: File[];
  activeFileId: string | null;
  openFileIds: string[];
  addFile: (file: Omit<File, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  setActiveFile: (id: string | null) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  applyChanges: (changes: AIFileChange[]) => void;
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
            file.id === id ? { ...file, content, updatedAt: new Date(), isDirty: true } : file
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
          openFileIds: state.openFileIds.includes(id) ? state.openFileIds : [...state.openFileIds, id],
          activeFileId: id,
        }));
      },
      closeFile: (id) => {
        set((state) => {
          const newOpenIds = state.openFileIds.filter((fid) => fid !== id);
          return {
            openFileIds: newOpenIds,
            activeFileId: state.activeFileId === id ? newOpenIds[newOpenIds.length - 1] || null : state.activeFileId,
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
      getFileByPath: (path) => get().files.find((f) => f.path === path),
    }),
    { name: 'file-storage', partialize: (state) => ({ files: state.files }) }
  )
);
