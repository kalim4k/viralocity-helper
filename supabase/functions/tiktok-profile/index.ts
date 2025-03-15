
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
    
    // First, fetch user profile
    const profileUrl = `https://${API_HOST}/getuser/${cleanUsername}`;
    
    const profileResponse = await fetch(profileUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });
    
    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error(`API error (${profileResponse.status}): ${errorText}`);
      return new Response(
        JSON.stringify({ error: `API error (${profileResponse.status}): ${errorText}` }),
        { 
          status: profileResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const profileData = await profileResponse.json();
    
    if (profileData.status !== 200) {
      console.error('API returned error status:', profileData);
      return new Response(
        JSON.stringify({ error: `Error: ${JSON.stringify(profileData)}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Now, fetch user videos
    const videosUrl = `https://${API_HOST}/user/videos/${cleanUsername}`;
    
    let videosData = null;
    
    try {
      const videosResponse = await fetch(videosUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      });
      
      if (videosResponse.ok) {
        videosData = await videosResponse.json();
        
        if (videosData.status !== 200) {
          console.warn('Videos API returned error status:', videosData);
          videosData = null;
        }
      } else {
        console.warn(`Videos API error (${videosResponse.status})`);
      }
    } catch (videosError) {
      console.warn('Error fetching videos:', videosError);
    }
    
    // Merge profile and videos data
    const mergedData = {
      ...profileData,
      data: {
        ...profileData.data,
        itemList: videosData?.data?.items || []
      }
    };
    
    // Return the merged API response
    return new Response(
      JSON.stringify(mergedData),
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
