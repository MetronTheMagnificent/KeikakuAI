import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Remove `import "rolldown"` from the server entry so Vercel serverless
// doesn't try to load rolldown's native bindings at runtime.
const serverDir = join(process.cwd(), 'dist', 'server');

function patchDir(dir) {
  try {
    const files = readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith('.mjs') && !file.endsWith('.js')) continue;
      const path = join(dir, file);
      const original = readFileSync(path, 'utf8');
      const patched = original.replace(/^import "rolldown";\n?/m, '');
      if (patched !== original) {
        writeFileSync(path, patched, 'utf8');
        console.log(`Patched: ${file}`);
      }
    }
  } catch {}
}

patchDir(serverDir);
patchDir(join(process.cwd(), '.vercel', 'output', 'functions', '_render.func', 'dist', 'server'));

console.log('Server patch complete.');
