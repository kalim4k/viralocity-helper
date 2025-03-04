
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI("AIzaSyB1Vi3HkzzjNLrA1-NOlWwrXmbeoHvr1Hg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface VideoIdea {
  title: string;
  description: string;
  type: string;
  viralPotential: number;
  audience: string;
}

export interface VideoScript {
  script: string;
  durationEstimate: string;
}

export interface VideoAnalysis {
  hookSuggestion: string;
  editingTips: string;
  callToAction: string;
}

export interface VideoMetadata {
  title: string;
  description: string;
  hashtags: string[];
}

export const geminiService = {
  async generateVideoIdeas(niche: string, count: number = 5): Promise<VideoIdea[]> {
    try {
      const prompt = `Generate ${count} TikTok video ideas for the niche: "${niche}". 
      For each idea, provide: 
      1. A catchy title
      2. A brief description (1-2 sentences)
      3. Content type (e.g., Tutorial, Story, Review, Challenge)
      4. Viral potential score from 1-100
      5. Target audience
      
      Format the response as a valid JSON array of objects with properties: title, description, type, viralPotential, audience.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("Failed to parse ideas from AI response");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error generating video ideas:", error);
      throw error;
    }
  },

  async generateVideoScript(idea: VideoIdea, scriptType: "voiceover" | "scenario"): Promise<VideoScript> {
    try {
      const prompt = `Create a ${scriptType === "voiceover" ? "voiceover script" : "scenario script"} for a TikTok video with the following details:
      
      Title: ${idea.title}
      Description: ${idea.description}
      Type: ${idea.type}
      Target Audience: ${idea.audience}
      
      ${scriptType === "voiceover" ? 
        "The script should be written as a voiceover narration that would work well with visuals and be engaging for TikTok." : 
        "The script should include character actions, dialogue, and scene directions in a scenario format suitable for TikTok."}
      
      Also include an estimated duration for the video.
      
      Format the response as a valid JSON object with properties: script (the full script text), durationEstimate (e.g., "30-45 seconds").`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse script from AI response");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error generating video script:", error);
      throw error;
    }
  },

  async analyzeScript(script: string): Promise<VideoAnalysis> {
    try {
      const prompt = `Analyze this TikTok video script and provide strategic advice:
      
      Script: "${script}"
      
      Please provide:
      1. A strong hook suggestion for the first 3 seconds
      2. 2-3 specific editing tips or transition suggestions
      3. An effective call-to-action for the end
      
      Format the response as a valid JSON object with properties: hookSuggestion, editingTips, callToAction.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse analysis from AI response");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error analyzing script:", error);
      throw error;
    }
  },

  async generateMetadata(idea: VideoIdea, script: string): Promise<VideoMetadata> {
    try {
      const prompt = `Create SEO-optimized metadata for a TikTok video with the following details:
      
      Video Idea: ${idea.title}
      Description: ${idea.description}
      Script: "${script.substring(0, 500)}${script.length > 500 ? '...' : ''}"
      
      Please provide:
      1. An attention-grabbing title (max 100 characters)
      2. An engaging description (150-200 characters) that includes relevant keywords
      3. 5-7 trending hashtags that would help this content get discovered
      
      Format the response as a valid JSON object with properties: title, description, hashtags (as an array of strings).`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse metadata from AI response");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error generating metadata:", error);
      throw error;
    }
  }
};
