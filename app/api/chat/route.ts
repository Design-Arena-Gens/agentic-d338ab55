import { NextResponse } from "next/server";
import { runAssistant, type ChatMessage } from "@/lib/assistant";

export async function POST(request: Request) {
  const body = await request.json();
  const messages: ChatMessage[] = body?.messages ?? [];
  const stageIndex: number = typeof body?.stageIndex === "number" ? body.stageIndex : 0;

  const output = runAssistant(messages, stageIndex);

  return NextResponse.json({
    message: {
      role: "assistant",
      content: output.reply
    },
    stageIndex: output.stageIndex,
    suggestions: output.suggestions
  });
}
