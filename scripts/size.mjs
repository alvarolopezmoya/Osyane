#!/usr/bin/env node
// Mide el tamaño de los chunks JS de dist/. Distingue:
//   🚀 Entry      — el chunk que el browser parsea en cuanto carga el HTML
//   📡 Preloaded  — chunks con <link rel="modulepreload"> (descargados pero NO parseados)
//   ⚡ Lazy       — chunks dynamic-imported, solo cuando el código los necesita
//
// El "First Parse" (lo que afecta TTI) es solo el Entry. Lo demás va por la red
// en paralelo y solo cuesta parse cuando se evalúa.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { gzipSync, brotliCompressSync, constants as zConst } from 'node:zlib';
import { join, basename } from 'node:path';

const DIST = './dist';
const ASSETS = './dist/assets';

if (!existsSync(ASSETS) || !existsSync(`${DIST}/index.html`)) {
  console.error(`✗ No existe ${DIST}/. Corre primero: npm run build`);
  process.exit(1);
}

// Parse index.html para detectar el entry y los modulepreloads.
const html = readFileSync(`${DIST}/index.html`, 'utf8');
const entryMatch = html.match(/<script[^>]+type="module"[^>]+src="\.?\/?(assets\/[^"]+\.js)"/);
const entryFile = entryMatch ? basename(entryMatch[1]) : null;

const preloadFiles = new Set();
for (const m of html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="\.?\/?(assets\/[^"]+\.js)"/g)) {
  preloadFiles.add(basename(m[1]));
}

function classify(name) {
  if (name === entryFile) return 'entry';
  if (preloadFiles.has(name)) return 'preload';
  return 'lazy';
}

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`.padStart(10);
}

const files = readdirSync(ASSETS)
  .filter((f) => f.endsWith('.js'))
  .map((f) => {
    const buf = readFileSync(join(ASSETS, f));
    return {
      name: f,
      raw: buf.length,
      gzip: gzipSync(buf, { level: 9 }).length,
      brotli: brotliCompressSync(buf, { params: { [zConst.BROTLI_PARAM_QUALITY]: 11 } }).length,
      kind: classify(f),
    };
  })
  .sort((a, b) => {
    // entry primero, luego preload, luego lazy por tamaño
    const order = { entry: 0, preload: 1, lazy: 2 };
    if (order[a.kind] !== order[b.kind]) return order[a.kind] - order[b.kind];
    return b.raw - a.raw;
  });

const ICON = { entry: '🚀', preload: '📡', lazy: '⚡' };

const headers = ['', 'Chunk', 'Raw', 'Gzip', 'Brotli', 'Tipo'];
const nameW = Math.max(20, ...files.map((f) => f.name.length));
const pad = (s, w) => s.padEnd(w);

console.log();
console.log(`   ${pad('Chunk', nameW)}  ${'Raw'.padStart(10)}  ${'Gzip'.padStart(10)}  ${'Brotli'.padStart(10)}  Tipo`);
console.log('─'.repeat(nameW + 56));
for (const f of files) {
  console.log(`${ICON[f.kind]}  ${pad(f.name, nameW)}  ${fmtKb(f.raw)}  ${fmtKb(f.gzip)}  ${fmtKb(f.brotli)}  ${f.kind}`);
}

const sum = (kind) => files
  .filter((f) => f.kind === kind)
  .reduce((acc, f) => ({ raw: acc.raw + f.raw, gzip: acc.gzip + f.gzip, brotli: acc.brotli + f.brotli }), { raw: 0, gzip: 0, brotli: 0 });

const entry = sum('entry');
const preload = sum('preload');
const lazy = sum('lazy');
const total = {
  raw: entry.raw + preload.raw + lazy.raw,
  gzip: entry.gzip + preload.gzip + lazy.gzip,
  brotli: entry.brotli + preload.brotli + lazy.brotli,
};

console.log('─'.repeat(nameW + 56));
console.log();
console.log('🚀 Entry chunk (lo que el browser PARSEA al abrir la app):');
console.log(`   ${fmtKb(entry.raw).trim().padEnd(10)} raw   ${fmtKb(entry.gzip).trim().padEnd(10)} gzip   ${fmtKb(entry.brotli).trim()} brotli`);
if (preload.gzip > 0) {
  console.log();
  console.log('📡 Modulepreloads (descargados pero NO parseados — solo afectan ancho de banda):');
  console.log(`   ${fmtKb(preload.raw).trim().padEnd(10)} raw   ${fmtKb(preload.gzip).trim().padEnd(10)} gzip   ${fmtKb(preload.brotli).trim()} brotli`);
}
console.log();
console.log('⚡ Lazy (solo se descargan/parsean cuando se necesitan):');
console.log(`   ${fmtKb(lazy.raw).trim().padEnd(10)} raw   ${fmtKb(lazy.gzip).trim().padEnd(10)} gzip   ${fmtKb(lazy.brotli).trim()} brotli`);
console.log();
console.log(`📦 Total dist/: ${fmtKb(total.gzip).trim()} gzip / ${fmtKb(total.brotli).trim()} brotli`);
console.log();
