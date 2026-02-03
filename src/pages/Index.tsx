import { Suspense, lazy } from 'react';
import SpiritualHeader from '@/components/SpiritualHeader';
import HeroSlider from '@/components/HeroSlider';
import ModuleGrid from '@/components/ModuleGrid';
import Footer from '@/components/Footer';
import DreamBottomNav from '@/components/DreamBottomNav';
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineIndicator from '@/components/OfflineIndicator';
import SkipToContent from '@/components/SkipToContent';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const Index = () => {
  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background pb-24"
        lang="id"
      >
        {/* Accessibility: Skip to main content */}
        <SkipToContent contentId="main-content" />
        
        {/* Offline Status Banner */}
        <OfflineIndicator />
        
        {/* Header with ARIA landmark */}
        <header role="banner">
          <SpiritualHeader />
        </header>
        
        {/* Main Content with ARIA landmark */}
        <main 
          id="main-content" 
          className="flex-1 flex flex-col"
          role="main"
          tabIndex={-1}
          aria-label="Konten utama Dream OS"
        >
          <Suspense fallback={<LoadingSkeleton variant="page" />}>
            <section aria-label="Banner slider">
              <HeroSlider />
            </section>
            <section aria-label="Daftar modul aplikasi">
              <ModuleGrid />
            </section>
          </Suspense>
        </main>
        
        {/* Footer with ARIA landmark */}
        <footer role="contentinfo">
          <Footer />
        </footer>
        
        {/* Navigation with ARIA landmark */}
        <nav role="navigation" aria-label="Navigasi utama">
          <DreamBottomNav />
        </nav>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
