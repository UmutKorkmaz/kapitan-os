import { useMemo } from 'react';
import registry from '@kapitan/commands';

/**
 * Normalize commands.json into the row shape expected by Komutlar tables:
 * [posix, kapitan, short, description]
 */
function commandToRow(cmd) {
  const posix = cmd.posix == null ? '—' : cmd.posix;
  return [posix, cmd.kapitan, cmd.short, cmd.description];
}

/**
 * Build tab groups from the canonical SSOT catalog (flat commands + group metadata).
 */
export function buildCmdGroups() {
  const sortedGroups = [...registry.groups].sort((a, b) => a.order - b.order);

  return sortedGroups.map((group) => {
    const commands = registry.commands.filter((c) => c.group === group.key);
    return {
      key: group.key,
      label: group.label,
      glyph: group.glyph,
      count: commands.length,
      rows: commands.map(commandToRow),
    };
  });
}

export function getTotalCommandCount(cmdGroups) {
  return cmdGroups.reduce((sum, g) => sum + g.count, 0);
}

function matchesQuery(row, groupLabel, q) {
  const needle = q.toLowerCase();
  return (
    row[0].toLowerCase().includes(needle)
    || row[1].toLowerCase().includes(needle)
    || row[2].toLowerCase().includes(needle)
    || row[3].toLowerCase().includes(needle)
    || groupLabel.toLowerCase().includes(needle)
  );
}

export function searchCommands(cmdGroups, query) {
  if (!query.trim()) return null;
  const q = query.trim();
  return cmdGroups.flatMap((g) =>
    g.rows
      .filter((r) => matchesQuery(r, g.label, q))
      .map((r) => ({ row: r, group: g.label })),
  );
}

export default function useCommands() {
  const cmdGroups = useMemo(() => buildCmdGroups(), []);
  const totalCommands = useMemo(
    () => registry.meta?.totalCommands ?? getTotalCommandCount(cmdGroups),
    [cmdGroups],
  );

  return { cmdGroups, totalCommands, registry };
}