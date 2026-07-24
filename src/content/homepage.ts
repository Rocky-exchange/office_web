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
    question: 'What is Rocky?',
    answer:
      'Rocky is the trading and liquidity layer for Canton. Its initial product combines privacy-enabled perpetual markets, Canton-native spot markets, responsive execution, and Canton-native settlement workflows.',
  },
  {
    question: 'How does privacy work on Rocky?',
    answer:
      'Canton uses selective visibility: transaction information is shared with the parties and service providers required for a workflow instead of being broadcast globally. Privacy does not mean anonymity or the absence of compliance, audit, and risk controls.',
  },
  {
    question: 'What can I trade?',
    answer:
      'Rocky supports spot and perpetual markets. Markets can be added, paused, or updated, so the live Rocky application is always the source of truth for availability, settlement assets, leverage, fees, and order specifications.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Open the live Rocky application, review the available markets and current specifications, fund your trading account with a supported asset, and choose a market that fits your objectives and risk tolerance.',
  },
  {
    question: 'How do I fund my Rocky trading account?',
    answer:
      'Open the funding flow in Rocky, select a supported asset, and follow the instructions shown in the product. Only assets credited to your Rocky trading account are available for trading.',
  },
  {
    question: 'What fees and risks should I review?',
    answer:
      'Review maker and taker fees, funding, settlement costs, leverage, maintenance margin, and order specifications in the live application before trading. Digital assets and perpetual contracts involve substantial market, leverage, liquidity, network, account, and operational risk.',
  },
  {
    question: 'Where can I follow Rocky\'s roadmap?',
    answer:
      'Rocky\'s roadmap is published in the official documentation. It describes a direction of travel across trading, stablecoin liquidity, RWA markets, capital-management products, and wider Canton liquidity infrastructure; it is not a promise of fixed launch dates.',
  },
] as const;
