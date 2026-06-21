export const PROJECT_TEMPLATES = {
  'blank': {
    name: 'Blank Project',
    description: 'Start from scratch',
    files: []
  },
  'nextjs-basic': {
    name: 'Next.js Basic',
    description: 'Simple Next.js app with Tailwind CSS',
    files: [
      {
        path: 'app/page.tsx',
        content: `export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Next.js!</h1>
      <p className="text-muted-foreground">Start building your amazing app.</p>
    </div>
  );
}`
      }
    ]
  },
  'fullstack-next-prisma': {
    name: 'Full-Stack Next.js + Prisma',
    description: 'Complete full-stack setup with SQLite database',
    files: [
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'fullstack-app',
          version: '1.0.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
            postinstall: 'prisma generate && prisma db push'
          },
          dependencies: {
            next: '14.2.3',
            react: '^18.3.1',
            'react-dom': '^18.3.1'
          },
          devDependencies: {
            typescript: '^5.4.5',
            '@types/node': '^20.12.7',
            '@types/react': '^18.3.1',
            '@types/react-dom': '^18.3.0',
            tailwindcss: '^3.4.3',
            autoprefixer: '^10.4.19',
            postcss: '^8.4.38',
            prisma: '^5.13.0',
            '@prisma/client': '^5.13.0',
            'better-sqlite3': '^9.4.3'
          }
        }, null, 2)
      },
      {
        path: 'prisma/schema.prisma',
        content: `// This is your Prisma schema file
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}
`
      },
      {
        path: 'lib/db.ts',
        content: `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
`
      },
      {
        path: '.env.local',
        content: `DATABASE_URL="file:./dev.db"`
      },
      {
        path: '.env.example',
        content: `DATABASE_URL="file:./dev.db"`
      },
      {
        path: 'app/api/users/route.ts',
        content: `import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: { email, name }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
`
      },
      {
        path: 'app/users/page.tsx',
        content: `'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  posts: any[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;
  if (error) return <div className="p-8 text-red-400">Error: {error}</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Users</h1>
      <div className="grid gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white">{user.name || 'Anonymous'}</h2>
            <p className="text-slate-400">{user.email}</p>
            <p className="text-sm text-slate-500 mt-2">
              {user.posts.length} post{user.posts.length !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-slate-500">No users found. Create one via the API!</p>
        )}
      </div>
    </div>
  );
}
`
      }
    ]
  }
};

export type TemplateKey = keyof typeof PROJECT_TEMPLATES;
