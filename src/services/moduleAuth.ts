import { supabase } from '@/integrations/supabase/client';

interface VerifyResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Verify module access password via secure backend
 * All password validation happens server-side
 */
export async function verifyModulePassword(
  moduleId: number,
  password: string
): Promise<VerifyResult> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-module-access', {
      body: {
        moduleId,
        password,
        authType: 'module'
      }
    });

    if (error) {
      console.error('[moduleAuth] Verification error:', error);
      return { success: false, error: 'Verification failed' };
    }

    return data as VerifyResult;
  } catch (err) {
    console.error('[moduleAuth] Network error:', err);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Verify architect/master access via secure backend
 */
export async function verifyArchitectAccess(
  password: string
): Promise<VerifyResult> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-module-access', {
      body: {
        password,
        authType: 'architect'
      }
    });

    if (error) {
      console.error('[moduleAuth] Architect verification error:', error);
      return { success: false, error: 'Verification failed' };
    }

    return data as VerifyResult;
  } catch (err) {
    console.error('[moduleAuth] Network error:', err);
    return { success: false, error: 'Network error' };
  }
}