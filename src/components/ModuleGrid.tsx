import { useState } from 'react';
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
import PasswordModal from './PasswordModal';
import ModulePage from './ModulePage';

interface Module {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  password: string;
  color: string;
}

const modules: Module[] = [
  {
    id: 1,
    name: 'Booking Sarana',
    description: 'Reservasi ruangan & fasilitas',
    icon: <Calendar className="w-8 h-8" />,
    password: 'user_@1234',
    color: 'from-primary to-rose-glow',
  },
  {
    id: 2,
    name: 'Form K3',
    description: 'Laporan Keselamatan Kerja',
    icon: <ClipboardList className="w-8 h-8" />,
    password: 'user_@1234',
    color: 'from-bidara to-secondary',
  },
  {
    id: 3,
    name: 'Laporan Sekuriti',
    description: 'Shift & monitoring keamanan',
    icon: <Shield className="w-8 h-8" />,
    password: 'LHPSsec_AF2025',
    color: 'from-navy-deep to-bidara-dark',
  },
  {
    id: 4,
    name: 'Janitor Gedung',
    description: 'Ceklis kebersihan 32 ruangan',
    icon: <Building2 className="w-8 h-8" />,
    password: 'CHCS_AF_@003',
    color: 'from-rose-deep to-primary',
  },
  {
    id: 5,
    name: 'Janitor Taman',
    description: 'Outdoor & playground',
    icon: <TreePine className="w-8 h-8" />,
    password: 'SACS_AF@004',
    color: 'from-bidara to-bidara-dark',
  },
  {
    id: 6,
    name: 'Stok & Alat CS',
    description: 'Monitoring perlengkapan',
    icon: <Package className="w-8 h-8" />,
    password: 'SACS_AF@004',
    color: 'from-gold-shine to-primary',
  },
  {
    id: 7,
    name: 'Maintenance',
    description: 'Ticket perbaikan fasilitas',
    icon: <Wrench className="w-8 h-8" />,
    password: 'M41n_4F@234',
    color: 'from-secondary to-bidara',
  },
  {
    id: 8,
    name: 'R. Kerja Admin',
    description: 'Approval & monitoring',
    icon: <UserCog className="w-8 h-8" />,
    password: '4dm1n_AF6969@00',
    color: 'from-primary to-rose-deep',
  },
  {
    id: 9,
    name: 'Master Admin',
    description: 'Konfigurasi & audit log',
    icon: <Settings2 className="w-8 h-8" />,
    password: '4dm1n_Sec2025',
    color: 'from-navy-deep to-rose-deep',
  },
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
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessedModule, setAccessedModule] = useState<Module | null>(null);

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

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            User Umum: <span className="font-mono text-primary">user_@1234</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Akses Booking & K3)
          </p>
        </motion.div>
      </motion.div>

      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        moduleName={selectedModule?.name || ''}
        moduleIcon={selectedModule?.icon}
        correctPassword={selectedModule?.password || ''}
        onSuccess={handlePasswordSuccess}
      />
    </>
  );
};

export default ModuleGrid;
