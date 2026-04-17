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
] as const;
