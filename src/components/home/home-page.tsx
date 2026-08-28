import {
  FooterSection,
  Header,
  HeroSection,
  MechanismSection,
  MoatsSection,
  TradeSection,
} from '@/components/home/sections';
import { FaqSection } from '@/components/home/faq-section';
import { faqItems } from '@/content/homepage';
import {
  buildFaqSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '@/lib/schema';

const schema = [
  buildOrganizationSchema(),
  buildWebSiteSchema(),
  buildFaqSchema(faqItems),
];

function serializeSchema(value: object) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export default function HomePage() {
  return (
    <main className="page-shell rocky-homepage">
      {schema.map((item, index) => (
        <script
          key={`homepage-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeSchema(item) }}
        />
      ))}
      <Header />
      <HeroSection />
      <MoatsSection />
      <TradeSection />
      <MechanismSection />
      <div className="tokenomics-faq-shell">
        <FaqSection />
      </div>
      <FooterSection />
    </main>
  );
}
