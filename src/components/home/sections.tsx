import Image from 'next/image';

import { AudioToggle } from '@/components/home/audio-toggle';
import {
  footerColumns,
  footerCtaLinks,
  footerSocialLinks,
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
        <Image
          className="brand-mark__icon"
          src="/brand/footer-logo.svg"
          alt=""
          width={32}
          height={32}
          priority
        />
        <Image
          className="brand-mark__wordmark"
          src="/brand/rocky-wordmark.svg"
          alt="ROCKY"
          width={82}
          height={16}
          priority
        />
      </a>

      <nav className="site-nav" aria-label="Primary">
        {navigationItems.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        {/* <a
          className="ghost-button ghost-button--header"
          href="https://demo.rocky.exchange"
          target="_blank"
          rel="noreferrer"
        >
          View Demo
        </a> */}
        <AudioToggle />
        <a
          className="primary-button primary-button--header"
          href="https://app.rocky.exchange"
          target="_blank"
          rel="noreferrer"
        >
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
        <video
          className="hero-video"
          src="/hero-background.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-video-overlay" />
      </div>

      <div className="hero-copy">
        <h1>
          CANTON ENCRYPTS.{` `}
          <br />
          ROCKY EARNS.
        </h1>
        <p className="hero-summary">
          Protect your strategy. Secure your margin. Earn with every trade.
        </p>

        <div className="cta-row">
          <a
            className="primary-button"
            href="https://app.rocky.exchange"
            target="_blank"
            rel="noreferrer"
          >
            LAUNCH APP <span aria-hidden="true">→</span>
          </a>
          <a
            className="ghost-button"
            href="https://demo.rocky.exchange/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            WATCH DEMO
          </a>
        </div>
      </div>

      <div className="stat-strip">
        <ul className="stat-grid" aria-label="Platform highlights">
          {heroStats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function MoatsSection() {
  return (
    <section id="why-rocky" className="panel-section pillars-section">
      <div className="section-intro">
        <p className="eyebrow">[ Core Pillars ]</p>
        <h2>Why Rocky Is Hard To Replicate</h2>
        <p className="section-summary">
          Most perp DEXs operate on transparent execution environments
        </p>
      </div>

      <div className="moat-grid">
        {moatItems.map((item) => (
          <article key={item.title} className="moat-card">
            <Image
              src={item.icon}
              alt=""
              width={28}
              height={28}
              className="moat-card__icon"
            />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className='moat-card__container'>
            <p className="moat-card__result">
              Result: <span>{item.result}</span>
            </p>
            </div>
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
        <div className="trade-panel__rock-wrap trade-panel__rock-wrap--small">
          <div className="trade-panel__rock-shadow" />
          <div className="trade-panel__rock trade-panel__rock--small">
            <video
              className="trade-panel__rock-video"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/stoneMotion.webm" type="video/webm" />
              <source src="/stoneMotion.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="trade-panel__frame">
          <div className="trade-panel__rows">
            <div className="trade-panel__row">
              <span>Order Size</span>
              <strong>$10,000.00</strong>
            </div>
            <div className="trade-panel__row">
              <span>Fee (0.025%)</span>
              <strong>−2.50 USDT</strong>
            </div>
            <div className="trade-panel__row trade-panel__row--reward">
              <span>Mining Reward</span>
              <strong>+25 ROCKY (~$12.50)</strong>
            </div>
          </div>
          <div className="trade-panel__divider" />
          <div className="trade-panel__summary">
            <span>Net Cost</span>
            <strong>−$10.00 (Negative)</strong>
          </div>
          <button type="button" className="trade-panel__action">
            BUY 0.148 BTC
          </button>
        </div>
        <div className="trade-panel__overlay">
          <div className="trade-panel__rock-wrap trade-panel__rock-wrap--large">
            <div className="trade-panel__rock trade-panel__rock--large">
              <video
                className="trade-panel__rock-video"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/stoneMotion.webm" type="video/webm" />
                <source src="/stoneMotion.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>

      <div className="trade-copy">
        <p className="eyebrow">[ TRADING ]</p>
        <h2>
          <span className="trade-copy__headline-line">Every Trade You Make</span>
          <span className="trade-copy__headline-line">Produces ROCKY.</span>
        </h2>
        <p className="trade-description">
          Unlike most DEXs, where fees simply disappear, Rocky gives them back
          to you.
        </p>
        <p className="trade-description">
          The moment your order is executed, mining rewards are sent to your
          wallet in real time.
        </p>
        <ul className="trade-points">
          {tradePoints.map((point) => (
            <li key={`${point.prefix}-${point.highlight}`}>
              <Image
                className="trade-points__spark"
                src="/brand/star.svg"
                alt=""
                width={18}
                height={20}
                aria-hidden="true"
              />
              <span>
                {point.prefix}
                <strong>{point.highlight}</strong>
                {point.suffix}
              </span>
            </li>
          ))}
        </ul>
        <a className="primary-button trade-copy__cta" href="#hero">
          Try Demo
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

export function MechanismSection() {
  return (
    <section id="mechanism" className="panel-section mechanism-section">
      <div className="section-intro mechanism-intro">
        <p className="eyebrow">[ THE FLYWHEEL ]</p>
        <h2>
          <span className="mechanism-intro__line mechanism-intro__line--warm">
            Trading is Mining.
          </span>
          <span className="mechanism-intro__line mechanism-intro__line--warm">
            Holding is Discount.
          </span>
          <span className="mechanism-intro__line mechanism-intro__line--cool">
            Loop Closes.
          </span>
        </h2>
        <p className="section-summary">
          <span className="mechanism-intro__summary-line">
            Every trade mints ROCKY. Every ROCKY you hold reduces your fees.
          </span>
          <span className="mechanism-intro__summary-line">
            Every discount brings you back. The flywheel pays for itself.
          </span>
        </p>
      </div>

      {/* SVG is the source of truth for the desktop flywheel composition. */}
      <div className="flywheel-svg-shell">
        <Image
          className="flywheel-svg"
          src="/group-17.svg"
          alt="Rocky mechanism flywheel diagram"
          width={1208}
          height={420}
          priority={false}
        />
      </div>

      <div className="flywheel flywheel--mobile" aria-label="Rocky mechanism flow">
        {mechanismSteps.map((step, index) => (
          <article
            key={step.title}
            className={`flywheel-card flywheel-card--${index + 1}`}
          >
            <p className="flywheel-card__index">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>

      <ol className="sr-only" aria-label="Mechanism steps">
        {mechanismSteps.map((step, index) => (
          <li key={step.title}>
            {String(index + 1).padStart(2, '0')} {step.title}. {step.description}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TokenomicsSection() {
  return (
    <section id="pocky" className="tokenomics-section">
      <div className="tokenomics-atmosphere" aria-hidden="true" />

      <div className="section-intro tokenomics-intro">
        <p className="eyebrow">[ TOKENOMICS ]</p>
        <h2 aria-label="1 Billion ROCKY. Fixed Supply. Half to Users.">
          <span className="tokenomics-intro__line">
            <span className="tokenomics-intro__accent">1 Billion</span>{' '}
            <span className="tokenomics-intro__base">ROCKY.</span>
          </span>
          <span className="tokenomics-intro__line tokenomics-intro__line--nowrap">
            <span className="tokenomics-intro__accent">Fixed Supply.</span>{' '}
            <span className="tokenomics-intro__base">Half to Users.</span>
          </span>
        </h2>
        <p className="section-summary">
          No inflation. No endless unlocks. Community-first from day one.
        </p>
      </div>

      <div className="tokenomics-stage">
        <Image
          className="tokenomics-stage__chart"
          src="/echarts-pie.svg"
          alt="Rocky token allocation chart"
          width={872}
          height={651}
          unoptimized
        />
      </div>

      <ol className="sr-only" aria-label="ROCKY allocation">
        {tokenomicsAllocations.map((allocation) => (
          <li key={allocation.label}>
            {allocation.share} {allocation.label}. {allocation.detail}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer id="footer" className="footer-section">
      <div className="footer-atmosphere" aria-hidden="true">
        <video
          className="footer-video"
          src="/footer-background.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="footer-video-overlay" />
      </div>

      <div className="footer-shell">
        <div className="footer-hero">
          <div className="footer-copy">
            <h2>
              <span className="footer-copy__line">
                <span className="footer-copy__warm">POWERED BY </span>
                <span className="footer-copy__cool">CANTON.</span>
              </span>
              <span className="footer-copy__line">
                <span className="footer-copy__warm">DEFINED BY </span>
                <span className="footer-copy__cool">ROCKY.</span>
              </span>
            </h2>
            <p className="footer-description">
              Built on Canton&apos;s secure infrastructure, Rocky gives traders
              stronger protection, faster execution, and instant CC rewards
              tied to every trade.
            </p>
          </div>

          <div className="footer-actions">
            {footerCtaLinks.map((link) => (
              <a
                key={link.label}
                className={`${
                  link.variant === 'primary'
                    ? 'primary-button primary-button--footer'
                    : 'ghost-button ghost-button--footer'
                }`}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-links-grid">
          <div className="footer-brand">
            <a className="footer-brand__mark" href="#hero" aria-label="Rocky home">
              <Image
                className="footer-brand__logo"
                src="/brand/footer-logo.svg"
                alt=""
                width={32}
                height={32}
              />
              <Image
                className="footer-brand__wordmark"
                src="/brand/rocky-wordmark.svg"
                alt="ROCKY"
                width={132}
                height={26}
              />
            </a>
            <p>
              The first perpetual futures DEX on Canton Network.
              Protocol-level privacy. Protocol-secured margin. Sub-10μs
              matching.
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} className="footer-column" aria-label={column.title}>
              <h3>{column.title}</h3>
              <div className="footer-column__links">
                {column.links.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          ))}

          <div className="footer-column footer-column--social">
            <h3>Social Media</h3>
            <div className="footer-socials">
              {footerSocialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className={`footer-socials__link footer-socials__link--${link.label.toLowerCase()}`}
                >
                  <Image
                    src={link.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="footer-socials__icon"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-legal">
          © 2026 Rocky Exchange. All rights reserved. · ROCKY is a utility
          token, not an investment product.
        </div>
      </div>
    </footer>
  );
}
