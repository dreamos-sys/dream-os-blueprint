import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, X, ShieldCheck, AlertTriangle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBiometricAuth, useNativeCapabilities } from '@/hooks/useNativeCapabilities';

interface BiometricAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  masterKey?: string;
  triggerCode?: string;
}

const BiometricAuth = ({
  isOpen,
  onClose,
  onSuccess,
  masterKey = 'Mr.M_Architect_2025',
  triggerCode = '012443410'
}: BiometricAuthProps) => {
  const [inputCode, setInputCode] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { authenticate, isAuthenticating } = useBiometricAuth();
  const { hasBiometric, isRedmiNote9Pro, deviceModel } = useNativeCapabilities();

  const handleBiometricAuth = async () => {
    const success = await authenticate();
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1000);
    }
  };

  const handleCodeSubmit = () => {
    if (inputCode === triggerCode || inputCode === masterKey) {
      setIsSuccess(true);
      setError('');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1000);
    } else {
      setError('Kode tidak valid! ⚠️');
      setInputCode('');
    }
  };

  const handleClose = () => {
    setInputCode('');
    setError('');
    setShowKeypad(false);
    setIsSuccess(false);
    onClose();
  };

  // Keypad numbers
  const keypadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'];

  const handleKeypadPress = (key: string) => {
    if (key === 'C') {
      setInputCode('');
      setError('');
    } else if (key === '✓') {
      handleCodeSubmit();
    } else {
      setInputCode(prev => prev + key);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-deep/80 backdrop-blur-md z-50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4"
          >
            <div className="glass-card rounded-3xl p-6 shadow-2xl border-2 border-primary/30">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isSuccess 
                      ? 'bg-gradient-to-br from-secondary to-bidara' 
                      : 'bg-gradient-to-br from-primary to-rose-glow'
                  }`}
                  animate={isSuccess ? { scale: [1, 1.2, 1] } : isAuthenticating ? { scale: [1, 0.95, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isAuthenticating ? Infinity : 0 }}
                >
                  {isSuccess ? (
                    <ShieldCheck className="w-12 h-12 text-primary-foreground" />
                  ) : (
                    <Fingerprint className="w-12 h-12 text-primary-foreground" />
                  )}
                </motion.div>
                
                <h3 className="text-xl font-bold text-foreground">
                  {isSuccess ? 'Akses Diberikan!' : 'Architect Mode'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isSuccess 
                    ? 'Selamat datang, Architect 👑' 
                    : 'Verifikasi identitas Anda'}
                </p>

                {/* Device Info */}
                <div className="flex items-center justify-center gap-2 mt-3 text-xs">
                  <Smartphone className="w-3 h-3" />
                  <span className={isRedmiNote9Pro ? 'text-secondary' : 'text-muted-foreground'}>
                    {deviceModel}
                    {isRedmiNote9Pro && ' ✓'}
                  </span>
                </div>
              </div>

              {!isSuccess && (
                <>
                  {/* Biometric Button */}
                  {hasBiometric && (
                    <motion.button
                      onClick={handleBiometricAuth}
                      disabled={isAuthenticating}
                      className="w-full py-6 rounded-2xl bg-gradient-to-r from-bidara to-secondary mb-4 flex flex-col items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        animate={isAuthenticating ? { 
                          boxShadow: ['0 0 0 0 rgba(var(--secondary), 0.4)', '0 0 0 20px rgba(var(--secondary), 0)', '0 0 0 0 rgba(var(--secondary), 0.4)']
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="rounded-full"
                      >
                        <Fingerprint className="w-10 h-10 text-primary-foreground" />
                      </motion.div>
                      <span className="text-primary-foreground font-semibold">
                        {isAuthenticating ? 'Memverifikasi...' : 'Sentuh untuk Verifikasi'}
                      </span>
                    </motion.button>
                  )}

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-muted" />
                    <span className="text-xs text-muted-foreground">atau masukkan kode</span>
                    <div className="flex-1 h-px bg-muted" />
                  </div>

                  {/* Code Input */}
                  {!showKeypad ? (
                    <div className="space-y-3">
                      <Input
                        type="password"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Master Key atau Trigger Code"
                        className="h-14 text-center text-lg rounded-xl"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowKeypad(true)}
                          className="flex-1 h-12 rounded-xl"
                        >
                          Keypad 🔢
                        </Button>
                        <Button
                          onClick={handleCodeSubmit}
                          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-rose-glow"
                        >
                          Verifikasi
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Code Display */}
                      <div className="h-14 rounded-xl bg-muted flex items-center justify-center">
                        <span className="text-2xl tracking-widest font-mono">
                          {inputCode.split('').map(() => '•').join('') || '_ _ _ _ _'}
                        </span>
                      </div>

                      {/* Keypad Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {keypadNumbers.map((key) => (
                          <motion.button
                            key={key}
                            onClick={() => handleKeypadPress(key)}
                            className={`h-14 rounded-xl font-bold text-xl ${
                              key === '✓' 
                                ? 'bg-gradient-to-r from-secondary to-bidara text-primary-foreground' 
                                : key === 'C'
                                ? 'bg-destructive/20 text-destructive'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            {key}
                          </motion.button>
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        onClick={() => setShowKeypad(false)}
                        className="w-full"
                      >
                        Kembali ke Input Teks
                      </Button>
                    </div>
                  )}

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2 text-destructive text-sm mt-4"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-3 h-3" />
                <span>Ghost Bypass Protocol 👻</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BiometricAuth;
