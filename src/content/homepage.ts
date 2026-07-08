export const navigationItems = [
  { label: 'How It Works', href: '#mechanism' },
  { label: 'Trading Is Mining', href: '#trade' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Docs', href: '#footer' },
] as const;

export const heroStats = [
  { value: '<10μs', label: 'Matching latency' },
  { value: '0 bps', label: 'MEV exposure' },
  { value: '100%', label: 'On-chain margin' },
  { value: '93/d', label: 'Break-even trades' },
] as const;

export const moatItems = [
  {
    icon: '/pillars/privacy.svg',
    title: 'Protocol-Level Privacy',
    description:
      "Canton's sub-transaction model means only you and your counterparty see the trade. Not the sequencer. Not the mediator. Not the bot sniffing for arbitrage.",
    result:
      'Zero MEV exposure — impossible to front-run or sandwich.',
  },
  {
    icon: '/pillars/security.svg',
    title: 'Bedrock Margin Security',
    description:
      "Your collateral locks into Canton's native LockedAmulet. Not a smart contract that can be exploited. The protocol itself enforces withdrawal rules.",
    result:
      'No custodial reuse of margin.',
  },
  {
    icon: '/pillars/speed.svg',
    title: 'Trade is Mining',
    description:
      "Canton’s unique reward system distributes network incentives based on real activites. Rocky brings this directly into trading, users can capture instant CC rewards with every trade. ",
    result:
      'HyperLiquid-class latency, provable settlement.',
  },
] as const;

export const tradePoints = [
  {
    prefix: 'Order matches in ',
    highlight: '<10μs',
    suffix: '. Settlement batched to Canton every 5 seconds.',
  },
  {
    prefix: 'Real-time mining rate shown on every order panel. ',
    highlight: 'No surprises.',
    suffix: '',
  },
  {
    prefix: 'Up to ',
    highlight: '100x leverage',
    suffix: '. Protocol-secured margin via LockedAmulet.',
  },
  {
    prefix: 'Plug in via ',
    highlight: 'gRPC or FIX',
    suffix: '. Same flow as Binance, built for quants.',
  },
] as const;

export const mechanismSteps = [
  {
    title: 'Trade',
    description:
      'Place orders on any market',
  },
  {
    title: 'Earn ROCKY',
    description:
      'Instant mining rewards per fill',
  },
  {
    title: 'Unlock VIP',
    description:
      'Lower fees · higher rebates',
  },
  {
    title: 'Govern The Protocol',
    description:
      'Vote on fees, markets, and treasury. Your ROCKY, your rules.',
  },
  {
    title: 'Stake For Dividends',
    description:
      '25% of all platform fees flow to stakers — paid in CC, not inflation.',
  },
] as const;

export const tokenomicsAllocations = [
  {
    share: '45%',
    label: 'Mining Airdrop',
    detail: 'Primary community distribution for active users.',
  },
  {
    share: '15%',
    label: 'Ecosystem Fund',
    detail: 'Reserved for ecosystem growth and strategic expansion.',
  },
  {
    share: '15%',
    label: 'Investors',
    detail: 'Early backers aligned with network growth.',
  },
  {
    share: '15%',
    label: 'Team & Advisors',
    detail: 'Long-term contributor and advisor allocation.',
  },
  {
    share: '10%',
    label: 'Liquidity Bootstrap',
    detail: 'Initial depth to support the launch market.',
  },
] as const;

export const footerCtaLinks = [
  { label: 'Launch App', href: 'https://app.rocky.exchange', variant: 'primary' },
] as const;

export const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Trading App', href: 'https://app.rocky.exchange/trade' },
      { label: 'API / gRPC', href: 'https://developers.rocky.exchange/' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Doc', href: '#footer' },
      {
        label: 'Canton 101',
        href: 'https://docs.daml.com/canton/architecture/overview.html#canton-101',
      },
      { label: 'Research', href: '#mechanism' },
    ],
  },
] as const;

export const footerSocialLinks = [
  { label: 'X', href: 'https://x.com/Rocky_exchange', icon: '/brand/social-x.svg' },
  { label: 'Discord', href: 'https://discord.gg/Wu5VmFfjSn', icon: '/brand/social-discord.svg' },
] as const;

export const faqItems = [
  {
    question: 'What is Canton Network and why build on it?',
    answer:
      'Canton is an enterprise-grade blockchain where every transaction is private by default — only the counterparties and validators see it. Unlike Ethereum or Solana, no one can scan the public mempool to front-run your trades. This is the only chain where a true MEV-free perpetual DEX is structurally possible.',
  },
  {
    question: 'What makes Rocky better than traditional brokers?',
    answer:
      'Rocky combines CEX-class speed with protocol-level privacy, on-chain provable margin, and a token loop that pays active users instead of extracting from them.',
  },
  {
    question: 'What happens if ROCKY token price drops to zero?',
    answer:
      'Trading still works. The venue is designed to stand on execution quality first, while the ROCKY loop adds fee and participation upside on top.',
  },
  {
    question: 'How do I earn ROCKY by trading?',
    answer:
      'Eligible fills participate in Rocky’s mining logic. Rewards are shown on the order panel so the economics are legible before you trade.',
  },
  {
    question: 'What Makes This Different From HyperLiquid Or DYdX?',
    answer:
      'Rocky is built around private execution and protocol-native collateral security. That changes the trust model, not just the interface.',
  },
  {
    question: 'Is My Wallet Or Personal Data Exposed?',
    answer:
      'No. Rocky is designed to minimize public exposure of trading intent and settlement details, reducing the surface area for copy trading, front-running, and behavioral leakage.',
  },
  {
    question: "When Can I Trade? What's The Roadmap?",
    answer:
      'The roadmap will be published alongside launch milestones. The FAQ section is structured to expand as product timelines and access details are finalized.',
  },
] as const;
