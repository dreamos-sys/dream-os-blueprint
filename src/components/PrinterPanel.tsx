import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Printer, Wifi, WifiOff, RefreshCw, Tag, Ticket, 
  CheckCircle, AlertCircle, Loader2, Signal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  discoverPrinters, 
  generateInventoryLabel, 
  generateMaintenanceTicket,
  printToNetworkPrinter,
  checkWifiConnection,
  type PrinterDevice 
} from '@/services/wifiPrinter';

interface PrinterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrinterPanel = ({ isOpen, onClose }: PrinterPanelProps) => {
  const [printers, setPrinters] = useState<PrinterDevice[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState<string | null>(null);
  const [wifiStatus, setWifiStatus] = useState(checkWifiConnection());

  const scanPrinters = async () => {
    setIsScanning(true);
    try {
      const found = await discoverPrinters();
      setPrinters(found);
      // Auto-select first online printer
      const onlinePrinter = found.find(p => p.status === 'online');
      if (onlinePrinter) setSelectedPrinter(onlinePrinter);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePrintLabel = async () => {
    if (!selectedPrinter) return;
    
    setIsPrinting(true);
    setPrintSuccess(null);
    
    const label = generateInventoryLabel({
      id: 'INV-2025-001',
      name: 'Projector Epson EB-X51',
      location: 'R. Meeting Lt.2',
      condition: 'Baik'
    });

    const result = await printToNetworkPrinter(selectedPrinter.id, label);
    setIsPrinting(false);
    
    if (result.success) {
      setPrintSuccess('Label inventaris berhasil dicetak! 🏷️');
    }
  };

  const handlePrintTicket = async () => {
    if (!selectedPrinter) return;
    
    setIsPrinting(true);
    setPrintSuccess(null);
    
    const ticket = generateMaintenanceTicket({
      id: 'TKT-' + Date.now().toString().slice(-6),
      priority: 'medium',
      description: 'AC tidak dingin, perlu pengecekan',
      location: 'Ruang Guru Lt.1',
      reporter: 'Pak Ahmad',
      createdAt: new Date()
    });

    const result = await printToNetworkPrinter(selectedPrinter.id, ticket);
    setIsPrinting(false);
    
    if (result.success) {
      setPrintSuccess('Ticket maintenance berhasil dicetak! 🎫');
    }
  };

  useEffect(() => {
    if (isOpen) {
      scanPrinters();
      setWifiStatus(checkWifiConnection());
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-deep/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:mx-4"
          >
            <div className="glass-card rounded-t-3xl md:rounded-3xl p-6 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bidara to-secondary flex items-center justify-center">
                    <Printer className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Smart WiFi Printer</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {wifiStatus.connected ? (
                        <>
                          <Wifi className="w-3 h-3 text-secondary" />
                          <span>{wifiStatus.ssid}</span>
                          <Signal className="w-3 h-3" />
                          <span>{wifiStatus.strength}%</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3 h-3 text-destructive" />
                          <span>Tidak terhubung</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Printer List */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Printer Tersedia</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={scanPrinters}
                    disabled={isScanning}
                    className="h-8"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Mencari...' : 'Scan'}
                  </Button>
                </div>

                <div className="space-y-2">
                  {printers.length === 0 && !isScanning && (
                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                      <Printer className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Tidak ada printer ditemukan</p>
                    </div>
                  )}

                  {printers.map((printer) => (
                    <motion.button
                      key={printer.id}
                      onClick={() => setSelectedPrinter(printer)}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                        selectedPrinter?.id === printer.id
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-muted/50 border-2 border-transparent hover:bg-muted'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        printer.status === 'online' ? 'bg-secondary/20' : 'bg-muted'
                      }`}>
                        <Printer className={`w-5 h-5 ${
                          printer.status === 'online' ? 'text-secondary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm text-foreground">{printer.name}</p>
                        <p className="text-xs text-muted-foreground">{printer.ip}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        printer.status === 'online' 
                          ? 'bg-secondary/20 text-secondary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {printer.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Print Options */}
              {selectedPrinter && selectedPrinter.status === 'online' && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Cetak:</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handlePrintLabel}
                      disabled={isPrinting}
                      className="h-20 flex-col gap-2 bg-gradient-to-br from-primary to-rose-glow rounded-xl"
                    >
                      <Tag className="w-6 h-6" />
                      <span className="text-xs">Label Inventaris</span>
                    </Button>
                    
                    <Button
                      onClick={handlePrintTicket}
                      disabled={isPrinting}
                      className="h-20 flex-col gap-2 bg-gradient-to-br from-bidara to-secondary rounded-xl"
                    >
                      <Ticket className="w-6 h-6" />
                      <span className="text-xs">Ticket Maintenance</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Print Status */}
              <AnimatePresence>
                {isPrinting && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-4 rounded-xl bg-primary/10 flex items-center gap-3"
                  >
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <span className="text-sm text-foreground">Mencetak...</span>
                  </motion.div>
                )}

                {printSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-4 rounded-xl bg-secondary/10 flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-foreground">{printSuccess}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="mt-6 text-center text-xs text-muted-foreground">
                <p>🖨️ Support: Zebra, Epson, Brother Thermal</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PrinterPanel;
