import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';

import Page from '@/app/page';

describe('project bootstrap', () => {
  test('renders the homepage component and keeps the bootstrap config wired', () => {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
    ) as {
      dependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };
    const nextConfig = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8');
    const tsconfig = JSON.parse(
      readFileSync(join(process.cwd(), 'tsconfig.json'), 'utf8'),
    ) as {
      compilerOptions?: { paths?: Record<string, string[]> };
    };
    const jestConfig = readFileSync(join(process.cwd(), 'jest.config.ts'), 'utf8');

    expect(pkg.dependencies?.next).toBeDefined();
    expect(pkg.dependencies?.react).toBeDefined();
    expect(pkg.dependencies?.['react-dom']).toBeDefined();
    expect(pkg.scripts?.test).toContain('jest');
    expect(nextConfig).toContain('reactStrictMode: true');
    expect(tsconfig.compilerOptions?.paths?.['@/*']).toEqual(['./src/*']);
    expect(jestConfig).toContain("testEnvironment: 'jsdom'");
    expect(jestConfig).toContain('setupFilesAfterEnv');

    render(<Page />);

    expect(
      screen.getByRole('heading', {
        name: /rocky/i,
      }),
    ).toBeInTheDocument();
  });
});
