#!/usr/bin/env node
/**
 * KAPiTaN OS — runtime commands.json generator
 *
 * Single source of truth:
 *   - packages/commands/commands.json          (language: ids, aliases, posix)
 *   - packages/commands/implemented-overlay.json (status: implemented[], path_guard[])
 *
 * Generates the runtime registry the shell + ISO load. This replaces the old
 * hand-maintained packages/kapitan-sh/data/commands.json fork (which had drifted
 * ids — ai-ask vs ai-sor — and an unvalidated path_guard). The ISO build copies
 * the same generated file, so there is exactly one runtime truth.
 *
 * Usage:
 *   node generate-runtime.mjs           # write the generated targets
 *   node generate-runtime.mjs --check   # exit 1 if any target is out of date
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, '..');
const REPO_ROOT = join(PKG_ROOT, '..', '..');

const CANONICAL = join(PKG_ROOT, 'commands.json');
const OVERLAY = join(PKG_ROOT, 'implemented-overlay.json');

// Every place that must carry the identical generated runtime registry.
const TARGETS = [
  join(REPO_ROOT, 'packages', 'kapitan-sh', 'data', 'commands.json'),
  join(
    REPO_ROOT,
    'build',
    'live-build',
    'config',
    'includes.chroot',
    'usr',
    'share',
    'kapitan',
    'commands.json'
  ),
];

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

function buildRuntime() {
  const canonical = readJson(CANONICAL);
  const overlay = readJson(OVERLAY);

  const ids = new Set(canonical.commands.map((c) => c.id));
  const implemented = new Set(overlay.implemented ?? []);

  // Guard: overlay ids must exist in the canonical catalog (catches typos that
  // would otherwise silently mark nothing implemented).
  const unknown = [...implemented].filter((id) => !ids.has(id));
  if (unknown.length) {
    throw new Error(
      `implemented-overlay.json references unknown command id(s): ${unknown.join(', ')}`
    );
  }

  const commands = canonical.commands.map((c) => ({
    id: c.id,
    posix: c.posix,
    kapitan: c.kapitan,
    short: c.short,
    description: c.description,
    group: c.group,
    phase: c.phase,
    implemented: implemented.has(c.id),
  }));

  return {
    _generated:
      'AUTO-GENERATED from packages/commands/commands.json + implemented-overlay.json by scripts/generate-runtime.mjs — DO NOT EDIT. Run `npm run generate:commands`.',
    version: canonical.version,
    locale: canonical.locale,
    groups: canonical.groups,
    commands,
    path_guard: overlay.path_guard ?? [],
  };
}

function main() {
  const check = process.argv.includes('--check');
  const runtime = buildRuntime();
  const text = JSON.stringify(runtime, null, 2) + '\n';

  let drift = false;
  for (const target of TARGETS) {
    let current = null;
    try {
      current = readFileSync(target, 'utf8');
    } catch {
      current = null;
    }
    if (current === text) continue;
    if (check) {
      drift = true;
      console.error(`✗ out of date: ${target}`);
    } else {
      writeFileSync(target, text);
      console.log(`✓ wrote ${target}`);
    }
  }

  if (check) {
    if (drift) {
      console.error(
        '\nRuntime registry is stale. Run `npm run generate:commands` and commit the result.'
      );
      process.exit(1);
    }
    console.log('✓ runtime registry up to date with SSOT + overlay');
  }
}

main();
