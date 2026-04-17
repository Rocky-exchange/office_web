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
import { faqItems } from '@/content/homepage';
import { buildFaqSchema, buildOrganizationSchema } from '@/lib/schema';

const schema = [buildOrganizationSchema(), buildFaqSchema(faqItems)];

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
      <TokenomicsSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}
