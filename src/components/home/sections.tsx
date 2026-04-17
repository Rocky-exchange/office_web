import {
  faqItems,
  footerLinks,
  heroStats,
  mechanismSteps,
  moatItems,
  navigationItems,
  tokenomicsAllocations,
  tradePoints,
} from '@/content/homepage';

export function Header() {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#hero" aria-label="Rocky home">
        <span className="brand-mark__halo" aria-hidden="true" />
        <span className="brand-mark__word">ROCKY</span>
      </a>

      <nav className="site-nav" aria-label="Primary">
        {navigationItems.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <a className="ghost-button" href="#why-rocky">
          Read the thesis
        </a>
        <a className="primary-button" href="#trade">
          Launch App
        </a>
      </div>
    </header>
  );
}

export function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-horizon" />
        <div className="hero-monument" />
        <div className="hero-gridline hero-gridline--left" />
        <div className="hero-gridline hero-gridline--right" />
      </div>

      <div className="hero-copy">
        <p className="eyebrow">Rocky Exchange</p>
        <h1>PRIVATE POSITIONS. MINING TRADES. ALL IN POCKY.</h1>
        <p className="hero-summary">
          Rocky turns a trading venue into a closed-loop system where execution,
          token issuance, and holding behavior reinforce each other.
        </p>

        <div className="cta-row">
          <a className="primary-button" href="#trade">
            Start Trading
          </a>
          <a className="ghost-button" href="#why-rocky">
            Study the model
          </a>
        </div>
      </div>

      <ul className="stat-grid" aria-label="Platform highlights">
        {heroStats.map((stat) => (
          <li key={stat.label}>
            <span className="stat-kicker">{stat.kicker}</span>
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
      <div className="section-intro">
        <p className="eyebrow">Why Rocky</p>
        <h2>Three Moats Competitors Structurally Cannot Replicate.</h2>
      </div>

      <div className="moat-grid">
        {moatItems.map((item) => (
          <article key={item.title} className="moat-card">
            <p className="moat-index">{item.index}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href={item.href}>{item.note}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TradeSection() {
  return (
    <section id="trade" className="trade-section">
      <div className="trade-panel" aria-hidden="true">
        <div className="trade-panel__frame">
          <div className="trade-panel__header">
            <span>BTC / POCKY</span>
            <span>Mining live</span>
          </div>
          <div className="trade-panel__chart" />
          <div className="trade-panel__ledger">
            <span>Fee discount unlocked</span>
            <span>POCKY output 4.8x</span>
            <button type="button">Buy &amp; Mine</button>
          </div>
        </div>
      </div>

      <div className="trade-copy">
        <p className="eyebrow">Trade-to-Mine</p>
        <h2>Every Trade You Make Produces POCKY.</h2>
        <p className="trade-description">
          Rocky routes activity back into ownership. Trading creates POCKY,
          holding changes the economics, and the desk becomes the distribution
          engine.
        </p>
        <ul className="trade-points">
          {tradePoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <a className="primary-button" href="#hero">
          Enter Rocky
        </a>
      </div>
    </section>
  );
}

export function MechanismSection() {
  return (
    <section id="mechanism" className="panel-section mechanism-section">
      <div className="section-intro">
        <p className="eyebrow">Mechanism</p>
        <h2>Trading Is Mining. Holding Is Discount. Loop Closes.</h2>
        <p className="section-summary">
          Rocky makes the incentive surface legible. Traders can see where
          activity becomes POCKY, how holding changes economics, and why the
          loop favors participants who come back.
        </p>
      </div>

      <div className="flow-grid" aria-label="Rocky mechanism flow">
        {mechanismSteps.map((step, index) => (
          <article key={step.title} className="flow-card">
            <p className="moat-index">{String(index + 1).padStart(2, '0')}</p>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <span>{step.metric}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TokenomicsSection() {
  return (
    <section id="pocky" className="tokenomics-section">
      <div className="section-intro">
        <p className="eyebrow">Tokenomics</p>
        <h2>1 Billion POCKY. Fixed Supply. Half To Users.</h2>
        <p className="section-summary">
          The supply is fixed from day one. Half of all POCKY is routed to user
          participation so the platform rewards sustained trading instead of
          one-off campaigns.
        </p>
      </div>

      <div className="tokenomics-layout">
        <div className="tokenomics-visual" aria-hidden="true">
          <div className="donut-chart" />
          <div className="tokenomics-visual__center">
            <strong>1B</strong>
            <span>Fixed supply</span>
          </div>
        </div>

        <ul className="allocation-list" aria-label="POCKY allocation">
          {tokenomicsAllocations.map((allocation) => (
            <li key={allocation.label}>
              <strong>{allocation.share}</strong>
              <div>
                <span>{allocation.label}</span>
                <p>{allocation.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="faq-section">
      <div className="section-intro">
        <p className="eyebrow">FAQ</p>
        <h2>Frequently Asked Questions</h2>
      </div>

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
      <div className="footer-copy">
        <p className="eyebrow">Built for the Loop</p>
        <h2>SEALED IN CANTON. FORGED IN ROCKY.</h2>
        <p className="footer-description">
          Rocky combines cinematic brand identity with a product loop centered
          on POCKY, fixed tokenomics, and beginner-legible trading mechanics.
        </p>
      </div>

      <div className="cta-row">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            className={
              link.variant === 'primary' ? 'primary-button' : 'ghost-button'
            }
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
