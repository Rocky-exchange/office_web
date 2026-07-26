import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type {
  OgApplication,
  OgApplicationInput,
} from '@/lib/og-application-schema';

const CSV_HEADERS = [
  'id',
  'submittedAt',
  'status',
  'xHandle',
  'email',
  'xPostUrl',
  'walletPartyId',
  'plannedInvitee1Handle',
  'plannedInvitee1Type',
  'plannedInvitee2Handle',
  'plannedInvitee2Type',
  'experience',
  'consent',
  'source',
] as const satisfies ReadonlyArray<keyof OgApplication>;

let writeQueue: Promise<unknown> = Promise.resolve();

function getCsvPath() {
  return (
    process.env.OG_APPLICATIONS_CSV_PATH ??
    path.join(process.cwd(), 'data', 'og-applications.csv')
  );
}

function escapeCsv(value: unknown) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function serializeRow(application: OgApplication) {
  return CSV_HEADERS.map((header) => escapeCsv(application[header])).join(',');
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

export async function readOgApplications(): Promise<OgApplication[]> {
  const rows = parseCsv(await readStoredCsv());
  const [headers, ...records] = rows;

  if (!headers) {
    return [];
  }

  return records.map((record) => {
    const stored = Object.fromEntries(
        headers.map((header, index) => [header, record[index] ?? '']),
      );

    return {
      id: stored.id,
      submittedAt: stored.submittedAt,
      status: (stored.status || 'pending') as OgApplication['status'],
      xHandle: stored.xHandle,
      email: stored.email,
      xPostUrl: stored.xPostUrl || '',
      walletPartyId: stored.walletPartyId || '',
      plannedInvitee1Handle: stored.plannedInvitee1Handle || '',
      plannedInvitee1Type: stored.plannedInvitee1Type || '',
      plannedInvitee2Handle: stored.plannedInvitee2Handle || '',
      plannedInvitee2Type: stored.plannedInvitee2Type || '',
      experience: stored.experience || stored.motivation || '',
      consent: 'yes' as const,
      source: stored.source || 'rocky-website',
    };
  }).filter((application) => application.id);
}

function serializeApplications(applications: OgApplication[]) {
  const rows = applications.map(serializeRow);
  return `${CSV_HEADERS.join(',')}\n${rows.length ? `${rows.join('\n')}\n` : ''}`;
}

export async function getApplicationsCsv() {
  return serializeApplications(await readOgApplications());
}

export async function saveOgApplication(input: OgApplicationInput) {
  const application: OgApplication = {
    id: `OG-APP-${randomUUID().slice(0, 8).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
    xHandle: input.xHandle.startsWith('@')
      ? input.xHandle
      : `@${input.xHandle}`,
    email: input.email,
    xPostUrl: input.xPostUrl,
    walletPartyId: input.walletPartyId,
    plannedInvitee1Handle: input.plannedInvitee1Handle,
    plannedInvitee1Type: input.plannedInvitee1Type,
    plannedInvitee2Handle: input.plannedInvitee2Handle,
    plannedInvitee2Type: input.plannedInvitee2Type,
    experience: input.experience,
    consent: 'yes',
    source: input.source || 'rocky-website',
  };

  const writeOperation = writeQueue.then(async () => {
    const csvPath = getCsvPath();
    await mkdir(path.dirname(csvPath), { recursive: true });
    const applications = await readOgApplications();
    await writeFile(
      csvPath,
      serializeApplications([...applications, application]),
      'utf8',
    );
  });

  writeQueue = writeOperation.catch(() => undefined);
  await writeOperation;

  return application;
}
