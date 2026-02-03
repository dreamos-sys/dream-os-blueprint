import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.269ec01603874f81836dcede76b72b66',
  appName: 'Dream OS v13.0 - Al Fikri',
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
    backgroundColor: '#FDF8FA',
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
    backgroundColor: '#FDF8FA',
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
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FDF8FA',
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'Splash',
      showSpinner: true,
      spinnerColor: '#E8A0BF',
    },

    // Status Bar
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#E8A0BF',
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
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#E8A0BF',
      sound: 'notification.wav',
    },
  },

  // Logging (disable in production)
  loggingBehavior: 'debug',
};

export default config;
