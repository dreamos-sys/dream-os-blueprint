import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  moduleIcon: React.ReactNode;
  correctPassword: string;
  onSuccess: () => void;
}

const PasswordModal = ({
  isOpen,
  onClose,
  moduleName,
  moduleIcon,
  correctPassword,
  onSuccess,
}: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      setIsSuccess(true);
      setError('');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1000);
    } else {
      setError('Password salah! Coba lagi.');
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-deep/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="glass-card rounded-3xl p-6 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-rose-glow flex items-center justify-center text-primary-foreground mb-4"
                  animate={isSuccess ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isSuccess ? <CheckCircle className="w-10 h-10" /> : moduleIcon}
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">{moduleName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Masukkan password untuk akses
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-14 text-lg rounded-xl border-2 focus:border-primary"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-destructive text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Message */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-secondary text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Akses diberikan! Mengalihkan...
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-rose-glow hover:opacity-90 transition-opacity"
                  disabled={!password || isSuccess}
                >
                  {isSuccess ? 'Berhasil! ✓' : 'Masuk 🔓'}
                </Button>
              </form>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Enkripsi Duri Bidara 🌵 Aktif</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PasswordModal;
