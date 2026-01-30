import { motion } from 'framer-motion';
import { Shield, Fingerprint, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="w-full py-6 px-4 mt-auto"
    >
      <div className="max-w-4xl mx-auto">
        {/* Security Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
            <Shield className="w-3 h-3 text-bidara" />
            <span>ISO 27001</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
            <Fingerprint className="w-3 h-3 text-primary" />
            <span>Enkripsi Quantum</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 text-rose-deep" />
            <span>Depok Zone</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            🌹 Dream OS v13.0 • Ghost Architect Mode
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            © 2025 Al-Fikri • Duri Bidara Protection Active 🌵
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
