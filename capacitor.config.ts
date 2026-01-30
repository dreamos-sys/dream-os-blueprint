import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.269ec01603874f81836dcede76b72b66',
  appName: 'Dream OS v13.0 - Al Fikri',
  webDir: 'dist',
  server: {
    url: 'https://269ec016-0387-4f81-836d-cede76b72b66.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // Biometric Auth for Fingerprint
    BiometricAuth: {
      reason: 'Architect Mode Authentication - Redmi Note 9 Pro'
    }
  }
};

export default config;
