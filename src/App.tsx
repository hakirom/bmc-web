import { BoletinesSection } from '@/components/boletines-section'
import { ContactSection } from '@/components/contact-section'
import { DemoBadge } from '@/components/demo-badge'
import { Hero } from '@/components/hero'
import { MarketBoard } from '@/components/market-board'
import { Navbar } from '@/components/navbar'
import { Services } from '@/components/services'
import { SiteFooter } from '@/components/site-footer'
import { SourceBadge } from '@/components/source-badge'
import { StatsStrip } from '@/components/stats-strip'
import { TopBar } from '@/components/top-bar'
import { ValueCarousel } from '@/components/value-carousel'
import { WhatsappFab } from '@/components/whatsapp-fab'
import { ContentProvider } from '@/lib/content-context'

export default function App() {
  return (
    <ContentProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
      >
        Pasar al contenido principal
      </a>

      <TopBar />
      <Navbar />

      <main id="main">
        <Hero />
        <MarketBoard />
        <Services />
        <StatsStrip />
        <ValueCarousel />
        <BoletinesSection />
        <ContactSection />
      </main>

      <SiteFooter />
      <WhatsappFab />

      <div className="pointer-events-none fixed bottom-5 left-5 z-50 flex flex-col items-start gap-2">
        <SourceBadge />
        <DemoBadge />
      </div>
    </ContentProvider>
  )
}
