import catalog from '../../../packages/commands/commands.json';

export const totalCommands =
  catalog.meta?.totalCommands ?? catalog.commands?.length ?? 66;

export const aspirationalTarget =
  catalog.meta?.aspirationalTarget ?? 218;

export const commands = catalog.commands ?? [];

export const countByGroup = Object.fromEntries(
  (catalog.groups ?? []).map((g) => [
    g.key,
    commands.filter((c) => c.group === g.key).length,
  ]),
);