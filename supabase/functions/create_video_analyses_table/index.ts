
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged-in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Execute SQL to create the video_analyses table if it doesn't exist
    const { data, error } = await supabaseClient.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS public.video_analyses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) NOT NULL,
          video_id TEXT NOT NULL,
          video_url TEXT,
          video_data JSONB NOT NULL,
          analysis_results JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        -- Add Row Level Security (RLS)
        ALTER TABLE public.video_analyses ENABLE ROW LEVEL SECURITY;
        
        -- Allow users to see only their own video analyses
        CREATE POLICY "Users can view their own video analyses"
          ON public.video_analyses
          FOR SELECT
          USING (auth.uid() = user_id);
        
        -- Allow users to insert only their own video analyses
        CREATE POLICY "Users can insert their own video analyses"
          ON public.video_analyses
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);
      `
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Table video_analyses created successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
