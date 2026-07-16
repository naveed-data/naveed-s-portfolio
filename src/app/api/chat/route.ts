import Groq from "groq-sdk";
import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/lib/chat-context";
import { AGENT_TOOLS, TOOL_LABELS, isToolName, runTool } from "@/lib/agent-tools";

export const dynamic = "force-dynamic";

const MODEL = "openai/gpt-oss-20b";
const MAX_MESSAGES = 20;
// User input is capped tightly (abuse prevention on new messages). Assistant
// history is our own previously-generated text echoed back as context, so it
// gets a much larger bound — just enough to keep the conversation from
// growing unbounded, not to police content we generated ourselves.
const MAX_USER_MESSAGE_LENGTH = 800;
const MAX_ASSISTANT_MESSAGE_LENGTH = 4000;
const MAX_TOOL_ROUNDS = 3;

type IncomingMessage = { role: "user" | "assistant"; content: string };
type Line =
  | { type: "stage"; label: string }
  | { type: "tool"; name: string; label: string }
  | { type: "token"; value: string }
  | { type: "done" };

function isValidMessage(value: unknown): value is IncomingMessage {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  if ((role !== "user" && role !== "assistant") || typeof content !== "string") return false;
  if (content.trim().length === 0) return false;
  const maxLength = role === "user" ? MAX_USER_MESSAGE_LENGTH : MAX_ASSISTANT_MESSAGE_LENGTH;
  return content.length <= maxLength;
}

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "Chat is not configured. Set GROQ_API_KEY to enable it." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isValidMessage)) {
    return Response.json({ error: "Invalid messages payload." }, { status: 400 });
  }

  const trimmed = (messages as IncomingMessage[])
    .slice(-MAX_MESSAGES)
    .map(({ role, content }): IncomingMessage => ({ role, content }));
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const conversation: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt() },
    ...trimmed,
  ];

  const encoder = new TextEncoder();
  const write = (controller: ReadableStreamDefaultController<Uint8Array>, line: Line) => {
    controller.enqueue(encoder.encode(`${JSON.stringify(line)}\n`));
  };

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        write(controller, { type: "stage", label: "Understanding Intent" });

        if (trimmed.length > 1) {
          write(controller, { type: "stage", label: "Memory: Context Loaded" });
        }

        write(controller, { type: "stage", label: "Supervisor Agent Activated" });

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: conversation,
            tools: AGENT_TOOLS,
            tool_choice: "auto",
            temperature: 0.3,
            max_tokens: 600,
          });

          const message = completion.choices[0]?.message;
          const toolCalls = message?.tool_calls;
          if (!message || !toolCalls || toolCalls.length === 0) break;

          conversation.push(message);
          for (const call of toolCalls) {
            const name = call.function.name;
            if (isToolName(name)) {
              write(controller, { type: "tool", name, label: TOOL_LABELS[name] });
              conversation.push({
                role: "tool",
                tool_call_id: call.id,
                content: JSON.stringify(runTool(name)),
              });
            } else {
              conversation.push({
                role: "tool",
                tool_call_id: call.id,
                content: JSON.stringify({ error: "Unknown tool" }),
              });
            }
          }
        }

        write(controller, { type: "stage", label: "Synthesizing Response" });

        const stream = await groq.chat.completions.create({
          model: MODEL,
          messages: conversation,
          stream: true,
          temperature: 0.4,
          max_tokens: 500,
        });

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) write(controller, { type: "token", value: delta });
        }

        write(controller, { type: "done" });
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
