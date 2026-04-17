import {
  Header,
  HeroSection,
  MoatsSection,
  TradeSection,
} from '@/components/home/sections';

export default function HomePage() {
  return (
    <main className="page-shell rocky-homepage">
      <Header />
      <HeroSection />
      <MoatsSection />
      <TradeSection />
    </main>
  );
}
