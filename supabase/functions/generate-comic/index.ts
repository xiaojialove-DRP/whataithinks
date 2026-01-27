import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { thought } = await req.json();
    
    if (!thought || typeof thought !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid thought parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Generating interpretation for thought:", thought);

    // Step 1: Generate interpretation using Gemini
    const interpretationResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert in creating New Yorker-style single-panel cartoons. Transform user input into a witty, sophisticated cartoon concept.
            
Rules:
1. englishInterpretation: A short, clever caption in English (max 15 words), using dry wit and irony typical of New Yorker cartoons
2. chineseInterpretation: Chinese translation of the caption
3. visualPrompt: Describe a single-panel cartoon scene with characters and English dialogue bubbles. Must include specific dialogue in English that creates the humor.

You must return strict JSON format:
{"englishInterpretation": "string", "chineseInterpretation": "string", "visualPrompt": "string"}`
          },
          {
            role: "user",
            content: `用户输入: "${thought}"`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_comic_interpretation",
              description: "Generate a comic interpretation with English and Chinese text plus visual prompt",
              parameters: {
                type: "object",
                properties: {
                  englishInterpretation: { 
                    type: "string", 
                    description: "Short English interpretation in uppercase, max 15 characters" 
                  },
                  chineseInterpretation: { 
                    type: "string", 
                    description: "Chinese translation of the interpretation" 
                  },
                  visualPrompt: { 
                    type: "string", 
                    description: "Visual description for a 4-panel absurdist comic" 
                  }
                },
                required: ["englishInterpretation", "chineseInterpretation", "visualPrompt"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_comic_interpretation" } }
      }),
    });

    if (!interpretationResponse.ok) {
      const errorText = await interpretationResponse.text();
      console.error("Interpretation API error:", interpretationResponse.status, errorText);
      
      if (interpretationResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (interpretationResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate interpretation" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const interpretationData = await interpretationResponse.json();
    console.log("Interpretation response:", JSON.stringify(interpretationData));

    // Extract the tool call arguments
    const toolCall = interpretationData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const interpretation = JSON.parse(toolCall.function.arguments);
    console.log("Parsed interpretation:", interpretation);

    // Step 2: Generate comic image using Nano banana (image generation model)
    console.log("Generating comic image with visual prompt:", interpretation.visualPrompt);
    
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: `Create a single-panel cartoon in the style of The New Yorker magazine. Black and white ink illustration with clean, elegant linework. Sophisticated dry humor. Include English dialogue in speech bubbles. White background, minimal crosshatching, expressive character poses. The cartoon depicts: ${interpretation.visualPrompt}`
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("Image API error:", imageResponse.status, errorText);
      
      if (imageResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (imageResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Return interpretation without image if image generation fails
      return new Response(
        JSON.stringify({
          englishInterpretation: interpretation.englishInterpretation,
          chineseInterpretation: interpretation.chineseInterpretation,
          imageUrl: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageData = await imageResponse.json();
    console.log("Image response received");

    const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

    return new Response(
      JSON.stringify({
        englishInterpretation: interpretation.englishInterpretation,
        chineseInterpretation: interpretation.chineseInterpretation,
        imageUrl: imageUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in generate-comic function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
