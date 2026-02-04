import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ClipboardList,
  Shield,
  Building2,
  TreePine,
  Package,
  Wrench,
  UserCog,
  Settings2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PasswordModal from './PasswordModal';
import ModulePage from './ModulePage';

interface Module {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// Icon mapping - icons are safe to keep client-side
const iconMap: Record<string, React.ReactNode> = {
  Calendar: <Calendar className="w-8 h-8" />,
  ClipboardList: <ClipboardList className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Building2: <Building2 className="w-8 h-8" />,
  TreePine: <TreePine className="w-8 h-8" />,
  Package: <Package className="w-8 h-8" />,
  Wrench: <Wrench className="w-8 h-8" />,
  UserCog: <UserCog className="w-8 h-8" />,
  Settings2: <Settings2 className="w-8 h-8" />,
};

// Fallback modules for offline/loading state
const fallbackModules: Module[] = [
  { id: 1, name: 'Booking Sarana', description: 'Reservasi ruangan & fasilitas', icon: <Calendar className="w-8 h-8" />, color: 'from-primary to-rose-glow' },
  { id: 2, name: 'Form K3', description: 'Laporan Keselamatan Kerja', icon: <ClipboardList className="w-8 h-8" />, color: 'from-bidara to-secondary' },
  { id: 3, name: 'Laporan Sekuriti', description: 'Shift & monitoring keamanan', icon: <Shield className="w-8 h-8" />, color: 'from-navy-deep to-bidara-dark' },
  { id: 4, name: 'Janitor Gedung', description: 'Ceklis kebersihan 32 ruangan', icon: <Building2 className="w-8 h-8" />, color: 'from-rose-deep to-primary' },
  { id: 5, name: 'Janitor Taman', description: 'Outdoor & playground', icon: <TreePine className="w-8 h-8" />, color: 'from-bidara to-bidara-dark' },
  { id: 6, name: 'Stok & Alat CS', description: 'Monitoring perlengkapan', icon: <Package className="w-8 h-8" />, color: 'from-gold-shine to-primary' },
  { id: 7, name: 'Maintenance', description: 'Ticket perbaikan fasilitas', icon: <Wrench className="w-8 h-8" />, color: 'from-secondary to-bidara' },
  { id: 8, name: 'R. Kerja Admin', description: 'Approval & monitoring', icon: <UserCog className="w-8 h-8" />, color: 'from-primary to-rose-deep' },
  { id: 9, name: 'Master Admin', description: 'Konfigurasi & audit log', icon: <Settings2 className="w-8 h-8" />, color: 'from-navy-deep to-rose-deep' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ModuleGrid = () => {
  const [modules, setModules] = useState<Module[]>(fallbackModules);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessedModule, setAccessedModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch modules from database (without passwords - those stay server-side)
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('id, name, description, color, icon_name')
          .order('id');

        if (error) {
          console.error('[ModuleGrid] Error fetching modules:', error);
          return;
        }

        if (data) {
          const mappedModules: Module[] = data.map((m) => ({
            id: m.id,
            name: m.name,
            description: m.description || '',
            icon: iconMap[m.icon_name || 'Settings2'] || <Settings2 className="w-8 h-8" />,
            color: m.color || 'from-primary to-secondary',
          }));
          setModules(mappedModules);
        }
      } catch (err) {
        console.error('[ModuleGrid] Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handlePasswordSuccess = () => {
    setAccessedModule(selectedModule);
  };

  const handleBackToGrid = () => {
    setAccessedModule(null);
  };

  if (accessedModule) {
    return <ModulePage module={accessedModule} onBack={handleBackToGrid} />;
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto px-4 py-8"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground"
        >
          9 Modul Strategis 🌹
        </motion.h2>

        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {modules.map((module) => (
            <motion.div
              key={module.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModuleClick(module)}
              className="icon-card group"
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-primary-foreground mb-3 mx-auto group-hover:shadow-lg transition-shadow`}
              >
                {module.icon}
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-foreground text-center line-clamp-2">
                {module.name}
              </h3>
              <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-1 hidden md:block">
                {module.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Secure access notice - no passwords displayed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            🔒 Akses aman dengan verifikasi server
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Hubungi administrator untuk kredensial
          </p>
        </motion.div>
      </motion.div>

      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        moduleName={selectedModule?.name || ''}
        moduleIcon={selectedModule?.icon}
        moduleId={selectedModule?.id || 0}
        onSuccess={handlePasswordSuccess}
      />
    </>
  );
};

export default ModuleGrid;