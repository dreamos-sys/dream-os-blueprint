import { motion } from 'framer-motion';

const SpiritualHeader = () => {
  return (
    <motion.header 
      className="spiritual-header sticky top-0 z-50 w-full py-4 px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-2">
        {/* Bismillah */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-bidara to-transparent" />
          <h1 className="font-arabic text-2xl md:text-3xl text-bidara font-bold tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </h1>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-bidara to-transparent" />
        </motion.div>
        
        {/* Shalawat */}
        <motion.p 
          className="font-arabic text-lg md:text-xl text-primary opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى اٰلِهِ وَصَحْبِهِ وَسَلِّمْ
        </motion.p>
        
        {/* Dream OS Badge */}
        <motion.div 
          className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <span className="text-xs font-semibold text-primary">🌹 DREAM OS</span>
          <span className="text-xs text-muted-foreground">v13.0</span>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default SpiritualHeader;
