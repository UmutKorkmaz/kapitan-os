#!/usr/bin/env node
/**
 * Generate docs/command-plan-sync.md from packages/commands/commands.json.
 * Optional --check compares output with an existing file or docs/command-plan.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_PATHS, resolvePath } from './lib/paths.mjs';
import { loadRegistry } from './lib/registry.mjs';

function parseArgs(argv) {
  const options = {
    check: false,
    comparePlan: false,
    input: DEFAULT_PATHS.commandsJson,
    output: DEFAULT_PATHS.commandPlanSyncMd,
    plan: DEFAULT_PATHS.commandPlanMd,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--check') options.check = true;
    else if (arg === '--compare-plan') options.comparePlan = true;
    else if (arg === '--input') options.input = resolvePath(argv[++i], options.input);
    else if (arg === '--output') options.output = resolvePath(argv[++i], options.output);
    else if (arg === '--plan') options.plan = resolvePath(argv[++i], options.plan);
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      printHelp();
      process.exit(2);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node packages/commands/scripts/generate-md.mjs [options]

Options:
  --input <path>       commands.json (default: packages/commands/commands.json)
  --output <path>      Markdown output (default: docs/command-plan-sync.md)
  --plan <path>        Human plan for drift check (default: docs/command-plan.md)
  --check              Exit 1 if output differs from --output file on disk
  --compare-plan       Exit 1 if rows drift from docs/command-plan.md tables
  -h, --help           Show this help
`);
}

function renderMarkdown(registry) {
  const now = new Date().toISOString();
  const lines = [
    '# KAPiTaN OS — Komut Planı (Senkron)',
    '',
    '> Otomatik üretildi: `packages/commands/commands.json`',
    `> Kaynak: \`${registry.source}\``,
    `> Üretim: ${now}`,
    `> Sürüm: ${registry.version}`,
    '',
    'Bu dosya `commands.json` tek doğruluk kaynağından türetilir. Elle düzenlemeyin;',
    '`node packages/commands/scripts/generate-md.mjs` ile yeniden üretin.',
    '',
    '---',
    '',
  ];

  let groupNumber = 0;
  for (const group of registry.groups) {
    const rows = registry.commands.filter((c) => c.group === group.key);
    if (!rows.length) continue;

    groupNumber += 1;
    lines.push(`## Grup ${groupNumber} — ${group.label}`);
    lines.push('');
    if (group.description) {
      lines.push(`> ${group.description}`);
      lines.push('');
    }
    lines.push('Format: `[POSIX]` / `[Turkish alias]` / `[short]` / `[Türkçe açıklama]`');
    lines.push('');
    lines.push('| POSIX | KAPiTaN | Kısa | Açıklama |');
    lines.push('|-------|---------|------|----------|');

    for (const command of rows) {
      const posix = command.posix ?? '—';
      lines.push(
        `| \`${posix}\` | \`${command.turkish}\` | \`${command.short}\` | ${command.description} |`,
      );
    }

    lines.push('');
    lines.push(`**Toplam: ${rows.length} komut**`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('## Genel Toplam');
  lines.push('');
  lines.push('| Grup | Komut Sayısı |');
  lines.push('|------|-------------|');
  for (const group of registry.groups) {
    const count = registry.commands.filter((c) => c.group === group.key).length;
    if (!count) continue;
    lines.push(`| ${group.label} | ${count} |`);
  }
  lines.push(`| **Toplam** | **${registry.commands.length}** |`);
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function parsePlanTables(planText) {
  const rows = [];
  const lines = planText.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('| POSIX |')) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('| `')) {
      inTable = false;
      continue;
    }
    if (line.includes('---')) continue;

    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim().replace(/^`|`$/g, ''));

    if (cells.length < 4) continue;
    rows.push({
      posix: cells[0],
      turkish: cells[1],
      short: cells[2],
      description: cells[3],
    });
  }

  return rows;
}

function compareWithPlan(registry, planPath) {
  const planText = fs.readFileSync(planPath, 'utf8');
  const planRows = parsePlanTables(planText);
  const jsonRows = registry.commands
    .filter((c) => c.posix)
    .map((c) => ({
      posix: `\`${c.posix}\``,
      turkish: `\`${c.turkish}\``,
      short: `\`${c.short}\``,
      description: c.description,
    }));

  const errors = [];
  const planByPosix = new Map(planRows.map((row) => [row.posix, row]));

  for (const row of jsonRows) {
    const planRow = planByPosix.get(row.posix);
    if (!planRow) {
      errors.push(`commands.json has ${row.posix} but command-plan.md does not`);
      continue;
    }
    if (planRow.turkish !== row.turkish) {
      errors.push(`${row.posix}: turkish ${row.turkish} != plan ${planRow.turkish}`);
    }
    if (planRow.short !== row.short) {
      errors.push(`${row.posix}: short ${row.short} != plan ${planRow.short}`);
    }
  }

  if (planRows.length !== jsonRows.length) {
    errors.push(
      `row count mismatch: command-plan.md=${planRows.length}, commands.json=${jsonRows.length}`,
    );
  }

  return errors;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(options.input)) {
    console.error(`commands.json not found: ${options.input}`);
    process.exit(1);
  }

  const registry = loadRegistry(options.input);
  const markdown = renderMarkdown(registry);

  if (options.comparePlan) {
    if (!fs.existsSync(options.plan)) {
      console.error(`command-plan.md not found: ${options.plan}`);
      process.exit(1);
    }
    const drift = compareWithPlan(registry, options.plan);
    if (drift.length) {
      console.error('Drift detected against docs/command-plan.md:');
      for (const message of drift) console.error(`  - ${message}`);
      process.exit(1);
    }
    console.log('OK: commands.json matches docs/command-plan.md tables');
  }

  if (options.check) {
    if (!fs.existsSync(options.output)) {
      console.error(`Sync file missing (run generator first): ${options.output}`);
      process.exit(1);
    }
    const existing = fs.readFileSync(options.output, 'utf8');
    const normalize = (text) =>
      text.replace(/^> Üretim:.*$/m, '> Üretim: __TIMESTAMP__').trim();
    if (normalize(existing) !== normalize(markdown)) {
      console.error(`Out of sync: ${options.output}`);
      console.error('Run: node packages/commands/scripts/generate-md.mjs');
      process.exit(1);
    }
    console.log(`OK: ${path.relative(process.cwd(), options.output)} is up to date`);
    return;
  }

  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, markdown, 'utf8');
  console.log(
    `Wrote ${path.relative(process.cwd(), options.output)} (${registry.commands.length} commands)`,
  );
}

main();