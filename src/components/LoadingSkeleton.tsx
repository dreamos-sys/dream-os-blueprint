import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  variant?: 'page' | 'card' | 'grid' | 'modal';
}

const LoadingSkeleton = ({ variant = 'page' }: LoadingSkeletonProps) => {
  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-2xl bg-card border border-border"
        aria-label="Memuat konten..."
        role="status"
      >
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
        <span className="sr-only">Memuat konten...</span>
      </motion.div>
    );
  }

  if (variant === 'grid') {
    return (
      <div 
        className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4"
        aria-label="Memuat modul..."
        role="status"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <Skeleton className="w-14 h-14 rounded-xl mx-auto mb-4" />
            <Skeleton className="h-4 w-2/3 mx-auto mb-2" />
            <Skeleton className="h-3 w-1/2 mx-auto" />
          </motion.div>
        ))}
        <span className="sr-only">Memuat modul...</span>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-3xl bg-card"
        aria-label="Memuat dialog..."
        role="status"
      >
        <div className="flex items-center justify-center mb-6">
          <Skeleton className="w-20 h-20 rounded-2xl" />
        </div>
        <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
        <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-14 w-full rounded-xl mb-4" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <span className="sr-only">Memuat dialog...</span>
      </motion.div>
    );
  }

  // Default: page skeleton
  return (
    <div 
      className="min-h-screen p-4 space-y-6"
      aria-label="Memuat halaman..."
      role="status"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      {/* Hero Skeleton */}
      <Skeleton className="h-48 w-full rounded-3xl" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Skeleton className="h-32 w-full rounded-2xl" />
          </motion.div>
        ))}
      </div>
      <span className="sr-only">Memuat halaman...</span>
    </div>
  );
};

export default LoadingSkeleton;
