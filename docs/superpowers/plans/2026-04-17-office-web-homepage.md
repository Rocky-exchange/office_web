# Office Web Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Rocky marketing homepage from the approved design spec in a fresh `Next.js` app, including responsive sections and SEO metadata.

**Architecture:** Create a small App Router site with one homepage route, a tokenized global stylesheet, section data stored in a local content module, and semantic React sections rendered from reusable primitives. Keep visuals code-native so hero copy, FAQ content, and tokenomics labels remain crawlable HTML rather than image text.

**Tech Stack:** Next.js 15, React 19, TypeScript, ESLint, Testing Library, Jest, jsdom

---

## File Structure

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.gitignore`
- Create: `eslint.config.mjs`
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `next-env.d.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/components/home/home-page.tsx`
- Create: `src/components/home/sections.tsx`
- Create: `src/content/homepage.ts`
- Create: `src/lib/metadata.ts`
- Create: `src/lib/schema.ts`
- Create: `src/__tests__/app/homepage.test.tsx`
- Create: `src/__tests__/lib/schema.test.ts`

### Task 1: Bootstrap the Next.js app and test harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.gitignore`
- Create: `eslint.config.mjs`
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `next-env.d.ts`

- [ ] **Step 1: Write the failing config test**

```typescript
// src/__tests__/app/homepage.test.tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('project bootstrap', () => {
  test('declares next/react dependencies and a test script', () => {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
    ) as {
      dependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };

    expect(pkg.dependencies?.next).toBeDefined();
    expect(pkg.dependencies?.react).toBeDefined();
    expect(pkg.dependencies?.['react-dom']).toBeDefined();
    expect(pkg.scripts?.test).toContain('jest');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand src/__tests__/app/homepage.test.tsx`
Expected: FAIL because `package.json` and Jest config do not exist yet.

- [ ] **Step 3: Write the minimal project files**

```json
// package.json
{
  "name": "office_web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.15.3",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "eslint": "^9.25.1",
    "eslint-config-next": "^15.3.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.3.2",
    "typescript": "^5.8.3"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

```ts
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
```

```ts
// jest.setup.ts
import '@testing-library/jest-dom';
```

```ts
// next-env.d.ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file is auto-maintained by Next.js.
```

```txt
# .gitignore
node_modules
.next
coverage
```

- [ ] **Step 4: Install dependencies and rerun the test**

Run:
```bash
npm install
npm test -- --runInBand src/__tests__/app/homepage.test.tsx
```

Expected: PASS for `project bootstrap`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts .gitignore jest.config.ts jest.setup.ts next-env.d.ts src/__tests__/app/homepage.test.tsx
git commit -m "chore: bootstrap next homepage app"
```

### Task 2: Add site shell, metadata helpers, and homepage content model

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/lib/metadata.ts`
- Create: `src/lib/schema.ts`
- Create: `src/content/homepage.ts`
- Test: `src/__tests__/lib/schema.test.ts`

- [ ] **Step 1: Write the failing metadata/schema test**

```typescript
// src/__tests__/lib/schema.test.ts
import { buildOrganizationSchema, buildFaqSchema } from '@/lib/schema';
import { faqItems } from '@/content/homepage';

describe('schema builders', () => {
  test('returns faq schema with every homepage question', () => {
    const schema = buildFaqSchema(faqItems);

    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(faqItems.length);
    expect(schema.mainEntity[0].name).toBe(faqItems[0].question);
  });

  test('returns organization schema for Rocky', () => {
    const schema = buildOrganizationSchema();

    expect(schema.name).toBe('Rocky');
    expect(schema['@type']).toBe('Organization');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand src/__tests__/lib/schema.test.ts`
Expected: FAIL because the content and schema modules do not exist yet.

- [ ] **Step 3: Create the content and metadata modules**

```typescript
// src/content/homepage.ts
export const navigationItems = ['Why Rocky', 'POCKY', 'Mechanism', 'FAQ'];

export const heroStats = [
  { value: '<10μs', label: 'Orderbook response target' },
  { value: '0 bps', label: 'Maker entry hook' },
  { value: '100%', label: 'POCKY-linked trading loop' },
  { value: '93/d', label: 'Protocol mining cycles' },
];

export const faqItems = [
  {
    question: 'What is Rocky?',
    answer:
      'Rocky is a crypto trading platform built around the POCKY token model and a trade-to-mine reward loop.',
  },
  {
    question: 'How does trading produce POCKY?',
    answer:
      'Eligible trading activity participates in Rocky’s mining loop, connecting platform usage to token distribution.',
  },
  {
    question: 'Is Rocky for beginners?',
    answer:
      'Yes. The homepage and onboarding flow are designed to make the platform legible to new users while preserving a premium trading brand.',
  },
  {
    question: 'Why does holding matter?',
    answer:
      'The model ties holding to fee or participation benefits, reinforcing the product loop described on the homepage.',
  },
  {
    question: 'How large is the POCKY supply?',
    answer:
      'The homepage presents a fixed supply of 1 billion POCKY with half allocated to users.',
  },
];
```

```typescript
// src/lib/schema.ts
import { faqItems } from '@/content/homepage';

type FaqItem = (typeof faqItems)[number];

export function buildFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rocky',
    url: 'https://rocky.exchange',
    logo: 'https://rocky.exchange/og-image.png',
  };
}
```

```typescript
// src/lib/metadata.ts
import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  metadataBase: new URL('https://rocky.exchange'),
  title: 'Rocky | POCKY Crypto Trading Platform',
  description:
    'Rocky is a crypto trading platform where trading activity connects to the POCKY token loop, fixed supply tokenomics, and a premium beginner-ready experience.',
  openGraph: {
    title: 'Rocky | POCKY Crypto Trading Platform',
    description:
      'Trade on Rocky and explore the POCKY-powered token loop, fixed supply model, and brand-led onboarding experience.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rocky | POCKY Crypto Trading Platform',
    description:
      'Explore Rocky, the cinematic trading platform built around the POCKY token model.',
  },
};
```

```tsx
// src/app/layout.tsx
import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { siteMetadata } from '@/lib/metadata';
import './globals.css';

export const metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: '#151511',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npm test -- --runInBand src/__tests__/lib/schema.test.ts
npm test -- --runInBand src/__tests__/app/homepage.test.tsx
```

Expected: PASS for both test files.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/content/homepage.ts src/lib/metadata.ts src/lib/schema.ts src/__tests__/lib/schema.test.ts
git commit -m "feat: add homepage content and metadata foundations"
```

### Task 3: Implement the homepage shell and top-half sections

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/home/home-page.tsx`
- Create: `src/components/home/sections.tsx`
- Create: `src/app/globals.css`
- Modify: `src/content/homepage.ts`
- Test: `src/__tests__/app/homepage.test.tsx`

- [ ] **Step 1: Replace the bootstrap test with a failing homepage render test**

```typescript
// src/__tests__/app/homepage.test.tsx
import { render, screen } from '@testing-library/react';
import HomePage from '@/components/home/home-page';

describe('homepage', () => {
  test('renders the hero headline and key sections', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', {
        name: /private positions\. mining trades\. all in pocky\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /three moats competitors structurally cannot replicate\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /every trade you make produces pocky\./i,
      }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand src/__tests__/app/homepage.test.tsx`
Expected: FAIL because `HomePage` is not implemented yet.

- [ ] **Step 3: Implement the page shell and sections**

```tsx
// src/app/page.tsx
import HomePage from '@/components/home/home-page';

export default function Page() {
  return <HomePage />;
}
```

```tsx
// src/components/home/home-page.tsx
import {
  Header,
  HeroSection,
  MoatsSection,
  TradeSection,
} from '@/components/home/sections';

export default function HomePage() {
  return (
    <main className="page-shell">
      <Header />
      <HeroSection />
      <MoatsSection />
      <TradeSection />
    </main>
  );
}
```

```tsx
// src/components/home/sections.tsx
import { heroStats, navigationItems } from '@/content/homepage';

export function Header() {
  return (
    <header className="site-header">
      <div className="brand">ROCKY</div>
      <nav aria-label="Primary">
        {navigationItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>
            {item}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="ghost-button" href="#faq">Learn More</a>
        <a className="primary-button" href="#hero">Launch App</a>
      </div>
    </header>
  );
}

export function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Rocky Exchange</p>
        <h1>PRIVATE POSITIONS. MINING TRADES. ALL IN POCKY.</h1>
        <p>
          Rocky turns a trading platform into a token-linked system where
          participation, holding, and structure reinforce each other.
        </p>
        <div className="cta-row">
          <a className="primary-button" href="#trade">Start Trading</a>
          <a className="ghost-button" href="#mechanism">Watch the Model</a>
        </div>
      </div>
      <ul className="stat-grid" aria-label="Platform highlights">
        {heroStats.map((stat) => (
          <li key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MoatsSection() {
  return (
    <section id="why-rocky" className="panel-section">
      <p className="eyebrow">Why Rocky</p>
      <h2>Three Moats Competitors Structurally Cannot Replicate.</h2>
      <div className="moat-grid">
        <article>
          <h3>Market-linked rewards</h3>
          <p>Activity creates a loop that connects trading behavior to POCKY issuance.</p>
        </article>
        <article>
          <h3>Holding-driven discounts</h3>
          <p>Keeping POCKY in the system creates a reason to stay inside the Rocky economy.</p>
        </article>
        <article>
          <h3>Brand-native mechanics</h3>
          <p>Rocky presents the model as a coherent product world rather than a promo layer.</p>
        </article>
      </div>
    </section>
  );
}

export function TradeSection() {
  return (
    <section id="trade" className="trade-section">
      <div className="trade-panel" aria-hidden="true">
        <div className="trade-panel-inner">
          <span>BTC / POCKY</span>
          <span>Fee Discount Active</span>
          <button type="button">Buy & Mine</button>
        </div>
      </div>
      <div className="trade-copy">
        <p className="eyebrow">Trade-to-Mine</p>
        <h2>Every Trade You Make Produces POCKY.</h2>
        <p>
          Rocky links participation to token generation so the exchange,
          holding behavior, and user incentives operate as one product loop.
        </p>
      </div>
    </section>
  );
}
```

```css
/* src/app/globals.css */
:root {
  --bg: #12120f;
  --bg-soft: #2f332d;
  --text: #f3efe6;
  --muted: #b8b0a1;
  --accent: #e8a25d;
  --line: rgba(255, 255, 255, 0.14);
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background:
    radial-gradient(circle at 50% 25%, rgba(232, 162, 93, 0.12), transparent 36%),
    linear-gradient(180deg, #37413f 0%, #12120f 38%, #0f0b09 100%);
  color: var(--text);
  font-family: "Segoe UI", sans-serif;
}

.page-shell { min-height: 100vh; }
.site-header, .hero-section, .panel-section, .trade-section {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) 0;
}
.primary-button, .ghost-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  text-decoration: none;
  color: var(--text);
  border: 1px solid var(--line);
}
.primary-button { background: linear-gradient(90deg, #e8a25d, #cbd9e8); color: #13110f; }
.hero-section { padding: var(--space-16) 0 var(--space-12); }
.hero-copy h1 { max-width: 10ch; font-size: clamp(3.2rem, 7vw, 6rem); line-height: 0.95; }
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-6);
  list-style: none;
  padding: 0;
}
.panel-section, .trade-section { padding: var(--space-16) 0; }
.moat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-6);
}
.moat-grid article, .trade-panel {
  border: 1px solid var(--line);
  background: rgba(16, 12, 10, 0.7);
  padding: var(--space-8);
}
.trade-section {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: var(--space-12);
  align-items: center;
}
@media (max-width: 900px) {
  .site-header, .trade-section { grid-template-columns: 1fr; }
  .stat-grid, .moat-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 680px) {
  .site-header { flex-direction: column; gap: var(--space-4); }
  .stat-grid, .moat-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npm test -- --runInBand src/__tests__/app/homepage.test.tsx
```

Expected: PASS with the hero and top-half section headings rendered.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/globals.css src/components/home/home-page.tsx src/components/home/sections.tsx src/content/homepage.ts src/__tests__/app/homepage.test.tsx
git commit -m "feat: build homepage hero and core sections"
```

### Task 4: Implement mechanism, tokenomics, FAQ, footer, and structured data injection

**Files:**
- Modify: `src/components/home/home-page.tsx`
- Modify: `src/components/home/sections.tsx`
- Modify: `src/content/homepage.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Test: `src/__tests__/app/homepage.test.tsx`

- [ ] **Step 1: Extend the homepage test with lower-half sections**

```typescript
// append in src/__tests__/app/homepage.test.tsx
test('renders mechanism, tokenomics, faq, and footer copy', () => {
  render(<HomePage />);

  expect(
    screen.getByRole('heading', {
      name: /trading is mining\. holding is discount\. loop closes\./i,
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /1 billion pocky\. fixed supply\. half to users\./i,
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /frequently asked questions/i,
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /sealed in canton\. forged in rocky\./i,
    }),
  ).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand src/__tests__/app/homepage.test.tsx`
Expected: FAIL because the lower-half sections are not rendered yet.

- [ ] **Step 3: Implement the remaining sections and schema injection**

```tsx
// extend src/components/home/home-page.tsx
import {
  FooterSection,
  FaqSection,
  Header,
  HeroSection,
  MechanismSection,
  MoatsSection,
  TokenomicsSection,
  TradeSection,
} from '@/components/home/sections';
import { buildFaqSchema, buildOrganizationSchema } from '@/lib/schema';
import { faqItems } from '@/content/homepage';

const schema = [buildOrganizationSchema(), buildFaqSchema(faqItems)];

export default function HomePage() {
  return (
    <main className="page-shell">
      {schema.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <Header />
      <HeroSection />
      <MoatsSection />
      <TradeSection />
      <MechanismSection />
      <TokenomicsSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}
```

```tsx
// add to src/components/home/sections.tsx
import { faqItems } from '@/content/homepage';

export function MechanismSection() {
  return (
    <section id="mechanism" className="panel-section">
      <p className="eyebrow">Mechanism</p>
      <h2>Trading Is Mining. Holding Is Discount. Loop Closes.</h2>
      <div className="flow-grid">
        {['Trade', 'Earn POCKY', 'Hold for Benefits', 'Re-enter With Edge'].map((step) => (
          <article key={step} className="flow-card">
            <h3>{step}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TokenomicsSection() {
  return (
    <section id="pocky" className="tokenomics-section">
      <p className="eyebrow">Tokenomics</p>
      <h2>1 Billion POCKY. Fixed Supply. Half To Users.</h2>
      <div className="tokenomics-layout">
        <div className="donut-chart" aria-hidden="true" />
        <ul className="allocation-list">
          <li><strong>40%</strong> Trade mining</li>
          <li><strong>15%</strong> Treasury</li>
          <li><strong>15%</strong> Ecosystem</li>
          <li><strong>15%</strong> Team vesting</li>
          <li><strong>10%</strong> Liquidity</li>
          <li><strong>5%</strong> Community reserve</li>
        </ul>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqItems.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="footer-section">
      <p className="eyebrow">Built for the Loop</p>
      <h2>SEALED IN CANTON. FORGED IN ROCKY.</h2>
      <p>
        Rocky combines cinematic brand identity with a product loop centered on POCKY,
        tokenomics, and legible platform structure.
      </p>
      <div className="cta-row">
        <a className="primary-button" href="#hero">Launch App</a>
        <a className="ghost-button" href="#faq">Read FAQ</a>
      </div>
    </footer>
  );
}
```

```css
/* append to src/app/globals.css */
.flow-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-6);
}
.flow-card,
.faq-list details,
.footer-section {
  border: 1px solid var(--line);
  background: rgba(14, 10, 8, 0.78);
}
.tokenomics-section,
.faq-section,
.footer-section {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: var(--space-16) 0;
}
.tokenomics-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;
}
.donut-chart {
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #120f0d 0 28%, transparent 29%),
    conic-gradient(#cfe7ff 0 40%, #8e6542 40% 55%, #4b392b 55% 70%, #242120 70% 85%, #6b4a29 85% 95%, #d0b08a 95% 100%);
}
.allocation-list,
.faq-list {
  display: grid;
  gap: var(--space-4);
  padding: 0;
  list-style: none;
}
.faq-list details {
  padding: var(--space-6);
}
.faq-list summary {
  cursor: pointer;
  font-weight: 600;
}
.footer-section {
  margin-bottom: var(--space-16);
  padding: var(--space-16);
  text-align: left;
  background:
    linear-gradient(180deg, rgba(58, 64, 57, 0.88), rgba(27, 22, 18, 0.92));
}
@media (max-width: 900px) {
  .flow-grid,
  .tokenomics-layout {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 680px) {
  .flow-grid,
  .tokenomics-layout {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npm test -- --runInBand src/__tests__/app/homepage.test.tsx
npm test -- --runInBand src/__tests__/lib/schema.test.ts
```

Expected: PASS with all homepage sections and schema builders covered.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/home-page.tsx src/components/home/sections.tsx src/app/globals.css src/content/homepage.ts src/app/layout.tsx src/__tests__/app/homepage.test.tsx
git commit -m "feat: finish homepage sections and seo schema"
```

### Task 5: Add robots, sitemap, final polish, and production verification

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Modify: `src/lib/metadata.ts`
- Modify: `src/app/globals.css`
- Test: `src/__tests__/app/homepage.test.tsx`

- [ ] **Step 1: Add a failing test for CTA and FAQ visibility**

```typescript
// append in src/__tests__/app/homepage.test.tsx
test('renders primary conversion paths and faq questions as HTML text', () => {
  render(<HomePage />);

  expect(screen.getAllByRole('link', { name: /launch app/i }).length).toBeGreaterThan(0);
  expect(screen.getByText(/what is rocky\?/i)).toBeInTheDocument();
  expect(screen.getByText(/how does trading produce pocky\?/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails if copy is missing**

Run: `npm test -- --runInBand src/__tests__/app/homepage.test.tsx`
Expected: FAIL only if conversion paths or FAQ content are missing; if it passes immediately, tighten the assertions before proceeding.

- [ ] **Step 3: Add crawl endpoints and final polish**

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://rocky.exchange/sitemap.xml',
  };
}
```

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://rocky.exchange',
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
```

```typescript
// extend src/lib/metadata.ts
export const siteMetadata: Metadata = {
  metadataBase: new URL('https://rocky.exchange'),
  title: 'Rocky | POCKY Crypto Trading Platform',
  description:
    'Rocky is a crypto trading platform where trading activity connects to the POCKY token loop, fixed supply tokenomics, and a premium beginner-ready experience.',
  alternates: {
    canonical: 'https://rocky.exchange',
  },
  keywords: [
    'Rocky',
    'POCKY token',
    'crypto trading platform',
    'trade to mine crypto',
    'fixed supply tokenomics',
  ],
  openGraph: {
    title: 'Rocky | POCKY Crypto Trading Platform',
    description:
      'Trade on Rocky and explore the POCKY-powered token loop, fixed supply model, and brand-led onboarding experience.',
    url: 'https://rocky.exchange',
    siteName: 'Rocky',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rocky | POCKY Crypto Trading Platform',
    description:
      'Explore Rocky, the cinematic trading platform built around the POCKY token model.',
  },
};
```

- [ ] **Step 4: Run full verification**

Run:
```bash
npm test -- --runInBand
npm run build
```

Expected:
- Jest exits `0`
- `next build` exits `0`

- [ ] **Step 5: Commit**

```bash
git add src/app/robots.ts src/app/sitemap.ts src/lib/metadata.ts src/app/globals.css src/__tests__/app/homepage.test.tsx
git commit -m "feat: finalize homepage seo and production checks"
```

## Self-Review

### Spec coverage

- Header, hero, moats, trade section, mechanism flow, tokenomics, FAQ, and footer are each assigned to a task.
- Metadata, canonical, robots, sitemap, FAQ schema, and semantic HTML are covered by Tasks 2, 4, and 5.
- Responsive behavior is addressed in CSS tasks for top and lower sections.

### Placeholder scan

- No `TODO`, `TBD`, or deferred implementation placeholders are left in the plan.
- Each code-changing step contains exact file paths and concrete snippets.

### Type consistency

- `faqItems` is defined once in `src/content/homepage.ts` and reused in tests and schema generation.
- `HomePage` remains the entry component used by both `src/app/page.tsx` and render tests.
