// STEP 4 VERSION — raw fetch, no SDK
// Rename this to route.ts to use it (swap out route.sdk.ts first)

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, model } = await req.json();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await res.json();

  // log the raw response so you can show it in the video
  console.log(JSON.stringify(data, null, 2));

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status });
  }

  const reply = data.choices[0].message.content;

  return NextResponse.json({ reply });
}
