import { useState, useEffect, useCallback } from 'react';

// Native capability detection
export interface NativeCapabilities {
  isNative: boolean;
  hasBiometric: boolean;
  hasCamera: boolean;
  hasWifi: boolean;
  deviceModel: string;
  isRedmiNote9Pro: boolean;
}

// Check if running in Capacitor native app
const isNativeApp = (): boolean => {
  return typeof (window as any).Capacitor !== 'undefined';
};

// Device detection
const detectDevice = (): { model: string; isRedmiNote9Pro: boolean } => {
  const ua = navigator.userAgent;
  const isRedmiNote9Pro = ua.includes('Redmi Note 9 Pro') || ua.includes('M2003J6A1G');
  return {
    model: isRedmiNote9Pro ? 'Redmi Note 9 Pro' : 'Unknown Device',
    isRedmiNote9Pro
  };
};

export const useNativeCapabilities = () => {
  const [capabilities, setCapabilities] = useState<NativeCapabilities>({
    isNative: false,
    hasBiometric: false,
    hasCamera: false,
    hasWifi: false,
    deviceModel: 'Unknown',
    isRedmiNote9Pro: false
  });

  useEffect(() => {
    const detectCapabilities = async () => {
      const isNative = isNativeApp();
      const device = detectDevice();
      
      // Check for biometric support
      let hasBiometric = false;
      if ('credentials' in navigator && 'PublicKeyCredential' in window) {
        try {
          hasBiometric = await (window as any).PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        } catch {
          hasBiometric = false;
        }
      }

      // Check for camera support
      let hasCamera = false;
      if ('mediaDevices' in navigator) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          hasCamera = devices.some(d => d.kind === 'videoinput');
        } catch {
          hasCamera = false;
        }
      }

      setCapabilities({
        isNative,
        hasBiometric,
        hasCamera,
        hasWifi: 'connection' in navigator,
        deviceModel: device.model,
        isRedmiNote9Pro: device.isRedmiNote9Pro
      });
    };

    detectCapabilities();
  }, []);

  return capabilities;
};

// Biometric Authentication Hook
export const useBiometricAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async (): Promise<boolean> => {
    setIsAuthenticating(true);
    setError(null);

    try {
      // Check if WebAuthn is available
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric not supported');
      }

      // Create a challenge for biometric auth
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Request biometric authentication
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'Dream OS v13.0' },
          user: {
            id: new Uint8Array(16),
            name: 'architect@alfikri.sch.id',
            displayName: 'Architect Mode'
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000
        }
      });

      if (credential) {
        setIsAuthenticated(true);
        setIsAuthenticating(false);
        return true;
      }
      
      throw new Error('Authentication failed');
    } catch (err: any) {
      // Fallback: simulate for demo if biometric not available
      if (err.name === 'NotSupportedError' || err.message === 'Biometric not supported') {
        // In demo mode, show a simulated fingerprint scanner
        setError('Biometric tidak tersedia. Gunakan password Architect.');
      } else {
        setError(err.message || 'Authentication failed');
      }
      setIsAuthenticating(false);
      return false;
    }
  }, []);

  return { authenticate, isAuthenticating, isAuthenticated, error };
};
