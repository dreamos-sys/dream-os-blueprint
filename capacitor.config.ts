import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.269ec01603874f81836dcede76b72b66',
  appName: 'mawar-duri-os',
  webDir: 'dist',
  
  // Development server for hot-reload
  server: {
    url: 'https://269ec016-0387-4f81-836d-cede76b72b66.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    // Enable for production APK (remove server.url)
    // androidScheme: 'https'
  },

  // Android-specific configuration
  android: {
    // Allow mixed content for development
    allowMixedContent: true,
    // Capture navigation for SPA
    captureInput: true,
    // WebView debugging (disable in production)
    webContentsDebuggingEnabled: true,
    // Background color matching theme
    backgroundColor: '#0A1F0A',
    // Status bar
    overrideUserAgent: 'DreamOS/13.0 Android',
    // Splash screen
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      signingType: 'apksigner',
    }
  },

  // iOS-specific configuration  
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0A1F0A',
    overrideUserAgent: 'DreamOS/13.0 iOS',
    preferredContentMode: 'mobile',
  },

  // Plugins configuration
  plugins: {
    // Biometric Authentication
    BiometricAuth: {
      reason: 'Architect Mode Authentication - Dream OS v13.0',
      androidBiometryType: 'FINGERPRINT',
      iosBiometryType: 'TOUCH_ID',
    },
    
    // Splash Screen
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#0A1F0A',
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'Splash',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },

    // Status Bar
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A1F0A',
    },

    // Keyboard
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },

    // App Preferences (secure storage)
    Preferences: {
      // Uses SharedPreferences on Android, UserDefaults on iOS
    },

    // Local Notifications
    LocalNotifications: {
      smallIcon: 'ic_stat_dreamos',
      iconColor: '#D4AF37',
      sound: 'notification.wav',
    },
  },

  // Logging (disable in production)
  loggingBehavior: 'debug',
};

export default config;
