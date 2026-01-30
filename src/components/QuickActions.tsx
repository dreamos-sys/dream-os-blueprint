import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Printer, Fingerprint, Wifi } from 'lucide-react';
import QRScanner from './QRScanner';
import PrinterPanel from './PrinterPanel';
import BiometricAuth from './BiometricAuth';

interface QuickActionsProps {
  onArchitectAccess?: () => void;
}

const QuickActions = ({ onArchitectAccess }: QuickActionsProps) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPrinter, setShowPrinter] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleQRScan = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      setScanResult(parsed);
      console.log('QR Scan Result:', parsed);
    } catch {
      setScanResult({ raw: data });
    }
  };

  const handleArchitectSuccess = () => {
    console.log('🔓 Architect Mode Activated!');
    onArchitectAccess?.();
  };

  const actions = [
    {
      icon: <QrCode className="w-5 h-5" />,
      label: 'Scan QR',
      color: 'from-primary to-rose-glow',
      onClick: () => setShowQRScanner(true)
    },
    {
      icon: <Printer className="w-5 h-5" />,
      label: 'Printer',
      color: 'from-bidara to-secondary',
      onClick: () => setShowPrinter(true)
    },
    {
      icon: <Fingerprint className="w-5 h-5" />,
      label: 'Biometrik',
      color: 'from-gold-shine to-primary',
      onClick: () => setShowBiometric(true)
    },
    {
      icon: <Wifi className="w-5 h-5" />,
      label: 'WiFi',
      color: 'from-secondary to-bidara',
      onClick: () => setShowPrinter(true) // Opens printer panel which shows WiFi status
    }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto px-4 py-4"
      >
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {actions.map((action, index) => (
            <motion.button
              key={action.label}
              onClick={action.onClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${action.color} text-primary-foreground text-sm font-medium shadow-lg`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {action.icon}
              <span>{action.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Scan Result Display */}
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl bg-muted/50 border border-muted"
          >
            <p className="text-sm font-medium text-foreground mb-2">📦 Hasil Scan Terakhir:</p>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {JSON.stringify(scanResult, null, 2)}
            </pre>
          </motion.div>
        )}
      </motion.div>

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
        onSuccess={handleArchitectSuccess}
      />
    </>
  );
};

export default QuickActions;
