'use client';
import { useState } from 'react';
import { useChatStore } from '@/lib/store/useChatStore';
import { useFileStore } from '@/lib/store/useFileStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function ChatSidebar() {
  const { messages, addMessage, setLoading, isLoading } = useChatStore();
  const { applyChanges } = useFileStore();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = { id: crypto.randomUUID(), role: 'user' as const, content: input, timestamp: new Date() };
    addMessage(userMsg);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.response) {
        addMessage({ id: crypto.randomUUID(), role: 'assistant', content: data.response, timestamp: new Date() });
        if (data.files) applyChanges(data.files);
      }
    } catch (err) {
      addMessage({ id: crypto.randomUUID(), role: 'assistant', content: 'Error: Could not reach AI server.', timestamp: new Date() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 border-r bg-card h-full flex flex-col">
      <div className="p-3 border-b font-semibold text-sm">AI Assistant</div>
      <ScrollArea className="flex-1 p-3 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={cn("p-2 rounded-md text-sm", m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
            {m.content}
          </div>
        ))}
        {messages.length === 0 && <div className="text-xs text-muted-foreground">Ask me to create any app!</div>}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your app..." disabled={isLoading} />
        <Button type="submit" size="sm" disabled={isLoading || !input.trim()}><Send className="w-4 h-4" /></Button>
      </form>
    </div>
  );
}
