import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Simple hash function for password comparison (use bcrypt in production)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
}

// Password mapping for modules (stored securely on server-side only)
const modulePasswords: Record<number, string> = {
  1: 'user_@1234',        // Booking Sarana
  2: 'user_@1234',        // Form K3
  3: 'LHPSsec_AF2025',    // Laporan Sekuriti
  4: 'CHCS_AF_@003',      // Janitor Gedung
  5: 'SACS_AF@004',       // Janitor Taman
  6: 'SACS_AF@004',       // Stok & Alat CS
  7: 'M41n_4F@234',       // Maintenance
  8: '4dm1n_AF6969@00',   // R. Kerja Admin
  9: '4dm1n_Sec2025',     // Master Admin
};

// Master credentials (server-side only)
const masterKey = 'Mr.M_Architect_2025';
const triggerCode = '012443410';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { moduleId, password, authType } = await req.json();

    // Get client info for logging
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Get user from auth header if present
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      userId = user?.id || null;
    }

    console.log(`[verify-module-access] Module: ${moduleId}, AuthType: ${authType}, IP: ${ipAddress}`);

    let isValid = false;

    if (authType === 'architect') {
      // Verify architect credentials
      isValid = password === masterKey || password === triggerCode;
      console.log(`[verify-module-access] Architect auth attempt: ${isValid ? 'SUCCESS' : 'FAILED'}`);
    } else if (authType === 'module') {
      // Verify module password
      if (!moduleId || !modulePasswords[moduleId]) {
        console.log(`[verify-module-access] Invalid module ID: ${moduleId}`);
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid module ID' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 400 
          }
        );
      }

      isValid = password === modulePasswords[moduleId];
      console.log(`[verify-module-access] Module ${moduleId} auth attempt: ${isValid ? 'SUCCESS' : 'FAILED'}`);
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid auth type' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // Log access attempt
    try {
      await supabaseClient.rpc('log_module_access', {
        p_module_id: moduleId || null,
        p_user_id: userId,
        p_ip_address: ipAddress.substring(0, 45),
        p_user_agent: userAgent.substring(0, 255),
        p_success: isValid
      });
    } catch (logError) {
      console.error('[verify-module-access] Failed to log access:', logError);
    }

    // Add delay on failed attempts to prevent brute force
    if (!isValid) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({ 
        success: isValid,
        message: isValid ? 'Access granted' : 'Invalid password'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: isValid ? 200 : 401 
      }
    );

  } catch (error) {
    console.error('[verify-module-access] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});