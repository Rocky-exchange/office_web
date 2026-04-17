export const navigationItems = [
  { label: 'Why Rocky', href: '#why-rocky' },
  { label: 'POCKY', href: '#trade' },
] as const;

export const heroStats = [
  { kicker: 'Execution', value: '<10μs', label: 'Orderbook response target' },
  { kicker: 'Access', value: '0 bps', label: 'Maker entry hook' },
  { kicker: 'Loop', value: '100%', label: 'POCKY-linked trading loop' },
  { kicker: 'Cadence', value: '93/d', label: 'Protocol mining cycles' },
] as const;

export const moatItems = [
  {
    index: '01',
    title: 'Market-linked rewards',
    description:
      'Each filled order participates in a native issuance loop instead of relying on temporary growth promos.',
    note: 'Read the issuance model',
    href: '#trade',
  },
  {
    index: '02',
    title: 'Holding changes the fee surface',
    description:
      'POCKY ownership rewrites the economics of staying active, giving the platform a retention engine tied to use.',
    note: 'See why staying matters',
    href: '#trade',
  },
  {
    index: '03',
    title: 'Mechanics welded to the brand',
    description:
      'Rocky presents the token model as product architecture, not a detachable loyalty wrapper competitors can copy later.',
    note: 'Trace the closed loop',
    href: '#trade',
  },
] as const;

export const tradePoints = [
  'Execution is the mining action, not a separate campaign funnel.',
  'Ownership compounds into better economics for the traders who stay.',
  'The product loop is visible, legible, and brand-native from the first screen.',
] as const;

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
] as const;
