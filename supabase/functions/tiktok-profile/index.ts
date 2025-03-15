
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// API configuration
const API_KEY = Deno.env.get("RAPIDAPI_KEY") || "bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e";
const API_HOST = "tiktok-user.p.rapidapi.com";

// CORS headers
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
    // Get username from request
    const { username } = await req.json();
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log(`Fetching TikTok profile for username: ${username}`);

    // Remove @ from username if present
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    const url = `https://${API_HOST}/getuser/${cleanUsername}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      return new Response(
        JSON.stringify({ error: `API error (${response.status}): ${errorText}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const data = await response.json();
    
    if (data.status !== 200) {
      console.error('API returned error status:', data);
      return new Response(
        JSON.stringify({ error: `Error: ${JSON.stringify(data)}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Return the raw API response, we'll map it in the frontend
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
