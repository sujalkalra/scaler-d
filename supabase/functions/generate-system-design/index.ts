import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, company } = await req.json();
    
    if (!title) {
      return new Response(
        JSON.stringify({ error: "Title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt for article generation
    const systemPrompt = `You are a professional technical content generation agent specialized in System Design concepts.

Your task is to create beginner-friendly yet professional system design articles.

Output Format:
Generate a complete article in Markdown that includes:

1. **Introduction** (2-3 paragraphs)
   - Brief overview of what the system does
   - What makes it special or complex (in beginner-friendly tone)

2. **High-Level Design** (3-4 paragraphs)
   - Describe the overall architecture
   - Explain how different components interact
   - Focus on the big picture

3. **Core Components & Concepts** (5-7 sections)
   For each major component (e.g., Load Balancer, Cache, Database, CDN, Message Queue):
   - Component name as heading (###)
   - Short explanation (2-3 sentences)
   - Why it's used in this system
   - How it contributes to scalability/performance

4. **Data Flow Example** (2-3 paragraphs)
   - Step-by-step explanation of how a typical request flows through the system
   - Use numbered steps or bullet points

5. **Scalability Considerations** (2-3 paragraphs)
   - How the system handles growth
   - Key scaling strategies used

6. **Conclusion** (1-2 paragraphs)
   - Summary of key architectural decisions
   - Possible future enhancements

Style Guidelines:
- Use clear, beginner-friendly language
- Keep paragraphs short (3-5 sentences max)
- Use bullet points where appropriate
- Include specific numbers/metrics when relevant
- Maintain a professional but approachable tone`;

    const userPrompt = company 
      ? `Generate a comprehensive system design article for: "${title}" (Reference company: ${company})`
      : `Generate a comprehensive system design article for: "${title}"`;

    // Generate article text
    const articleResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!articleResponse.ok) {
      const errorText = await articleResponse.text();
      console.error("AI gateway error:", articleResponse.status, errorText);
      throw new Error(`AI generation failed: ${articleResponse.status}`);
    }

    const articleData = await articleResponse.json();
    const articleContent = articleData.choices?.[0]?.message?.content;

    if (!articleContent) {
      throw new Error("No content generated");
    }

    // Generate diagram image
    const diagramPrompt = `Create a professional system architecture diagram for ${company || title}. 
    
Style: Modern, clean technical diagram with:
- Simple geometric shapes (rectangles, circles) representing components
- Clear labels for each component
- Arrows showing data flow
- Color-coded sections (e.g., client layer, server layer, data layer)
- Professional tech company aesthetic
- White or light background
- High contrast for readability

The diagram should show the high-level architecture with components like:
- Client/User interface
- Load Balancer
- Application Servers
- Database
- Cache
- CDN
- Message Queue (if applicable)

Make it visually clean and easy to understand at a glance.`;

    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: diagramPrompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    let diagramUrl = null;
    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      diagramUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    } else {
      console.error("Image generation failed, continuing without diagram");
    }

    return new Response(
      JSON.stringify({
        company: company || title.split(" ")[0],
        architecture: articleContent,
        diagram: diagramUrl
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-system-design:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
