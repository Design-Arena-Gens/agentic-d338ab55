"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWRMutation from "swr/mutation";
import { initialAssistantGreeting, workflowStages } from "@/lib/workflow";

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SendPayload = {
  messages: { role: string; content: string }[];
  stageIndex: number;
};

type ApiResponse = {
  message: { role: "assistant"; content: string };
  stageIndex: number;
  suggestions: string[];
};

async function sendChat(url: string, { arg }: { arg: SendPayload }) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(arg)
  });

  if (!res.ok) {
    throw new Error("Failed to contact assistant");
  }

  return (await res.json()) as ApiResponse;
}

type ChatPanelProps = {
  stageIndex: number;
  onStageChange: (index: number) => void;
  suggestions: string[];
  onSuggestionsChange: (suggestions: string[]) => void;
};

export function ChatPanel({
  stageIndex,
  onStageChange,
  suggestions,
  onSuggestionsChange
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: initialAssistantGreeting
    }
  ]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { trigger, isMutating } = useSWRMutation("/api/chat", sendChat);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const outbound: ConversationMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim()
    };

    setMessages((prev) => [...prev, outbound]);

    const payload: SendPayload = {
      messages: [...messages, outbound].map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      stageIndex
    };

    try {
      const response = await trigger(payload, { throwOnError: true });
      const inbound: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message.content
      };

      setMessages((prev) => [...prev, inbound]);
      onStageChange(response.stageIndex);
      onSuggestionsChange(response.suggestions);
    } catch (error) {
      console.error(error);
      const fallback: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm having trouble reaching the assistant service right now. Let's retry shortly."
      };
      setMessages((prev) => [...prev, fallback]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputRef.current) return;
    const value = inputRef.current.value;
    inputRef.current.value = "";
    await handleSend(value);
  };

  const handleSuggestionClick = async (text: string) => {
    await handleSend(text);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const container = document.getElementById("chat-scroll-anchor");
    container?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const stageBadge = useMemo(() => workflowStages[stageIndex], [stageIndex]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            Middle-Inspired Workflow
          </span>
          <h1 className="text-xl font-semibold text-slate-900">
            Mortgage Copilot Agent
          </h1>
          <p className="text-sm text-slate-500">
            Current focus: <strong>{stageBadge.title}</strong>
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "assistant"
                  ? "flex items-start gap-3"
                  : "flex items-start justify-end"
              }
            >
              {message.role === "assistant" && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  AI
                </div>
              )}
              <div
                className={
                  message.role === "assistant"
                    ? "max-w-xl rounded-2xl bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-800"
                    : "max-w-xl rounded-2xl bg-primary-500 px-4 py-3 text-sm leading-relaxed text-white"
                }
              >
                {message.content.split("\n").map((line, idx) => (
                  <p key={idx} className="whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
              {message.role === "user" && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white">
                  You
                </div>
              )}
            </div>
          ))}
          <div id="chat-scroll-anchor" />
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex flex-wrap gap-2 pb-4">
          {suggestions.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSuggestionClick(prompt)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            ref={inputRef}
            rows={3}
            placeholder="Ask the copilot about borrower scenarios, documents, rates, or next steps..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ctrl+Enter to send</span>
            <button
              type="submit"
              disabled={isMutating}
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
            >
              {isMutating ? "Thinking" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
