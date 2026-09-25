// STEP 4 VERSION — raw fetch, no SDK
// Rename this to route.ts to use it (swap out route.sdk.ts first)

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: NextRequest) {
  const { message, model } = await req.json();

  const completion = await groq.chat.completions.create({
    model,
    messages: [{ role: "user", content: message }],
  });

  // log the raw response so you can show it in the video
  console.log(JSON.stringify(completion, null, 2));

  const reply = completion.choices[0].message.content;

  return NextResponse.json({ reply });
}
