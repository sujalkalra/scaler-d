import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { nodeId, title, content } = await req.json();
    if (!nodeId || !title || !content) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Check cache first
    const { data: existing } = await admin
      .from("roadmap_quizzes")
      .select("questions")
      .eq("node_id", nodeId)
      .maybeSingle();

    if (existing?.questions) {
      return new Response(JSON.stringify({ questions: existing.questions, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const truncated = (content as string).slice(0, 9000);

    const systemPrompt = `You are an expert assessment author for a System Design learning platform. Generate exactly 10 multiple-choice questions that test understanding of the article. Each question must have 4 plausible options with exactly one correct answer. Questions must be answerable strictly from the article content. Avoid trivia; focus on core concepts, trade-offs, and definitions. Difficulty: a mix of easy, medium, and hard.`;

    const userPrompt = `Article title: ${title}\n\nArticle content:\n${truncated}\n\nReturn 10 questions via the create_quiz tool.`;

    const tool = {
      type: "function",
      function: {
        name: "create_quiz",
        description: "Submit exactly 10 MCQ questions for the article.",
        parameters: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              minItems: 10,
              maxItems: 10,
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: {
                    type: "array",
                    minItems: 4,
                    maxItems: 4,
                    items: { type: "string" },
                  },
                  correctIndex: { type: "integer", minimum: 0, maximum: 3 },
                },
                required: ["question", "options", "correctIndex"],
                additionalProperties: false,
              },
            },
          },
          required: ["questions"],
          additionalProperties: false,
        },
      },
    };

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "create_quiz" } },
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      throw new Error("AI gateway error");
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Model did not return a quiz");
    const args = JSON.parse(toolCall.function.arguments);
    const questions: QuizQuestion[] = args.questions;

    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error("Invalid quiz structure");
    }

    await admin
      .from("roadmap_quizzes")
      .upsert({ node_id: nodeId, questions }, { onConflict: "node_id" });

    return new Response(JSON.stringify({ questions, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-quiz error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
