#!/usr/bin/env node
/**
 * commands.json → website/src/data/terminal-responses.json
 * Builds kapitan/short → posix lookup and TR_CMDS mock responses.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const COMMANDS_PATH = join(ROOT, 'packages/commands/commands.json');
const OUT_PATH = join(ROOT, 'website/src/data/terminal-responses.json');

const catalog = JSON.parse(readFileSync(COMMANDS_PATH, 'utf8'));

/** Flatten grouped commands into a single array. */
function flattenCommands(groups) {
  return groups.flatMap((g) =>
    g.commands.map((cmd) => ({ ...cmd, group: g.key, groupLabel: g.label }))
  );
}

const commands = flattenCommands(catalog.groups);

/** kapitan / short → posix lookup */
function buildLookup(commands) {
  const lookup = {};
  for (const cmd of commands) {
    lookup[cmd.kapitan] = { posix: cmd.posix, type: 'kapitan', group: cmd.group };
    lookup[cmd.short] = { posix: cmd.posix, type: 'short', group: cmd.group };
    // Also allow posix first-token as key for multi-word posix (e.g. "apt install")
    const posixKey = cmd.posix.split(/\s+/)[0];
    if (!lookup[posixKey] || lookup[posixKey].posix === cmd.posix) {
      lookup[posixKey] = { posix: cmd.posix, type: 'posix', group: cmd.group };
    }
  }
  return lookup;
}

/** Custom mock outputs keyed by posix command */
const MOCK_BY_POSIX = {
  ls: [
    'rapor.docx · 12 KB · 17/05',
    'sunum.pptx · 4.1 MB · dün',
    'notlar.md · 3 KB · 09:14',
    'projeler/ · klasör',
  ],
  uname: [
    'KAPiTaN OS 0.1.0-alpha — önizleme',
    'Çekirdek: 6.8.0-kapitan',
    'Bellek: 14.2/16 GB · CPU: %23',
  ],
  cd: ['dizin değiştirildi → /ev/sen/projeler'],
  pwd: ['/ev/sen'],
  'ip a': ['arayüz: wlan0 · etkin', 'IP: 192.168.1.42', 'hız: 145 Mbps · gecikme: 8 ms'],
  'apt install': ['kullanım: kur <paket-adı>', 'örnek: kur kod-duzenleyici-pro'],
  'apt search': [
    'arama: "kod" — 3 sonuç',
    '  1. KodDüzenleyici Pro ★4.9',
    '  2. KodDüzenleyici Lite ★4.3',
    '  3. KodAna ★4.1',
  ],
  date: [new Date().toLocaleString('tr-TR')],
  '—': ['KAPiTaN AI: Lütfen sorunuzu komuttan sonra yazın.', 'örnek: sor "neden Türkçe?"'],
};

function mockForCommand(cmd) {
  if (MOCK_BY_POSIX[cmd.posix]) return MOCK_BY_POSIX[cmd.posix];
  if (cmd.posix.startsWith('git ')) {
    return [`[simülasyon] ${cmd.kapitan} → ${cmd.posix}`, `  ${cmd.description}`];
  }
  return [`[simülasyon] ${cmd.kapitan} (${cmd.short}) → ${cmd.posix}`, `  ${cmd.description}`];
}

/** Deprecated alias redirect messages */
const DEPRECATED = {
  pazarara: 'tara',
  pza: 'tara',
  git: null, // special message
  gt: 'gir',
  klasörsil: 'sök',
  klss: 'sök',
  uzakkopyala: 'aktar',
  uzk: 'aktar',
  yeniden: 'yenile',
};

function deprecatedResponse(alias) {
  if (alias === 'git' || alias === 'gt') {
    return [
      '«git» artık cd için kullanılmıyor.',
      'Dizin için «gir» (gr), sürüm kontrolü için «durum» (dur) kullanın.',
    ];
  }
  const replacement = DEPRECATED[alias];
  if (replacement) {
    return [`«${alias}» kaldırıldı. Bunun yerine «${replacement}» kullanın.`];
  }
  return null;
}

function buildYardim(commands, totalCommands) {
  const featured = [
    ['listele', 'lst'],
    ['sistem', 'sis'],
    ['yardım', null],
    ['tara', 'tr'],
    ['sor', 'sr'],
    ['temizle', 'tmz'],
    ['gir', 'gr'],
  ];
  const line = featured
    .map(([k, s]) => (s ? `${k} (${s})` : k))
    .join(' · ');
  return [
    'kullanılabilir komutlar:',
    `  ${line}`,
    '',
    `tam liste: /komutlar (${totalCommands} komut) — belgeler: /belgeler`,
  ];
}

function buildTrCmds(commands, lookup) {
  const trCmds = {};
  const posixResponses = {};

  for (const cmd of commands) {
    const response = mockForCommand(cmd);
    posixResponses[cmd.posix] = response;
    trCmds[cmd.kapitan] = response;
    trCmds[cmd.short] = response;
  }

  // Meta shell commands (not in commands.json)
  const yardim = buildYardim(commands, catalog.meta.totalCommands);
  trCmds.yardım = yardim;
  trCmds.yardim = yardim;
  trCmds.temizle = ['__clear__'];
  trCmds.tmz = ['__clear__'];

  // Deprecated aliases → redirect
  for (const [alias, replacement] of Object.entries(DEPRECATED)) {
    const msg = deprecatedResponse(alias);
    if (msg) trCmds[alias] = msg;
  }

  return { trCmds, posixResponses, lookup };
}

const lookup = buildLookup(commands);
const { trCmds, posixResponses } = buildTrCmds(commands, lookup);

const output = {
  version: catalog.version,
  source: 'packages/commands/commands.json',
  generated_at: new Date().toISOString(),
  totalCommands: catalog.meta.totalCommands,
  lookup,
  posixResponses,
  tr_cmds: trCmds,
  quick: ['sistem', 'listele', 'tara', 'yardım', 'temizle'],
};

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');

console.log(`✓ ${OUT_PATH}`);
console.log(`  ${Object.keys(trCmds).length} TR_CMDS keys from ${catalog.meta.totalCommands} commands`);