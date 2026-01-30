import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shield, Sparkles, Heart, Zap, Star } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Dream OS v13.0",
    subtitle: "Sistem Manajemen Fasilitas Cerdas Al-Fikri",
    icon: <Sparkles className="w-16 h-16" />,
    gradient: "from-primary via-rose-glow to-accent",
  },
  {
    id: 2,
    title: "Mawar Genit 🌹",
    subtitle: "Tampilan Cantik dengan Keamanan Tingkat Tinggi",
    icon: <Heart className="w-16 h-16" />,
    gradient: "from-rose-glow via-primary to-rose-deep",
  },
  {
    id: 3,
    title: "Duri Bidara 🌵",
    subtitle: "Proteksi Multi-Layer dengan Enkripsi Quantum",
    icon: <Shield className="w-16 h-16" />,
    gradient: "from-bidara via-bidara-dark to-secondary",
  },
  {
    id: 4,
    title: "Smart Routing",
    subtitle: "Otomasi Pintar untuk Setiap Laporan K3",
    icon: <Zap className="w-16 h-16" />,
    gradient: "from-gold-shine via-primary to-rose-glow",
  },
  {
    id: 5,
    title: "ISO Certified",
    subtitle: "Standar 9001, 27001 & 55001 Terintegrasi",
    icon: <Star className="w-16 h-16" />,
    gradient: "from-secondary via-bidara to-bidara-dark",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8">
      {/* Main Slider */}
      <div className="relative h-64 md:h-80 overflow-hidden rounded-3xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br ${slides[currentSlide].gradient}`}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-primary-foreground mb-4 animate-float"
            >
              {slides[currentSlide].icon}
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl md:text-4xl font-bold text-primary-foreground text-center mb-2"
            >
              {slides[currentSlide].title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-sm md:text-lg text-primary-foreground/90 text-center max-w-md"
            >
              {slides[currentSlide].subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/40 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/40 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
