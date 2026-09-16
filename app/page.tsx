"use client";

import { useState } from "react";
import {
  Message,
  MessageBubble,
  MessageBubbleContent,
  MessageContent,
  MessageGroup,
} from "@/components/agents/message";
import { ReasoningText } from "@/components/agents/loading-states/reasoning-text";
import { PromptInput } from "@/components/agents/prompt-input";

const MODELS = [
  { value: "openai/gpt-oss-120b", label: "openai/gpt-oss-120b" },
  { value: "openai/gpt-oss-20b", label: "openai/gpt-oss-20b" },
];

interface ChatMessage {
  from: "user" | "assistant";
  text: string;
}

export default function Home() {
  const [model, setModel] = useState(MODELS[0].value);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string, selectedModel?: string) {
    setMessages((prev) => [...prev, { from: "user", text }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, model: selectedModel }),
    });

    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { from: "assistant", text: data.reply ?? JSON.stringify(data.error) },
    ]);
    setLoading(false);
  }

  return (
    <main className="flex min-h-dvh min-w-dvw items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col gap-4">
        <h1 className="text-xl font-semibold text-center bg-neutral-800 py-4 rounded-xl">
          Free LLM Models Integration | Tutorial
        </h1>

        <MessageGroup spacing="default" className="min-h-40">
          {messages.map((message, index) => (
            <Message key={index} from={message.from} animateIn>
              <MessageContent>
                <MessageBubble
                  variant={message.from === "user" ? "tint" : "soft"}
                  animateIn
                >
                  <MessageBubbleContent>{message.text}</MessageBubbleContent>
                </MessageBubble>
              </MessageContent>
            </Message>
          ))}
          {loading && <ReasoningText />}
        </MessageGroup>

        <PromptInput
          models={MODELS}
          model={model}
          onModelChange={setModel}
          loading={loading}
          onSubmit={sendMessage}
        />
      </div>
    </main>
  );
}
