#!/usr/bin/env node
/**
 * KAPiTaN OS — commands.json validator (F0)
 *
 * Checks:
 *  - JSON Schema validity (ajv)
 *  - Exactly 66 commands in 7 groups
 *  - Unique id, kapitan, and short aliases
 *  - cd → gir regression gate (never git)
 *  - git vs gir collision warnings
 */

import Ajv from 'ajv';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, '..');

const EXPECTED_COMMAND_COUNT = 66;
const EXPECTED_GROUP_COUNT = 7;
const GROUP_COUNTS = {
  dosya: 12,
  sistem: 12,
  ag: 8,
  paket: 7,
  metin: 10,
  git: 12,
  ai: 5,
};

function loadJson(filename) {
  const path = join(PKG_ROOT, filename);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function findDuplicates(values, label) {
  const seen = new Map();
  const duplicates = [];

  for (const { value, command } of values) {
    if (seen.has(value)) {
      duplicates.push({
        label,
        value,
        first: seen.get(value),
        second: command.id,
      });
    } else {
      seen.set(value, command.id);
    }
  }

  return duplicates;
}

function validateSchema(data, schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    return {
      ok: false,
      errors: validate.errors.map((e) => {
        const path = e.instancePath || '/';
        return `${path}: ${e.message}`;
      }),
    };
  }

  return { ok: true, errors: [] };
}

function validateCounts(data) {
  const errors = [];

  if (data.commands.length !== EXPECTED_COMMAND_COUNT) {
    errors.push(
      `Expected ${EXPECTED_COMMAND_COUNT} commands, found ${data.commands.length}`,
    );
  }

  if (data.groups.length !== EXPECTED_GROUP_COUNT) {
    errors.push(
      `Expected ${EXPECTED_GROUP_COUNT} groups, found ${data.groups.length}`,
    );
  }

  const groupKeys = new Set(data.groups.map((g) => g.key));
  for (const [key, count] of Object.entries(GROUP_COUNTS)) {
    const actual = data.commands.filter((c) => c.group === key).length;
    if (actual !== count) {
      errors.push(`Group '${key}': expected ${count} commands, found ${actual}`);
    }
    if (!groupKeys.has(key)) {
      errors.push(`Missing group definition for '${key}'`);
    }
  }

  for (const command of data.commands) {
    if (!groupKeys.has(command.group)) {
      errors.push(
        `Command '${command.id}' references unknown group '${command.group}'`,
      );
    }
  }

  return errors;
}

function validateUniqueness(commands) {
  const errors = [];

  const idDups = findDuplicates(
    commands.map((c) => ({ value: c.id, command: c })),
    'id',
  );
  const kapitanDups = findDuplicates(
    commands.map((c) => ({ value: c.kapitan, command: c })),
    'kapitan',
  );
  const shortDups = findDuplicates(
    commands.map((c) => ({ value: c.short, command: c })),
    'short',
  );

  for (const dup of [...idDups, ...kapitanDups, ...shortDups]) {
    errors.push(
      `Duplicate ${dup.label} '${dup.value}' on commands '${dup.first}' and '${dup.second}'`,
    );
  }

  return errors;
}

function validateCdGirRegression(commands) {
  const errors = [];
  const cd = commands.find((c) => c.posix === 'cd');

  if (!cd) {
    errors.push("No command with posix 'cd' found");
    return errors;
  }

  if (cd.kapitan !== 'gir') {
    errors.push(
      `cd must map to kapitan 'gir', found '${cd.kapitan}' (regression: old bug used 'git')`,
    );
  }

  if (cd.short !== 'gr') {
    errors.push(`cd short alias must be 'gr', found '${cd.short}'`);
  }

  if (cd.kapitan === 'git' || cd.short === 'git' || cd.short === 'gt') {
    errors.push(
      "cd must not use 'git' or 'gt' aliases — collides with Git VCS binary",
    );
  }

  const gitAliasOnCd = commands.find(
    (c) => c.posix === 'cd' && c.kapitan === 'git',
  );
  if (gitAliasOnCd) {
    errors.push("Regression: cd command still has kapitan 'git'");
  }

  const anyGitKapitan = commands.filter(
    (c) => c.kapitan === 'git' && c.posix !== 'cd',
  );
  for (const cmd of anyGitKapitan) {
    errors.push(
      `Command '${cmd.id}' uses kapitan 'git' — reserved for Git VCS; use distinct Turkish alias`,
    );
  }

  return errors;
}

function collectCollisionWarnings(commands) {
  const warnings = [];
  const cd = commands.find((c) => c.posix === 'cd');
  const gitCommands = commands.filter((c) => c.group === 'git');

  if (cd?.kapitan === 'gir') {
    warnings.push({
      severity: 'info',
      message:
        "cd → 'gir'/'gr' correctly avoids collision with Git VCS binary 'git'",
    });
  }

  const girCmd = commands.find((c) => c.kapitan === 'gir');
  if (girCmd && gitCommands.length > 0) {
    warnings.push({
      severity: 'warning',
      message:
        "'gir' (cd) and Git group commands coexist — shell must route 'git' POSIX binary via path_guard, never as cd alias",
    });
  }

  if (cd?.short === 'gr') {
    const grPrefixMatches = commands.filter(
      (c) =>
        c.id !== cd.id &&
        (c.kapitan?.startsWith('gr') || c.short?.startsWith('gr')),
    );
    for (const match of grPrefixMatches) {
      warnings.push({
        severity: 'warning',
        message: `Short prefix ambiguity: 'gr' (cd/gir) may share completion prefix with '${match.kapitan}'/'${match.short}' (${match.id})`,
      });
    }
  }

  const legacyGitAlias = commands.find(
    (c) => c.replaces?.kapitan === 'git' && c.posix === 'cd',
  );
  if (legacyGitAlias) {
    warnings.push({
      severity: 'info',
      message:
        "Legacy cd→git alias documented in 'replaces' field; ensure no runtime mapping remains",
    });
  } else if (cd && !cd.collision_warnings?.some((w) => w.conflicts_with === 'git')) {
    warnings.push({
      severity: 'warning',
      message:
        "cd command should document git collision in collision_warnings or replaces field",
    });
  }

  for (const cmd of commands) {
    if (cmd.collision_warnings?.length) {
      for (const w of cmd.collision_warnings) {
        warnings.push({
          severity: w.severity === 'critical' ? 'warning' : w.severity,
          message: `[${cmd.id}] ${w.message}`,
        });
      }
    }
  }

  const kapitanIndex = new Map();
  for (const cmd of commands) {
    kapitanIndex.set(cmd.kapitan, cmd.id);
  }

  const posixBinaryShadows = ['git', 'cd', 'ls', 'rm', 'cp', 'mv'];
  for (const cmd of commands) {
    if (
      posixBinaryShadows.includes(cmd.kapitan) &&
      cmd.posix !== cmd.kapitan &&
      !(cmd.group === 'git' && cmd.posix?.startsWith('git '))
    ) {
      warnings.push({
        severity: 'warning',
        message: `Command '${cmd.id}' kapitan '${cmd.kapitan}' shadows POSIX binary namespace`,
      });
    }
  }

  return warnings;
}

function main() {
  const errors = [];
  const warnings = [];

  let schema;
  let data;

  try {
    schema = loadJson('schema.json');
    data = loadJson('commands.json');
  } catch (err) {
    console.error('✗ Failed to load JSON files:', err.message);
    process.exit(1);
  }

  const schemaResult = validateSchema(data, schema);
  if (!schemaResult.ok) {
    errors.push(...schemaResult.errors.map((e) => `Schema: ${e}`));
  } else {
    console.log('✓ Schema validation passed');
  }

  errors.push(...validateCounts(data));
  errors.push(...validateUniqueness(data.commands));
  errors.push(...validateCdGirRegression(data.commands));
  warnings.push(...collectCollisionWarnings(data.commands));

  if (errors.length === 0) {
    console.log(`✓ Command count: ${data.commands.length}/${EXPECTED_COMMAND_COUNT}`);
    console.log(`✓ Group count: ${data.groups.length}/${EXPECTED_GROUP_COUNT}`);
    console.log('✓ All aliases unique (id, kapitan, short)');
    console.log("✓ cd → gir/gr regression gate passed");
  } else {
    console.error(`✗ ${errors.length} error(s):`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\n⚠ ${warnings.length} collision warning(s):`);
    for (const w of warnings) {
      console.log(`  [${w.severity}] ${w.message}`);
    }
  }

  if (errors.length > 0) {
    process.exit(1);
  }

  console.log('\n✓ commands.json validation complete');
  process.exit(0);
}

main();