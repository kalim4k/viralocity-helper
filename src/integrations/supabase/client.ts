
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://trvivjdizuimjvjxqcuu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydml2amRpenVpbWp2anhxY3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMzQxNjMsImV4cCI6MjA1NjcxMDE2M30.gcKceXOd0HCbo_uAgDVc0MWUwrCGeL4pRxgttw_K6GY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
