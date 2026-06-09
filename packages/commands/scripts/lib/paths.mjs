import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to packages/commands */
export const PACKAGE_ROOT = path.resolve(__dirname, '../..');

/** Absolute path to monorepo root */
export const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../..');

export const DEFAULT_PATHS = {
  commandsJson: path.join(PACKAGE_ROOT, 'commands.json'),
  commandPlanMd: path.join(REPO_ROOT, 'docs/command-plan.md'),
  commandPlanSyncMd: path.join(REPO_ROOT, 'docs/command-plan-sync.md'),
  aliasesSh: path.join(REPO_ROOT, 'packages/kapitan-sh/generated/aliases.sh'),
};

export function resolvePath(input, fallback) {
  if (!input) return fallback;
  return path.isAbsolute(input) ? input : path.resolve(REPO_ROOT, input);
}