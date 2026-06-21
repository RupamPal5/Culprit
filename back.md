I have successfully built the base AI Code Editor using the previous specifications. Now, I need to upgrade the application to fully support backend development, database integration, and server-side logic. 

Please implement the following backend upgrades without breaking the existing frontend features:

═══════════════════════════════════════════════════════════════════════════
1. UPDATE THE AI SYSTEM PROMPT (app/api/chat/route.ts)
═══════════════════════════════════════════════════════════════════════════
Update the `SYSTEM_PROMPT` variable to include backend capabilities. Add these rules:

"BACKEND & DATABASE RULES:
1. You can create and modify Next.js API Routes (app/api/.../route.ts) and Server Actions ('use server').
2. For databases, ALWAYS use SQLite (via Prisma or Drizzle ORM) for the local preview environment, as WebContainers cannot run PostgreSQL/MySQL locally. 
3. When creating a database schema, always include a 'prisma/schema.prisma' file and a 'lib/db.ts' file to initialize the PrismaClient.
4. Include a 'postinstall' script in package.json to automatically run 'prisma generate' and 'prisma db push' so the database works instantly in the preview.
5. Never use hardcoded secrets. Use process.env.VARIABLE_NAME and instruct the user to add them to the .env file.
6. Ensure all API routes have proper error handling (try/catch) and return NextResponse.json() with appropriate HTTP status codes."

═══════════════════════════════════════════════════════════════════════════
2. WEBCONTAINER BACKEND CONFIGURATION (lib/services/webcontainer.ts)
═══════════════════════════════════════════════════════════════════════════
Update the WebContainer setup to support backend execution:

1. When mounting files, ensure the WebContainer correctly handles `.env` and `.env.local` files.
2. Update the `installDependencies` and `startDevServer` logic to run database migrations automatically. 
   - Add a step to run `npx prisma generate` and `npx prisma db push` after `npm install` if a `prisma/schema.prisma` file exists.
3. Ensure that `console.log` statements from Server Actions and API Routes are captured and displayed in the Terminal component.

═══════════════════════════════════════════════════════════════════════════
3. NEW COMPONENT: ENVIRONMENT VARIABLES MANAGER
═══════════════════════════════════════════════════════════════════════════
Create a new UI component to manage backend environment variables.

File: components/settings/EnvManager.tsx
Features:
- A modal or slide-over panel that lists all environment variables.
- Allow the user to add, edit, and delete keys (e.g., DATABASE_URL, OPENAI_API_KEY).
- When the user saves, automatically update the virtual `.env.local` file in the Zustand store and trigger a WebContainer file sync so the backend restarts with the new variables.
- Add a "Lock" icon next to sensitive keys to mask the values.

File: components/layout/Header.tsx (Update)
- Add a "Settings" or "Env Vars" button in the top right header that opens the EnvManager.

═══════════════════════════════════════════════════════════════════════════
4. BACKEND FILE PARSING & SYNCING
═══════════════════════════════════════════════════════════════════════════
Update the file parsing logic in lib/store/useFileStore.ts and the chat API:

1. Ensure the file tree explorer correctly groups backend files (e.g., folders like `app/api`, `lib`, `prisma`, `src/server`).
2. Add syntax highlighting support in Monaco Editor for Prisma (`.prisma`), SQL (`.sql`), and Shell (`.sh`) files.
3. When the AI generates a Server Action (a file with `'use server'` at the top), ensure the file is saved correctly and the preview hot-reloads without breaking the client-side hydration.

═══════════════════════════════════════════════════════════════════════════
5. TERMINAL & LOGGING UPGRADES
═══════════════════════════════════════════════════════════════════════════
Update components/terminal/Terminal.tsx:

1. Differentiate between frontend build logs and backend runtime logs.
2. If an API route throws an error, format the stack trace nicely in the terminal so the user can debug it.
3. Add a "Clear Terminal" button.

═══════════════════════════════════════════════════════════════════════════
6. BACKEND PROJECT TEMPLATES
═══════════════════════════════════════════════════════════════════════════
Add a new template to lib/constants/templates.ts called 'fullstack-next-prisma'.
It should include:
- package.json with 'prisma', '@prisma/client', and 'better-sqlite3'.
- prisma/schema.prisma with a basic User model.
- lib/db.ts with a singleton PrismaClient.
- app/api/users/route.ts with GET and POST methods to test the database.

═══════════════════════════════════════════════════════════════════════════
IMPLEMENTATION INSTRUCTIONS:
1. Do not rewrite the entire app. Only update the specific files mentioned above.
2. Show me the updated code for `app/api/chat/route.ts` (System Prompt).
3. Show me the updated code for `lib/services/webcontainer.ts` (DB migration logic).
4. Create the new `components/settings/EnvManager.tsx` component.
5. Update the Zustand store to handle `.env` files properly.
6. Ensure all new UI components match the existing dark slate theme.

Start by updating the AI System Prompt and the WebContainer service, then build the Env Manager UI.
