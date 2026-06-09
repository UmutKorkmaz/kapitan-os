import raw from '../../../build/editions.json';

export type EditionAccent = 'crimson' | 'saffron' | 'jade';

export interface Edition {
  id: string;
  no: string;
  name: string;
  slug: string;
  accent: EditionAccent;
  tagline: string;
  lede: string;
  requirements: {
    ramMinGb: number;
    ramMinLabel: string;
    ramRecommendedGb?: number;
    ramRecommendedLabel?: string;
    diskMinGb: number;
    diskMinLabel: string;
    arch: string[];
  };
  apps: string;
  cmdMetapackage: string;
  edition_command_target: number;
  commandCount: number | null;
  bootTime: string;
  features: Record<string, unknown>;
  iso: {
    filename: string;
    sizeBytes: number | null;
    sizeLabel: string | null;
    available: boolean;
  };
  marketing: {
    showDownloadCta: boolean;
    downloadLabel: string;
  };
  [key: string]: unknown;
}

export interface CompareRow {
  key: string;
  label: string;
  resolver?: string;
  aspirational?: boolean;
  gelistirici: string | number;
  ofis: string | number;
  bar: string | number;
}

const ACCENT_MAP: Record<EditionAccent, { acc: string; accSoft: string }> = {
  crimson: { acc: 'var(--crimson)', accSoft: 'rgba(200,16,46,0.08)' },
  saffron: { acc: 'var(--saffron)', accSoft: 'rgba(232,178,62,0.08)' },
  jade: { acc: 'var(--jade)', accSoft: 'rgba(63,142,99,0.08)' },
};

export const osVersion = raw.osVersion;
export const channel = raw.channel;
export const editions = raw.editions as Edition[];
export const compareRows = raw.compareRows as CompareRow[];

/** UI card shape used by Surumler edition cards and quiz */
export function toEditionCard(e: Edition) {
  const { acc, accSoft } = ACCENT_MAP[e.accent];
  return {
    no: e.no,
    name: e.name,
    acc,
    accSoft,
    to: e.slug,
    lede: e.lede,
    ram: e.requirements.ramMinLabel,
    disk: e.requirements.diskMinLabel,
    apps: e.apps,
    cmd: e.cmdMetapackage,
    edition_command_target: e.edition_command_target,
    id: e.id,
  };
}

export const editionCards = editions.map(toEditionCard);

export function getEditionById(id: string): Edition | undefined {
  return editions.find((e) => e.id === id);
}

/** Format aspirational command targets with mandatory "hedef" label */
export function formatCommandTarget(value: number | string | null | undefined): string {
  if (value == null) return '—';
  return `${value} hedef`;
}

/** Resolve compare table cell; aspirational rows get "hedef" suffix */
export function formatCompareCell(row: CompareRow, editionId: 'gelistirici' | 'ofis' | 'bar'): string {
  const value = row[editionId];
  if (row.aspirational && typeof value === 'number') {
    return formatCommandTarget(value);
  }
  return String(value ?? '—');
}

/** Compare rows as [label, gel, ofi, bar] tuples for CompareTable */
export function getCompareTableRows(): [string, string, string, string][] {
  return compareRows.map((row) => [
    row.label,
    formatCompareCell(row, 'gelistirici'),
    formatCompareCell(row, 'ofis'),
    formatCompareCell(row, 'bar'),
  ]);
}

/** Quiz winner key → edition card */
export const quizEditionMap: Record<'gel' | 'ofi' | 'bar', ReturnType<typeof toEditionCard>> = {
  gel: editionCards[0],
  ofi: editionCards[1],
  bar: editionCards[2],
};