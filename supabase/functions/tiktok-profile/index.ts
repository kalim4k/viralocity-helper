
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// API configuration
const APIFY_API_KEY = Deno.env.get("APIFY_API_KEY") || "apify_api_42IyEIw49HtASTsLTjOW3ei1mreGSX4wroLU";
const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY") || "bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e";
const RAPIDAPI_HOST = "tiktok-user.p.rapidapi.com";

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
    
    // Try to get data using Apify first
    try {
      console.log(`Fetching profile using Apify for: ${cleanUsername}`);
      
      const apifyUrl = "https://api.apify.com/v2/acts/novi~tiktok-user-info-api/runs?token=" + APIFY_API_KEY;
      
      // Start the Actor run
      const startResponse = await fetch(apifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "username": cleanUsername
        }),
      });
      
      if (!startResponse.ok) {
        throw new Error(`Apify API error: ${startResponse.status}`);
      }
      
      const runData = await startResponse.json();
      const runId = runData.data.id;
      
      console.log(`Apify run started with ID: ${runId}`);
      
      // Wait for the run to finish (polling)
      let runFinished = false;
      let retries = 0;
      const maxRetries = 10;
      let profileData = null;
      
      while (!runFinished && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between polls
        
        const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_KEY}`);
        const statusData = await statusResponse.json();
        
        console.log(`Run status: ${statusData.data.status}`);
        
        if (statusData.data.status === 'SUCCEEDED') {
          runFinished = true;
          
          // Get the dataset items
          const datasetResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_API_KEY}`);
          const items = await datasetResponse.json();
          
          if (items && items.length > 0) {
            profileData = {
              status: 200,
              data: {
                owner: {
                  user_info: items[0],
                  stats: {
                    followerCount: items[0].follower_count,
                    followingCount: items[0].following_count,
                    heartCount: items[0].total_favorited,
                    videoCount: items[0].aweme_count
                  }
                },
                itemList: [] // We'll get videos separately if needed
              }
            };
          } else {
            throw new Error('No data found for this username');
          }
        } else if (statusData.data.status === 'FAILED' || statusData.data.status === 'TIMED-OUT' || statusData.data.status === 'ABORTED') {
          throw new Error(`Apify run failed with status: ${statusData.data.status}`);
        }
        
        retries++;
      }
      
      if (!profileData) {
        throw new Error('Failed to get data within timeout period');
      }
      
      // Try to fetch videos using the fallback RapidAPI (since Apify doesn't provide videos)
      try {
        const videosUrl = `https://${RAPIDAPI_HOST}/user/videos/${cleanUsername}`;
        
        const videosResponse = await fetch(videosUrl, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
          }
        });
        
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          
          if (videosData.status === 200 && videosData.data?.items) {
            // Merge the videos into the profile data
            profileData.data.itemList = videosData.data.items;
          }
        }
      } catch (videosError) {
        console.warn('Failed to fetch videos from RapidAPI:', videosError);
        // We still continue with just the profile data
      }
      
      return new Response(
        JSON.stringify(profileData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
      
    } catch (apifyError) {
      console.error('Apify error, falling back to RapidAPI:', apifyError);
      
      // Fallback to RapidAPI if Apify fails
      const profileUrl = `https://${RAPIDAPI_HOST}/getuser/${cleanUsername}`;
      const videosUrl = `https://${RAPIDAPI_HOST}/user/videos/${cleanUsername}`;
      
      const profileResponse = await fetch(profileUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        }
      });
      
      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error(`API error (${profileResponse.status}): ${errorText}`);
        throw new Error(`Erreur API (${profileResponse.status}): ${errorText}`);
      }
      
      const profileData = await profileResponse.json();
      
      if (profileData.status !== 200) {
        console.error('API returned error status:', profileData);
        throw new Error(`Erreur: ${JSON.stringify(profileData)}`);
      }
      
      // Try to get videos separately
      try {
        const videosResponse = await fetch(videosUrl, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
          }
        });
        
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          
          if (videosData.status === 200 && videosData.data?.items) {
            // Merge the videos into the profile data
            profileData.data = {
              ...profileData.data,
              itemList: videosData.data.items
            };
          }
        }
      } catch (videosError) {
        console.warn('Failed to fetch videos:', videosError);
        // We still continue with just the profile data
      }
      
      return new Response(
        JSON.stringify(profileData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
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
