

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createSupabaseClient } from "../_shared/supabase.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Variable pour limiter le taux d'appels
let lastExecutionTime = 0;
const RATE_LIMIT_MS = 3000; // 3 secondes entre les exécutions

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Limiter le taux d'exécution
    const now = Date.now();
    if (now - lastExecutionTime < RATE_LIMIT_MS) {
      console.log("Exécution ignorée - appels trop fréquents");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'License check skipped due to rate limiting',
          skipped: true,
          timestamp: new Date().toISOString()
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    lastExecutionTime = now;
    
    // Get Supabase client using the shared helper
    const supabaseClient = await createSupabaseClient(req);
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Running check_license_expiration function");
    
    // Call the database function to check license expiration
    const { data, error } = await supabaseClient.rpc('check_license_expiration');
    
    if (error) {
      console.error('Error checking license expiration:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("License expiration check completed");
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'License expiration check completed',
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
