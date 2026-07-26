import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type {
  OgContributionInput,
  OgContributionUpdate,
} from '@/lib/og-contribution-schema';

const CSV_HEADERS = [
  'id',
  'submittedAt',
  'applicationId',
  'email',
  'applicantPost1',
  'applicantPost2',
  'invitee1Post1',
  'invitee1Post2',
  'invitee2Post1',
  'invitee2Post2',
  'consent',
  'source',
] as const satisfies ReadonlyArray<keyof OgContributionUpdate>;

let writeQueue: Promise<unknown> = Promise.resolve();

function getCsvPath() {
  return (
    process.env.OG_CONTRIBUTIONS_CSV_PATH ??
    path.join(process.cwd(), 'data', 'og-contribution-updates.csv')
  );
}

function escapeCsv(value: unknown) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function serializeRow(update: OgContributionUpdate) {
  return CSV_HEADERS.map((header) => escapeCsv(update[header])).join(',');
}

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const next = csv[index + 1];

    if (quoted && character === '"' && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      cell = '';
    } else {
      cell += character;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

async function readStoredCsv() {
  try {
    return await readFile(getCsvPath(), 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return '';
    }
    throw error;
  }
}

export async function readOgContributionUpdates() {
  const rows = parseCsv(await readStoredCsv());
  const [headers, ...records] = rows;

  if (!headers) {
    return [];
  }

  return records
    .map((record) => {
      const stored = Object.fromEntries(
        headers.map((header, index) => [header, record[index] ?? '']),
      );

      return {
        id: stored.id,
        submittedAt: stored.submittedAt,
        applicationId: stored.applicationId,
        email: stored.email,
        applicantPost1: stored.applicantPost1 || '',
        applicantPost2: stored.applicantPost2 || '',
        invitee1Post1: stored.invitee1Post1 || '',
        invitee1Post2: stored.invitee1Post2 || '',
        invitee2Post1: stored.invitee2Post1 || '',
        invitee2Post2: stored.invitee2Post2 || '',
        consent: 'yes' as const,
        source: stored.source || 'rocky-website',
      };
    })
    .filter((update) => update.id);
}

function serializeUpdates(updates: OgContributionUpdate[]) {
  const rows = updates.map(serializeRow);
  return `${CSV_HEADERS.join(',')}\n${rows.length ? `${rows.join('\n')}\n` : ''}`;
}

export async function getContributionUpdatesCsv() {
  return serializeUpdates(await readOgContributionUpdates());
}

export async function saveOgContributionUpdate(input: OgContributionInput) {
  const existingUpdates = await readOgContributionUpdates();
  const existing = existingUpdates.find(
    (update) => update.applicationId === input.applicationId,
  );
  const update: OgContributionUpdate = {
    id: existing?.id ?? `OG-UPD-${randomUUID().slice(0, 8).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
    applicationId: input.applicationId,
    email: input.email,
    applicantPost1: input.applicantPost1,
    applicantPost2: input.applicantPost2,
    invitee1Post1: input.invitee1Post1,
    invitee1Post2: input.invitee1Post2,
    invitee2Post1: input.invitee2Post1,
    invitee2Post2: input.invitee2Post2,
    consent: 'yes',
    source: input.source || 'rocky-website',
  };

  const writeOperation = writeQueue.then(async () => {
    const csvPath = getCsvPath();
    await mkdir(path.dirname(csvPath), { recursive: true });
    const currentUpdates = await readOgContributionUpdates();
    const nextUpdates = currentUpdates.filter(
      (current) => current.applicationId !== update.applicationId,
    );
    await writeFile(
      csvPath,
      serializeUpdates([...nextUpdates, update]),
      'utf8',
    );
  });

  writeQueue = writeOperation.catch(() => undefined);
  await writeOperation;

  return update;
}
