import { WebContainer } from '@webcontainer/api';
import type { File } from '@/types';

let webcontainerInstance: WebContainer | null = null;

export async function initWebContainer() {
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot();
  }
  return webcontainerInstance;
}

export async function mountFiles(files: File[]) {
  const container = await initWebContainer();
  
  // Create base directory structure
  await container.mount({
    'package.json': {
      file: {
        contents: JSON.stringify({
          name: 'ai-generated-app',
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
            '@prisma/client': '^5.13.0'
          }
        }, null, 2)
      }
    },
    '.env.local': {
      file: {
        contents: '# Environment variables\nDATABASE_URL="file:./dev.db"\n'
      }
    }
  });

  // Mount user files
  const fileTree: any = {};
  for (const file of files) {
    const parts = file.path.split('/');
    let current = fileTree;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = { directory: {} };
      }
      current = current[part].directory;
    }
    current[parts[parts.length - 1]] = {
      file: { contents: file.content }
    };
  }

  await container.mount(fileTree);
}

export async function installDependencies() {
  const container = await initWebContainer();
  
  const installProcess = await container.spawn('npm', ['install']);
  
  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log('[npm install]', data);
      }
    })
  );

  const exitCode = await installProcess.exit;
  
  // Run Prisma migrations if schema exists
  if (exitCode === 0) {
    try {
      const prismaGenerate = await container.spawn('npx', ['prisma', 'generate']);
      await prismaGenerate.exit;
      
      const prismaDbPush = await container.spawn('npx', ['prisma', 'db', 'push', '--accept-data-loss']);
      await prismaDbPush.exit;
    } catch (e) {
      console.log('Prisma migration skipped (no schema)');
    }
  }

  return exitCode === 0;
}

export async function startDevServer() {
  const container = await initWebContainer();
  
  // Start the dev server
  const httpServer = await container.spawn('npm', ['run', 'dev'], {
    env: {
      NODE_ENV: 'development'
    }
  });

  httpServer.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log('[dev server]', data);
      }
    })
  );

  // Wait for the server to be ready
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    url: `https://${await container.hostname}-3000.${await container.workspace}/`,
    port: 3000
  };
}

export async function getContainerLogs(): Promise<string[]> {
  // In a real implementation, this would capture logs from the running processes
  return [];
}

export async function stopDevServer() {
  // In a real implementation, this would kill the running process
  if (webcontainerInstance) {
    await webcontainerInstance.teardown();
    webcontainerInstance = null;
  }
}
