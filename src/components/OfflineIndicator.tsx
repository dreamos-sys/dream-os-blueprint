import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-center gap-3 py-3 px-4">
            <WifiOff className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">
              Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
            </span>
            <button
              onClick={() => window.location.reload()}
              className="p-1.5 rounded-full hover:bg-destructive-foreground/20 transition-colors"
              aria-label="Refresh halaman"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-secondary text-secondary-foreground"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-center gap-3 py-3 px-4">
            <Wifi className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">
              Koneksi dipulihkan! 🎉
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
