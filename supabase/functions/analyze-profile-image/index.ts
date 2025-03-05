
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

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
    const { imageData, username } = await req.json();
    
    if (!imageData) {
      throw new Error("Image data is required");
    }

    console.log(`Analyzing profile image for ${username || 'unknown user'}`);
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI("AIzaSyB1Vi3HkzzjNLrA1-NOlWwrXmbeoHvr1Hg");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Prepare image data (remove data:image/jpeg;base64, prefix if present)
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");
    
    // Create image part for Gemini
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    };
    
    const prompt = `
    Analyze this TikTok profile screenshot/image in great detail. Focus on:
    
    1. Profile picture quality, style, and professionalism
    2. Bio optimization and clarity
    3. Content style and consistency
    4. Follower/Following ratio
    5. Overall profile aesthetic
    
    Provide specific recommendations to improve the profile's performance and engagement.
    Format the response in JSON with these fields:
    {
      "profileImageAnalysis": {
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"]
      },
      "bioAnalysis": {
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"]
      },
      "contentAnalysis": {
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"]
      },
      "generalRecommendations": ["rec1", "rec2", "rec3"]
    }
    
    Respond only with the JSON, nothing else.
    `;
    
    console.log("Sending request to Gemini...");
    
    // Generate content with the model
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log("Received response from Gemini");
    
    // Try to parse the JSON response
    try {
      // Extract JSON from the response (in case Gemini wraps it in markdown or other text)
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;
      
      // Parse the JSON
      const analysis = JSON.parse(jsonText.replace(/```json|```/g, '').trim());
      
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // If we can't parse the JSON, return the raw text
      return new Response(JSON.stringify({ rawResponse: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in analyze-profile-image function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
