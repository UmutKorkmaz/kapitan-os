#!/usr/bin/env node
/**
 * Migrate legacy src/*.jsx pages into website/src/pages/ with ES module imports.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'website/src/pages');

const PAGE_IMPORTS = {
  Home: {
    react: ['useState', 'useEffect'],
    shell: ['Link', 'SectionHead'],
    ornaments: ['MandalaBg', 'StarSeal', 'HexRosette', 'Tugra', 'CornerOrnament'],
    interactive: ['LiveTerminal', 'AIPrompt', 'DraggableWindow'],
  },
  Gelistirici: {
    shell: ['Link', 'PageHead', 'SectionHead'],
    ornaments: ['MandalaBg', 'TileBand', 'SectionOrnament'],
    interactive: ['AIPrompt', 'LiveTerminal'],
    data: [{ from: '@data/editions', names: ['getEditionById'] }],
  },
  Ofis: {
    shell: ['Link', 'PageHead', 'SectionHead'],
    ornaments: ['MandalaBg', 'TileBand'],
    data: [{ from: '@data/editions', names: ['getEditionById'] }],
  },
  Pazar: {
    react: ['useState', 'useEffect'],
    shell: ['Link', 'SectionHead', 'Term'],
    ornaments: ['MandalaBg'],
  },
  Komutlar: {
    react: ['useState'],
    shell: ['Link', 'PageHead', 'SectionHead'],
    ornaments: ['MandalaBg'],
    interactive: ['LiveTerminal'],
    data: [{ from: '@data/commands', names: ['commands', 'countByGroup', 'aspirationalTarget'] }],
  },
  Belgeler: {
    react: ['useState', 'useEffect'],
    shell: ['Link', 'PageHead'],
    ornaments: ['MandalaBg'],
  },
  Topluluk: {
    shell: ['PageHead', 'SectionHead'],
    ornaments: ['MandalaBg'],
  },
  Hakkinda: {
    react: ['useState', 'useEffect'],
    shell: ['Link', 'PageHead', 'SectionHead'],
    ornaments: ['MandalaBg', 'TileBand', 'SectionOrnament'],
    data: [{ from: '@data/editions', names: ['editionCards', 'osVersion'] }],
  },
};

function buildImportBlock(name, cfg) {
  const lines = [];
  if (cfg.react?.length) {
    lines.push(`import { ${cfg.react.join(', ')} } from 'react';`);
  }
  if (cfg.shell?.length) {
    lines.push(`import { ${cfg.shell.join(', ')} } from '../components/Shell';`);
  }
  if (cfg.ornaments?.length) {
    lines.push(`import { ${cfg.ornaments.join(', ')} } from '../components/Ornaments';`);
  }
  if (cfg.interactive?.length) {
    lines.push(`import { ${cfg.interactive.join(', ')} } from '../components/Interactive';`);
  }
  for (const d of cfg.data ?? []) {
    lines.push(`import { ${d.names.join(', ')} } from '${d.from}';`);
  }
  return lines.join('\n');
}

function migratePage(name) {
  const srcPath = path.join(SRC, `${name}.jsx`);
  if (!fs.existsSync(srcPath)) {
    console.warn(`skip ${name}: ${srcPath} not found`);
    return;
  }
  const outPath = path.join(OUT, `${name}.jsx`);
  if (fs.existsSync(outPath)) {
    console.warn(`skip ${name}: already exists at ${outPath}`);
    return;
  }

  let body = fs.readFileSync(srcPath, 'utf8');
  // Drop legacy window export
  body = body.replace(/\nwindow\.\w+\s*=\s*\w+;\s*$/m, '\n');
  // Drop leading comment block if present (keep content)
  body = body.replace(/^\/\*[\s\S]*?\*\/\s*\n/, (m) => m);

  const cfg = PAGE_IMPORTS[name];
  if (!cfg) {
    console.warn(`skip ${name}: no import config`);
    return;
  }

  const fnMatch = body.match(new RegExp(`function ${name}\\s*\\(`));
  if (!fnMatch) {
    console.error(`Could not find function ${name} in ${srcPath}`);
    process.exit(1);
  }
  body = body.replace(`function ${name}(`, `export default function ${name}(`);

  const header = body.match(/^\/\*[\s\S]*?\*\/\s*\n/)?.[0] ?? `/* ${name} */\n\n`;
  const rest = body.slice(header.length);

  const output = `${header}${buildImportBlock(name, cfg)}\n\n${rest}`;
  fs.writeFileSync(outPath, output);
  console.log(`migrated ${name} -> ${outPath}`);
}

const pages = process.argv.slice(2);
if (!pages.length) {
  console.error('Usage: node migrate-page.mjs Home Gelistirici ...');
  process.exit(1);
}
for (const p of pages) migratePage(p);