import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Code Editor',
  description: 'AI-powered code generation platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark bg-background text-foreground h-full">
        {children}
      </body>
    </html>
  );
}
