import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, QrCode, Flashlight, SwitchCamera, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNativeCapabilities } from '@/hooks/useNativeCapabilities';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
  title?: string;
}

const QRScanner = ({ isOpen, onClose, onScan, title = 'Scan QR Inventaris' }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const { hasCamera } = useNativeCapabilities();

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsScanning(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera aktif.');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  }, [stream]);

  const toggleFlash = useCallback(async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flashOn } as any]
        });
        setFlashOn(!flashOn);
      }
    }
  }, [stream, flashOn]);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, [stopCamera]);

  // Simulate QR scan for demo (in production, use a QR scanning library)
  const simulateScan = useCallback(() => {
    const mockQRData = JSON.stringify({
      type: 'INVENTARIS',
      id: 'INV-2025-001',
      name: 'Projector Epson EB-X51',
      location: 'R. Meeting Lt.2',
      condition: 'Baik',
      lastCheck: new Date().toISOString()
    });
    onScan(mockQRData);
    stopCamera();
    onClose();
  }, [onScan, stopCamera, onClose]);

  useEffect(() => {
    if (isOpen && hasCamera) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, hasCamera]);

  useEffect(() => {
    if (isOpen && facingMode) {
      startCamera();
    }
  }, [facingMode]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-deep/90 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="glass-card rounded-3xl overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-muted">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-rose-glow flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground">Arahkan ke QR Code aset</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Camera View */}
              <div className="flex-1 relative bg-black">
                {error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertTriangle className="w-16 h-16 text-gold-shine mb-4" />
                    <p className="text-primary-foreground mb-4">{error}</p>
                    <Button onClick={startCamera} className="bg-primary">
                      Coba Lagi
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Scanner Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-64 h-64 border-4 border-primary rounded-3xl"
                        animate={{
                          borderColor: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--primary))']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {/* Corner markers */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-gold-shine rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-gold-shine rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-gold-shine rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-gold-shine rounded-br-lg" />
                        
                        {/* Scan line animation */}
                        <motion.div
                          className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent"
                          animate={{ top: ['10%', '90%', '10%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    </div>

                    {/* Camera Controls */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFlash}
                        className="w-12 h-12 rounded-full bg-background/50 backdrop-blur"
                      >
                        <Flashlight className={`w-5 h-5 ${flashOn ? 'text-gold-shine' : 'text-foreground'}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={switchCamera}
                        className="w-12 h-12 rounded-full bg-background/50 backdrop-blur"
                      >
                        <SwitchCamera className="w-5 h-5 text-foreground" />
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-muted">
                <Button
                  onClick={simulateScan}
                  className="w-full h-12 bg-gradient-to-r from-bidara to-secondary text-primary-foreground font-semibold rounded-xl"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Simulasi Scan (Demo)
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Kamera aktif: {isScanning ? '🟢 Ya' : '🔴 Tidak'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QRScanner;
