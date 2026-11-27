// NusaStat entry program: copies app/ and screenshots/ from this repository into the output directory and writes dossier.json there with buildDossier from vendor/makefun-frontend.ts. Node 22, standard library only. Run twice; both runs write the same bytes.

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function copyTree(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyTree(from, to);
    } else {
      copyFileSync(from, to);
    }
  }
}

function listFiles(dir: string, base: string): { rel: string; bytes: number }[] {
  const found: { rel: string; bytes: number }[] = [];
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...listFiles(full, base));
    } else {
      found.push({ rel: relative(base, full).split(sep).join('/'), bytes: statSync(full).size });
    }
  }
  return found;
}

function main(): void {
  const appDir = join(repoDir, 'app');
  const screenshotsDir = join(repoDir, 'screenshots');
  if (!existsSync(appDir)) {
    throw new Error(`main.ts: app/ is missing from ${repoDir}`);
  }
  if (!existsSync(join(appDir, 'index.html'))) {
    throw new Error(`main.ts: app/index.html is missing from ${repoDir} — refusing to build a dossier without an entry page`);
  }
  if (!existsSync(screenshotsDir)) {
    throw new Error(`main.ts: screenshots/ is missing from ${repoDir}`);
  }

  // Prepare the output directory without removing the directory itself.
  // The grader bind-mounts the output directory, and recursively removing
  // a mount point fails with EBUSY before anything is written, which is
  // what failed round 1. Clearing each entry inside it instead leaves the
  // mount point in place and produces the same empty directory.
  mkdirSync(outputDir, { recursive: true });
  for (const entry of readdirSync(outputDir)) {
    rmSync(join(outputDir, entry), { recursive: true, force: true });
  }

  copyTree(appDir, join(outputDir, 'app'));
  copyTree(screenshotsDir, join(outputDir, 'screenshots'));

  const dossier = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
    app_path_max_bytes: 1000,
  });
  writeFileSync(join(outputDir, 'dossier.json'), dossier);

  if (!existsSync(join(outputDir, 'dossier.json'))) {
    throw new Error('main.ts: verification failed — dossier.json was not written');
  }
  if (!existsSync(join(outputDir, 'app', 'index.html'))) {
    throw new Error('main.ts: verification failed — app/index.html was not copied');
  }
  const files = listFiles(outputDir, outputDir);
  if (files.length < 3) {
    throw new Error(`main.ts: verification failed — only ${files.length} files in output`);
  }
  console.log(`main.ts: wrote ${files.length} files to ${outputDir}`);
  for (const file of files) {
    console.log(`  ${file.rel} (${file.bytes} bytes)`);
  }
}

main();
