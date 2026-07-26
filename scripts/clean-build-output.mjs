import { rm } from 'node:fs/promises';
import path from 'node:path';

const buildOutputPath = path.join(process.cwd(), 'dist');

await rm(buildOutputPath, { recursive: true, force: true });
