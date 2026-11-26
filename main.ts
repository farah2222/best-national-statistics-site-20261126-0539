// NusaStat entry program: copies app/ and screenshots/ from this
// repository into the output directory and writes dossier.json there
// with buildDossier from vendor/makefun-frontend.ts. Node 22, standard
// library only. Run twice; both runs write the same bytes.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function copyTree(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src).sort()) {
    const from = join(src, name);
    const to = join(dest, name);
    const st = statSync(from);
    if (st.isDirectory()) {
      copyTree(from, to);
    } else if (st.isFile()) {
      cpSync(from, to);
    }
  }
}

function listFiles(dir: string, base: string, out: string[]): void {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) listFiles(p, base + name + '/', out);
    else if (st.isFile()) out.push(base + name + ' (' + st.size + ' bytes)');
  }
}

// Verify the output directory: every file we meant to write is there,
// and print the inventory with byte counts for the run log.
function verifyOutput(outDir: string): void {
  const files: string[] = [];
  listFiles(outDir, '', files);
  const dossier = join(outDir, 'dossier.json');
  if (!existsSync(dossier)) throw new Error('main.ts: verification failed — dossier.json was not written');
  if (!existsSync(join(outDir, 'app', 'index.html'))) throw new Error('main.ts: verification failed — app/index.html was not copied');
  if (files.length < 3) throw new Error('main.ts: verification failed — only ' + files.length + ' files in output');
  console.log('main.ts: wrote ' + files.length + ' files to ' + outDir);
  for (const f of files) console.log('  ' + f);
}

function main(): void {
  const appDir = join(repoDir, 'app');
  const shotsDir = join(repoDir, 'screenshots');
  if (!existsSync(appDir)) throw new Error('main.ts: app/ is missing from ' + repoDir);
  // Refuse to hand in a site with no entry page: a dossier built without
  // index.html would be refused by the gate anyway, so fail loudly here.
  if (!existsSync(join(appDir, 'index.html'))) {
    throw new Error('main.ts: app/index.html is missing from ' + repoDir + ' — refusing to build a dossier without an entry page');
  }
  if (!existsSync(shotsDir)) throw new Error('main.ts: screenshots/ is missing from ' + repoDir);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  copyTree(appDir, join(outDir, 'app'));
  copyTree(shotsDir, join(outDir, 'screenshots'));
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
    app_path_max_bytes: 1000,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
  verifyOutput(outDir);
}

main();
