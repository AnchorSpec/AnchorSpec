#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import fg from 'fast-glob';

const replacements = [
  // Order matters: longest/most-specific first to avoid partial matches
  ['OPENSPEC', 'ANCHORSPEC'],
  ['OpenSpec', 'AnchorSpec'],
  ['openspec', 'anchorspec'],
  ['opsx', 'ansx'],
];

const files = await fg.glob('dist/**/*.js');

let totalReplacements = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  let content = original;

  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to);
  }

  if (content !== original) {
    writeFileSync(file, content);
    totalReplacements++;
  }
}

console.log(`Rebranded ${totalReplacements} file(s) in dist/`);
