
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function createSupabaseClient(req: Request) {
  // Create a Supabase client with the Auth context of the logged-in user
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );

  return supabaseClient;
}
