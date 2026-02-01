import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Clock, Bell, Shield, QrCode, Printer, Fingerprint } from 'lucide-react';
import { useNativeCapabilities } from '@/hooks/useNativeCapabilities';
import QRScanner from './QRScanner';
import PrinterPanel from './PrinterPanel';
import BiometricAuth from './BiometricAuth';

type TabType = 'home' | 'activity' | 'notifications' | 'profile';
type FabMode = 'qr' | 'printer' | 'biometric';
type DepokStatus = 'secure' | 'warning' | 'offline';

const DreamBottomNav = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [fabMode, setFabMode] = useState<FabMode>('qr');
  const [isGhostActive, setIsGhostActive] = useState(false);
  const [depokStatus, setDepokStatus] = useState<DepokStatus>('secure');
  const [showModeLabel, setShowModeLabel] = useState(false);
  
  // Modal states
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPrinter, setShowPrinter] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const capabilities = useNativeCapabilities();

  // Depok Zone Health Check Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      setDepokStatus(
        random > 0.95 ? 'warning' : 
        random > 0.02 ? 'secure' : 'offline'
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFabPress = () => {
    if (fabMode === 'qr') {
      setShowQRScanner(true);
    } else if (fabMode === 'printer') {
      setShowPrinter(true);
    } else if (fabMode === 'biometric') {
      setShowBiometric(true);
    }
  };

  const handleFabLongPressStart = () => {
    longPressTimer.current = setTimeout(() => {
      // Cycle through modes
      setFabMode(prev => {
        const modes: FabMode[] = ['qr', 'printer', 'biometric'];
        const idx = modes.indexOf(prev);
        return modes[(idx + 1) % modes.length];
      });
      setShowModeLabel(true);
      setTimeout(() => setShowModeLabel(false), 1500);
      
      // Haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 800);
  };

  const handleFabLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleBiometricSuccess = () => {
    setIsGhostActive(true);
    console.log('🔓 Ghost Architect Mode Activated!');
    setTimeout(() => setIsGhostActive(false), 3000);
  };

  const handleQRScan = (data: string) => {
    console.log('📦 QR Scanned:', data);
  };

  const getDepokStatusConfig = () => {
    switch (depokStatus) {
      case 'secure':
        return { color: 'bg-emerald-500', text: 'Depok Zone Active', icon: '🟢' };
      case 'warning':
        return { color: 'bg-amber-500', text: 'Network Anomaly', icon: '🟠' };
      case 'offline':
        return { color: 'bg-red-500', text: 'Offline Mode', icon: '🔴' };
    }
  };

  const statusConfig = getDepokStatusConfig();

  const tabs = [
    { id: 'home' as TabType, icon: Home, label: 'Home', activeColor: 'text-primary shadow-primary/30' },
    { id: 'activity' as TabType, icon: Clock, label: 'Activity', activeColor: 'text-secondary shadow-secondary/30' },
    { id: 'notifications' as TabType, icon: Bell, label: 'Notif', activeColor: 'text-gold-shine shadow-gold-shine/30' },
    { id: 'profile' as TabType, icon: Shield, label: 'Profile', activeColor: 'text-bidara shadow-bidara/30' },
  ];

  const fabIcons = {
    qr: QrCode,
    printer: Printer,
    biometric: Fingerprint,
  };

  const fabLabels = {
    qr: 'Scan',
    printer: 'Print',
    biometric: 'Bio',
  };

  const FabIcon = fabIcons[fabMode];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        {/* Depok Zone Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-[10px]"
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${statusConfig.color}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-muted-foreground font-medium">{statusConfig.text}</span>
        </motion.div>

        {/* Main Nav Container */}
        <div className="relative mx-4 mb-4">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 rounded-3xl bg-card/80 backdrop-blur-xl border border-white/20 shadow-lg dark:bg-card/90 dark:border-white/10" />
          
          {/* Nav Content */}
          <div className="relative flex items-center justify-around py-2 px-4">
            {/* Left Tabs */}
            {tabs.slice(0, 2).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative p-3 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? `${tab.activeColor} scale-110 shadow-lg` 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl bg-primary/10"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* CENTER FAB — The Dream Key */}
            <div className="relative -mt-8">
              <motion.button
                onClick={handleFabPress}
                onTouchStart={handleFabLongPressStart}
                onTouchEnd={handleFabLongPressEnd}
                onMouseDown={handleFabLongPressStart}
                onMouseUp={handleFabLongPressEnd}
                onMouseLeave={handleFabLongPressEnd}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isGhostActive
                    ? 'bg-gradient-to-br from-gold-shine to-primary'
                    : 'bg-gradient-to-br from-primary to-rose-glow'
                }`}
                style={{
                  boxShadow: isGhostActive
                    ? '0 0 30px rgba(255, 215, 0, 0.6), 0 8px 25px -5px rgba(0,0,0,0.3)'
                    : '0 0 25px hsl(340 80% 75% / 0.5), 0 8px 25px -5px rgba(0,0,0,0.3)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isGhostActive ? { rotate: [0, 360] } : {}}
                transition={isGhostActive ? { duration: 0.5 } : {}}
              >
                {/* Pulse Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary-foreground/30"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Icon */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={fabMode}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                    className="text-primary-foreground"
                  >
                    <FabIcon className="w-7 h-7" />
                  </motion.div>
                </AnimatePresence>

                {/* Ghost Mode Indicator */}
                {isGhostActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-shine flex items-center justify-center text-[8px]"
                  >
                    ⚡
                  </motion.div>
                )}
              </motion.button>

              {/* Mode Label */}
              <AnimatePresence>
                {showModeLabel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-foreground text-background text-[10px] font-medium whitespace-nowrap"
                  >
                    {fabLabels[fabMode]}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rose Emoji (Default) or Lightning (Ghost Mode) */}
              <motion.div
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isGhostActive ? '⚡' : '🌹'}
              </motion.div>
            </div>

            {/* Right Tabs */}
            {tabs.slice(2, 4).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative p-3 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? `${tab.activeColor} scale-110 shadow-lg` 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl bg-primary/10"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />

      <PrinterPanel
        isOpen={showPrinter}
        onClose={() => setShowPrinter(false)}
      />

      <BiometricAuth
        isOpen={showBiometric}
        onClose={() => setShowBiometric(false)}
        onSuccess={handleBiometricSuccess}
      />
    </>
  );
};

export default DreamBottomNav;
