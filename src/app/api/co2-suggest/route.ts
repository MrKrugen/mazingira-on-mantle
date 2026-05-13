import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { name, category } = await req.json();
    if (!name) return Response.json({ co2: null });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16,
      messages: [
        {
          role: "user",
          content: `Green product: "${name}" (category: ${category}). Estimate realistic kg of CO₂ saved per unit sold. Reply with ONLY a single integer — no text, no units.`,
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    const num = parseInt(text);
    return Response.json({ co2: isNaN(num) ? null : num });
  } catch {
    return Response.json({ co2: null });
  }
}
