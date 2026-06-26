import { createAiGateway } from "@edgeone/makers-models-provider";
import { generateText } from "ai";

export default async function handler(request) {
  // Handle CORS biar frontend bisa akses API ini ya hehe
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    // Ambil array messages dari frontend
    const { messages } = await request.json();

    // Setup AI Gateway
    const aiGateway = createAiGateway({
      apiKey: process.env.MAKERS_MODELS_KEY, // API Key-nya nanti otomatis keisi pas kita link
    });

    // Panggil model DeepSeek via Makers
    const { text } = await generateText({
      model: aiGateway("@makers/deepseek-v4-flash"),
      messages: messages, // Kita kirim history percakapan biar AI punya konteks
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
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}