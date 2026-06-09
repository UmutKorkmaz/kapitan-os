import fs from 'node:fs';

const BASH_BUILTINS = new Set(['cd', 'export', 'unset', 'source', 'alias', 'unalias']);

/**
 * Normalize commands.json into a flat command list and ordered groups.
 * Supports both v1.0.0 (turkish + flat commands[]) and Phase-1 (kapitan + nested groups).
 */
export function loadRegistry(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return normalizeRegistry(raw);
}

export function normalizeRegistry(raw) {
  const groups = normalizeGroups(raw);
  const commands = normalizeCommands(raw, groups);
  return {
    version: raw.version ?? raw.meta?.version ?? '0.0.0',
    source: raw.source ?? 'docs/command-plan.md',
    generatedAt: raw.generated_at ?? raw.meta?.updated ?? null,
    groups,
    commands,
  };
}

function normalizeGroups(raw) {
  const sourceGroups = raw.groups ?? [];
  return sourceGroups
    .map((group, index) => {
      const key = group.key ?? group.id;
      return {
        key,
        label: group.label_tr ?? group.label ?? key,
        labelEn: group.label_en ?? group.labelEn ?? null,
        glyph: group.glyph ?? '•',
        sortOrder: group.sort_order ?? group.order ?? index + 1,
        description: group.description_tr ?? group.description ?? null,
        commands: Array.isArray(group.commands) ? group.commands : null,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function normalizeCommands(raw, groups) {
  if (Array.isArray(raw.commands) && raw.commands.length > 0) {
    return raw.commands.map(normalizeCommand);
  }

  const nested = [];
  for (const group of groups) {
    if (!group.commands) continue;
    for (const command of group.commands) {
      nested.push(
        normalizeCommand({
          ...command,
          group: command.group ?? group.key,
        }),
      );
    }
  }
  return nested;
}

function normalizeCommand(command) {
  const posix = command.posix ?? null;
  const posixArgv = command.posix_argv ?? (posix ? posix.split(/\s+/) : []);
  const turkish = command.turkish ?? command.kapitan;
  const description =
    command.description_tr ?? command.description ?? command.summary ?? '';

  return {
    id: command.id ?? `${command.group}.${turkish}`,
    posix,
    posixArgv,
    turkish,
    short: command.short,
    group: command.group,
    description,
    descriptionEn: command.description_en ?? command.summary_long ?? null,
    riskTier: command.risk_tier ?? null,
    replaces: command.replaces ?? null,
    deprecated: Boolean(command.deprecated),
    editionAvailability: command.edition_availability ?? editionsToMap(command.editions),
  };
}

function editionsToMap(editions) {
  if (!Array.isArray(editions)) return null;
  return {
    bar: editions.includes('bar'),
    ofis: editions.includes('ofis'),
    gelistirici: editions.includes('gelistirici'),
  };
}

export function posixDispatch(posixArgv) {
  if (!posixArgv?.length) return null;
  const [first, ...rest] = posixArgv;
  const tail = rest.length ? ` ${rest.join(' ')}` : '';
  if (BASH_BUILTINS.has(first)) {
    return `builtin ${first}${tail}`.trim();
  }
  return `command ${posixArgv.join(' ')}`;
}

export function shellQuote(value) {
  if (/^[A-Za-z0-9_./:-]+$/.test(value)) return value;
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

export function assertNoCdGitRegression(commands) {
  const errors = [];
  const cd = commands.find((c) => c.posix === 'cd');
  if (!cd) {
    errors.push('cd command missing from registry');
  } else if (cd.turkish !== 'gir') {
    errors.push(`cd.turkish must be "gir", got "${cd.turkish}"`);
  } else if (cd.short !== 'gr') {
    errors.push(`cd.short must be "gr", got "${cd.short}"`);
  }

  const forbidden = commands.find((c) => c.posix === 'cd' && c.turkish === 'git');
  if (forbidden) {
    errors.push('FORBIDDEN: cd aliased to "git"');
  }

  return errors;
}