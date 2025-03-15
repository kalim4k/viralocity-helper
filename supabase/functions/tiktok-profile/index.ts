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
    
    // Fetch user videos first, as it usually contains more detailed user info
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
    
    // If we already have user info from videos response, we might not need to call the user API
    let userData = null;
    
    // If videos data doesn't have complete user info, fetch user profile separately
    if (!videosData || !videosData.data?.itemList?.[0]?.authorStats) {
      const profileUrl = `https://${API_HOST}/getuser/${cleanUsername}`;
      
      try {
        const profileResponse = await fetch(profileUrl, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
          }
        });
        
        if (profileResponse.ok) {
          userData = await profileResponse.json();
          
          if (userData.status !== 200) {
            console.error('User API returned error status:', userData);
            
            // If we don't have videos data either, we have no usable data
            if (!videosData) {
              return new Response(
                JSON.stringify({ error: `User profile not found: ${userData.status}` }),
                { 
                  status: 404, 
                  headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
              );
            }
          }
        } else {
          console.error(`User API error (${profileResponse.status})`);
          
          // If we don't have videos data either, we have no usable data
          if (!videosData) {
            return new Response(
              JSON.stringify({ error: `Failed to fetch user profile: ${profileResponse.status}` }),
              { 
                status: profileResponse.status, 
                headers: { ...corsHeaders, "Content-Type": "application/json" }
              }
            );
          }
        }
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError);
        
        // If we don't have videos data either, we have no usable data
        if (!videosData) {
          return new Response(
            JSON.stringify({ error: `Error fetching user profile: ${profileError.message}` }),
            { 
              status: 500, 
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
      }
    }
    
    // Merge the data - if we have both user and videos data
    let mergedData: any = { status: 200 };
    
    if (userData && userData.status === 200) {
      mergedData = { ...userData };
    }
    
    if (videosData && videosData.status === 200) {
      // If we already have data structure, merge itemList
      if (mergedData.data) {
        mergedData.data = {
          ...mergedData.data,
          itemList: videosData.data.itemList || [],
          cursor: videosData.data.cursor,
          hasMore: videosData.data.hasMore
        };
      } else {
        // Otherwise use videos data as base
        mergedData = { ...videosData };
      }
    }
    
    // Check if we have any usable data
    if (!mergedData.data) {
      mergedData.data = {};
    }
    
    // Add empty itemList if it doesn't exist
    if (!mergedData.data.itemList) {
      mergedData.data.itemList = [];
    }
    
    // Return the merged API response
    console.log(`Successfully fetched TikTok data for: ${username}`);
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
