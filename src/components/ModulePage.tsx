import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModulePageProps {
  module: {
    id: number;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  };
  onBack: () => void;
}

const ModulePage = ({ module, onBack }: ModulePageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-4xl mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-primary-foreground`}>
            {module.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{module.name}</h1>
            <p className="text-sm text-muted-foreground">{module.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="glass-card rounded-3xl p-6">
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-bidara to-secondary flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Akses Diberikan! ✓
          </h2>
          <p className="text-muted-foreground mb-8">
            Selamat datang di modul {module.name}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-muted/50">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">Hari Ini</p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/50">
              <CheckCircle className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">Selesai</p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/50">
              <AlertTriangle className="w-6 h-6 text-gold-shine mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mt-8 p-6 rounded-2xl border-2 border-dashed border-muted">
            <p className="text-muted-foreground">
              🚧 Fitur lengkap akan segera hadir...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Integrasi database & formulir aktif
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModulePage;
