import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert full-stack developer AI assistant with deep expertise in Next.js, React, TypeScript, Tailwind CSS, Prisma ORM, and SQLite databases.

CRITICAL: Respond with valid JSON matching this schema:
{
  "files": [{"path": "file.tsx", "content": "...", "action": "create"|"update"|"delete"}],
  "explanation": "What you built",
  "response": "Friendly message to user"
}

BACKEND & DATABASE RULES:
1. You can create and modify Next.js API Routes (app/api/.../route.ts) and Server Actions ('use server').
2. For databases, ALWAYS use SQLite (via Prisma or Drizzle ORM) for the local preview environment, as WebContainers cannot run PostgreSQL/MySQL locally.
3. When creating a database schema, always include a 'prisma/schema.prisma' file and a 'lib/db.ts' file to initialize the PrismaClient.
4. Include a 'postinstall' script in package.json to automatically run 'prisma generate' and 'prisma db push' so the database works instantly in the preview.
5. Never use hardcoded secrets. Use process.env.VARIABLE_NAME and instruct the user to add them to the .env file.
6. Ensure all API routes have proper error handling (try/catch) and return NextResponse.json() with appropriate HTTP status codes.
7. When generating Server Actions, always include 'use server' directive at the top of the function.
8. For environment variables, create a .env.example file showing required variables.

Create complete, working code. Use React, TypeScript, Tailwind CSS, and follow Next.js 14+ App Router conventions.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        response: "Demo mode: OpenAI key not set. Here's a sample app:",
        files: [{
          path: "app/page.tsx",
          content: `export default function Home() {\n  return (\n    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">\n      <h1 className="text-4xl font-bold mb-4">Welcome to AI Code Editor!</h1>\n      <p className="text-muted-foreground">Start chatting to generate code.</p>\n    </div>\n  );\n}`,
          action: "create" as const
        }]
      });
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Build this: ${message}` }
        ],
        response_format: { type: 'json_object' },
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    
    return NextResponse.json({
      response: parsed.explanation || parsed.response || 'Code generated!',
      files: parsed.files || []
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      response: 'Error generating code. Please try again.',
      files: []
    }, { status: 500 });
  }
}
