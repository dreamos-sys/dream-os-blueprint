import SpiritualHeader from '@/components/SpiritualHeader';
import HeroSlider from '@/components/HeroSlider';
import ModuleGrid from '@/components/ModuleGrid';
import Footer from '@/components/Footer';
import DreamBottomNav from '@/components/DreamBottomNav';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background pb-24">
      <SpiritualHeader />
      <main className="flex-1 flex flex-col">
        <HeroSlider />
        <ModuleGrid />
      </main>
      <Footer />
      <DreamBottomNav />
    </div>
  );
};

export default Index;
