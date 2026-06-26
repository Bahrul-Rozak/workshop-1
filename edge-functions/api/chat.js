import { createAiGateway } from "@edgeone/makers-models-provider";
import { generateText } from "ai";

// 1. Handle CORS Preflight (OPTIONS)
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// 2. Handle POST Request
export async function onRequestPost(context) {
  const { request, env } = context; // Ambil request dan env dari context

  try {
    const { messages } = await request.json();

    const aiGateway = createAiGateway({
      apiKey: env.MAKERS_MODELS_KEY, // PENTING: Pakai env dari context, bukan process.env!
    });

    const { text } = await generateText({
      model: aiGateway("@makers/deepseek-v4-flash"),
      messages: messages,
    });

    return new Response(JSON.stringify({ reply: text }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' 
      },
    });
  }
}