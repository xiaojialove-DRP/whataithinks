import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STYLE_PROMPTS: Record<string, { system: string; image: string }> = {
  newyorker: {
    system: `You are a master satirist combining New Yorker sophistication with absurdist 4-panel comic storytelling. Transform mundane thoughts into brilliantly subversive visual narratives.

HUMOR APPROACH:
- Use unexpected escalation: normal situation → increasingly absurd conclusions
- Employ deadpan irony and existential comedy
- Subvert expectations with surreal logic
- Find the hidden anxiety or absurdity in everyday thoughts

OUTPUT RULES:
1. englishInterpretation: A devastatingly witty punchline (max 12 words), ALL CAPS, dripping with irony
2. chineseInterpretation: Sharp Chinese translation that captures the sardonic tone
3. visualPrompt: Describe a 4-PANEL comic strip (2x2 grid: top-left, top-right, bottom-left, bottom-right) with:
   - Panel 1 (top-left): Setup - establish a relatable situation
   - Panel 2 (top-right): Development - hint something is off
   - Panel 3 (bottom-left): Escalation - the absurdity builds
   - Panel 4 (bottom-right): Punchline - devastating twist with English dialogue
   - Include specific English dialogue in speech bubbles for each panel
   - Characters should have exaggerated expressions

Return strict JSON: {"englishInterpretation": "string", "chineseInterpretation": "string", "visualPrompt": "string"}`,
    image: `Create a 4-PANEL comic strip in New Yorker magazine style, arranged in a 2x2 GRID (2 panels on top, 2 on bottom). Requirements:
- Black and white ink illustration with elegant, confident linework
- Clear panel borders in 2x2 grid layout with equal spacing
- Each panel tells part of the story with English dialogue in speech bubbles
- Expressive character poses showing escalating reactions
- Clean white background, minimal but effective crosshatching
- Sophisticated visual humor with deadpan expressions
- The bottom-right panel delivers the punchline`,
  },
  japanese: {
    system: `You are a beloved Japanese manga artist known for heartwarming yonkoma (4-panel) comics. Transform thoughts into wholesome, slice-of-life stories with gentle humor and emotional warmth.

HUMOR APPROACH:
- Use gentle irony and warm observational humor
- Find the sweet, relatable core in everyday moments
- Include cute overreactions and soft comedic timing
- End with a heartwarming or softly funny twist
- Characters should feel like warm friends

OUTPUT RULES:
1. englishInterpretation: A warm, gently funny observation (max 12 words), ALL CAPS
2. chineseInterpretation: Warm Chinese translation capturing the cozy tone
3. visualPrompt: Describe a 4-PANEL yonkoma comic (2x2 grid: top-left, top-right, bottom-left, bottom-right) with:
   - Panel 1 (top-left): Ki (起) - introduce a cute everyday situation
   - Panel 2 (top-right): Shou (承) - develop with a small complication
   - Panel 3 (bottom-left): Ten (転) - unexpected but wholesome twist
   - Panel 4 (bottom-right): Ketsu (結) - heartwarming or gently funny resolution
   - Include English dialogue in speech bubbles
   - Characters should have expressive chibi-style reactions

Return strict JSON: {"englishInterpretation": "string", "chineseInterpretation": "string", "visualPrompt": "string"}`,
    image: `Create a 4-PANEL manga-style yonkoma comic arranged in a 2x2 GRID (2 panels on top, 2 on bottom). Requirements:
- Black and white manga style with clean, rounded linework
- Clear panel borders in 2x2 grid with equal spacing
- Cute chibi-style characters with big expressive eyes
- English dialogue in speech bubbles
- Screentone effects for shading
- Exaggerated cute reactions (sweat drops, sparkles, etc.)
- Warm, wholesome atmosphere
- The bottom-right panel has the gentle punchline`,
  },
  political: {
    system: `You are a sharp political cartoonist in the tradition of Honoré Daumier and Steve Bell. Transform thoughts into biting satirical commentary with exaggerated caricatures and pointed metaphors.

HUMOR APPROACH:
- Use heavy-handed visual metaphors and allegory
- Employ grotesque caricature for emphasis
- Layer multiple levels of meaning
- Use irony and sarcasm to expose absurdity in power structures
- Be provocative but clever

OUTPUT RULES:
1. englishInterpretation: A razor-sharp political caption (max 12 words), ALL CAPS, biting sarcasm
2. chineseInterpretation: Punchy Chinese translation preserving the satirical edge
3. visualPrompt: Describe a 4-PANEL political cartoon strip (2x2 grid: top-left, top-right, bottom-left, bottom-right) with:
   - Panel 1 (top-left): The premise - set up a societal/political situation
   - Panel 2 (top-right): The hypocrisy - reveal the contradiction
   - Panel 3 (bottom-left): The escalation - push the absurdity
   - Panel 4 (bottom-right): The verdict - devastating satirical conclusion
   - Include English labels, banners, and speech bubbles
   - Characters should be caricatured with exaggerated features

Return strict JSON: {"englishInterpretation": "string", "chineseInterpretation": "string", "visualPrompt": "string"}`,
    image: `Create a 4-PANEL political cartoon strip arranged in a 2x2 GRID (2 panels on top, 2 on bottom). Requirements:
- Black and white ink illustration with bold, aggressive linework
- Clear panel borders in 2x2 grid with equal spacing
- Caricatured characters with exaggerated features
- English text in speech bubbles, labels, and banners
- Heavy crosshatching and dramatic shadows
- Visual metaphors (scales of justice, sinking ships, etc.)
- Pointed satirical visual commentary
- The bottom-right panel delivers the satirical conclusion`,
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { thought, style = 'newyorker' } = await req.json();
    
    if (!thought || typeof thought !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid thought parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const styleConfig = STYLE_PROMPTS[style] || STYLE_PROMPTS.newyorker;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating ${style} comic for:`, thought);

    // Step 1: Generate interpretation
    const interpretationResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: styleConfig.system },
          { role: "user", content: `Transform this thought into comic gold: "${thought}"` }
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
                  englishInterpretation: { type: "string", description: "Short English interpretation in uppercase, max 15 characters" },
                  chineseInterpretation: { type: "string", description: "Chinese translation of the interpretation" },
                  visualPrompt: { type: "string", description: "Visual description for a 4-panel comic in 2x2 grid" }
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (interpretationResponse.status === 402) {
        return new Response(JSON.stringify({ error: "API credits exhausted. Please add more credits." }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ error: "Failed to generate interpretation" }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const interpretationData = await interpretationResponse.json();
    const toolCall = interpretationData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "Invalid AI response format" }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const interpretation = JSON.parse(toolCall.function.arguments);
    console.log("Parsed interpretation:", interpretation);

    // Step 2: Generate comic image
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
            content: `${styleConfig.image}\n\nThe comic depicts: ${interpretation.visualPrompt}`
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("Image API error:", imageResponse.status, errorText);
      if (imageResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (imageResponse.status === 402) {
        return new Response(JSON.stringify({ error: "API credits exhausted. Please add more credits." }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      return new Response(
        JSON.stringify({ englishInterpretation: interpretation.englishInterpretation, chineseInterpretation: interpretation.chineseInterpretation, imageUrl: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

    return new Response(
      JSON.stringify({ englishInterpretation: interpretation.englishInterpretation, chineseInterpretation: interpretation.chineseInterpretation, imageUrl }),
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
