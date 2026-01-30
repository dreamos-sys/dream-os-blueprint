import SpiritualHeader from '@/components/SpiritualHeader';
import HeroSlider from '@/components/HeroSlider';
import ModuleGrid from '@/components/ModuleGrid';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
      <SpiritualHeader />
      <main className="flex-1 flex flex-col">
        <HeroSlider />
        <ModuleGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
