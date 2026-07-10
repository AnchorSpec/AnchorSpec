#!/usr/bin/env node
/**
 * scripts/rebrand.js — deterministic AnchorSpec rebrand
 *
 * Transforms upstream OpenSpec content into AnchorSpec-branded output:
 *   1. Text replacements  — across dist JS, docs Markdown, and README
 *   2. Structural patches — README-specific blocks (telemetry section, social link)
 *      and docs-wide blocks (telemetry env vars / config example — text
 *      replacement alone can't remove content, only rename it, so docs that
 *      describe the telemetry we've actually deleted need an explicit patch
 *      or they keep telling users to "opt out" of telemetry that doesn't exist)
 *   3. File ops           — rename docs/opsx.md → docs/ansx.md; sync branded images
 *
 * Idempotent: safe to run on already-branded files.
 * Called automatically by build.js; also runnable standalone:
 *   node scripts/rebrand.js
 *
 * Sync workflow:
 *   git merge upstream/main   # accept upstream content
 *   pnpm build                # rebrands everything
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync, renameSync } from 'fs';
import fg from 'fast-glob';

// ─── Text replacements ────────────────────────────────────────────────────────
// Order matters: most-specific / longest patterns first.

const TEXT_REPLACEMENTS = [
  // npm package name and GitHub org paths (before generic casing replacements)
  ['@fission-ai/openspec',       'anchorspec'],
  ['github:Fission-AI/OpenSpec', 'github:AnchorSpec/AnchorSpec'],
  ['Fission-AI/OpenSpec',        'AnchorSpec/AnchorSpec'],
  ['Fission-AI/openspec',        'AnchorSpec/AnchorSpec'],
  // Env-var prefix
  ['OPENSPEC_',  'ANCHORSPEC_'],
  // Case variants (ALL-CAPS before Title before lower)
  ['OPENSPEC',   'ANCHORSPEC'],
  ['OpenSpec',   'AnchorSpec'],
  ['openspec',   'anchorspec'],
  // Workflow skill prefix (covers /opsx:, opsx-, opsx/, opsx.md, OPSX, etc.)
  ['OPSX',  'ANSX'],
  ['opsx',  'ansx'],
];

function applyText(content) {
  for (const [from, to] of TEXT_REPLACEMENTS) {
    content = content.replaceAll(from, to);
  }
  return content;
}

// ─── README structural patches ────────────────────────────────────────────────
// Matched against post-text-replacement content (already branded).
// The telemetry patch injects ATTRIBUTION_SENTINEL; processReadme resolves it.

// This string is the single upstream attribution kept in the final README.
// It intentionally references the upstream project by name and URL.
// The protect/restore mechanism in processReadme shields it from text replacement.
const UPSTREAM_ATTRIBUTION =
  'AnchorSpec has no telemetry. ' +
  'It is an MIT-licensed fork of [OpenSpec](https://github.com/Fission-AI/OpenSpec) ' +
  'with all PostHog instrumentation removed.';

// Null-byte sentinel: passes through text replacement unchanged.
const ATTRIBUTION_SENTINEL = '\x00UPSTREAM_ATTR\x00';

const README_PATCHES = [
  // Remove upstream maintainer social link (not relevant to the fork)
  {
    from: '<p align="center">\n  Follow <a href="https://x.com/0xTab">@0xTab on X</a> for updates · Join the <a href="https://discord.gg/YctCnvvshC">AnchorSpec Discord</a> for help and questions.\n</p>',
    to: '',
  },
  // Replace telemetry section. Uses sentinel so the attribution URL survives
  // repeated text-replacement passes (resolved to UPSTREAM_ATTRIBUTION below).
  {
    from: [
      '<details>',
      '<summary><strong>Telemetry</strong></summary>',
      '',
      'AnchorSpec collects anonymous usage stats.',
      '',
      'We collect only command names and version to understand usage patterns. No arguments, paths, content, or PII. Automatically disabled in CI.',
      '',
      '**Opt-out:** `export ANCHORSPEC_TELEMETRY=0` or `export DO_NOT_TRACK=1`',
      '',
      '</details>',
    ].join('\n'),
    to: [
      '<details>',
      '<summary><strong>Telemetry</strong></summary>',
      '',
      ATTRIBUTION_SENTINEL,
      '',
      '</details>',
    ].join('\n'),
  },
];

// ─── Docs-wide structural patches ─────────────────────────────────────────────
// Matched against post-text-replacement content. Unlike README_PATCHES, these
// apply to every docs/**/*.md file (whichever ones happen to contain the
// pattern) since upstream's telemetry references aren't confined to one file.

const DOCS_PATCHES = [
  // "Environment Variables" reference tables: drop the opt-out rows entirely
  // rather than rebrand them — there's no telemetry to opt out of.
  {
    from: '| `ANCHORSPEC_TELEMETRY` | Set to `0` to disable telemetry |\n| `DO_NOT_TRACK` | Set to `1` to disable telemetry (standard DNT signal) |\n',
    to: '',
  },
  // CLI example commands: swap the fictional telemetry.enabled key (rejected
  // by config-schema.ts's validateConfigKeyPath — not a real config field)
  // for a real one, so the docs stay runnable as well as accurate.
  {
    from: 'anchorspec config get telemetry.enabled',
    to: 'anchorspec config get profile',
  },
  {
    from: 'anchorspec config set telemetry.enabled false',
    to: 'anchorspec config set profile custom',
  },
];

function applyDocsPatches(content) {
  for (const { from, to } of DOCS_PATCHES) {
    content = content.replaceAll(from, to);
  }
  return content;
}

function processDocs(original) {
  return applyDocsPatches(applyText(original));
}

function processReadme(original) {
  let content = original;

  // Protect any already-present attribution from the text-replacement pass.
  // On first run this is a no-op (attribution not yet injected).
  // On subsequent runs it prevents [OpenSpec]/Fission-AI from being re-replaced.
  const hasAttr = content.includes(UPSTREAM_ATTRIBUTION);
  if (hasAttr) content = content.replace(UPSTREAM_ATTRIBUTION, ATTRIBUTION_SENTINEL);

  content = applyText(content);

  for (const { from, to } of README_PATCHES) {
    content = content.replaceAll(from, to);
  }

  // Resolve sentinel → final attribution (both for first-run injection and restore).
  content = content.replace(ATTRIBUTION_SENTINEL, UPSTREAM_ATTRIBUTION);

  return content;
}

// ─── File processing ──────────────────────────────────────────────────────────

let count = 0;

function processFile(file, transform) {
  const original = readFileSync(file, 'utf8');
  const content = transform(original);
  if (content !== original) {
    writeFileSync(file, content);
    count++;
  }
}

// dist JS (existing behavior)
for (const file of await fg.glob('dist/**/*.js')) {
  processFile(file, applyText);
}

// docs Markdown (rename opsx.md first so the glob catches it under the old name)
for (const file of await fg.glob('docs/**/*.md')) {
  processFile(file, processDocs);
}

// README with structural patches + attribution protect/restore
if (existsSync('README.md')) {
  processFile('README.md', processReadme);
}

// Rename docs/opsx.md → docs/ansx.md (after glob so content was processed above)
if (existsSync('docs/opsx.md')) {
  renameSync('docs/opsx.md', 'docs/ansx.md');
  console.log('Renamed docs/opsx.md → docs/ansx.md');
}

// Rename any dist file whose *name* contains "openspec" (e.g. openspec-root.ts
// compiling to openspec-root.js/.d.ts/.js.map/.d.ts.map). Text replacement above
// already rewrote the string inside every relative import that references such
// a file, but it can't rename the file on disk — so without this, a compiled
// module ends up importing a filename that no longer exists on disk (caught by
// scripts/pack-version-check.mjs the hard way once already; this makes it
// self-healing on future merges instead of a one-off fix).
for (const file of await fg.glob('dist/**/*openspec*')) {
  const renamed = file.replace(/openspec/g, 'anchorspec');
  if (renamed !== file) {
    renameSync(file, renamed);
    console.log(`Renamed ${file} → ${renamed}`);
  }
}

// Sync branded image copies (text replacement turns openspec_*.png → anchorspec_*.png)
const IMAGE_PAIRS = [
  ['assets/openspec_bg.png',        'assets/anchorspec_bg.png'],
  ['assets/openspec_dashboard.png', 'assets/anchorspec_dashboard.png'],
];
for (const [src, dest] of IMAGE_PAIRS) {
  if (existsSync(src)) copyFileSync(src, dest);
}

console.log(`Rebranded ${count} file(s).`);
