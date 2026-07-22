"use server";

import { revalidatePath } from "next/cache";

import {
  appendVisitorMessage,
  createConversationWithMessage,
  type Message,
} from "@/lib/data";

import {
  askMessageSchema,
  contactMessageSchema,
  systemAck,
} from "./schema";

export type PublicActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function mapError(error: unknown): string {
  if (
    error instanceof Error &&
    (error.message.includes("SUPABASE_SERVICE_ROLE_KEY") ||
      error.message.includes("NEXT_PUBLIC_SUPABASE_URL"))
  ) {
    return "Service unavailable.";
  }
  console.error("[site-messages]", error);
  return "Could not send message. Please try again.";
}

function revalidateInbox() {
  revalidatePath("/studio/mesajlar");
  revalidatePath("/studio");
}

export async function sendAskMessage(input: unknown): Promise<
  PublicActionResult<{
    conversationId: string;
    messages: Message[];
  }>
> {
  const parsed = askMessageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid message." };
  }
  if (parsed.data.website) {
    return { ok: false, error: "Invalid message." };
  }

  try {
    const ack = systemAck(parsed.data.locale, "ask");

    if (parsed.data.conversationId) {
      const messages = await appendVisitorMessage(
        parsed.data.conversationId,
        parsed.data.body,
      );
      revalidateInbox();
      return {
        ok: true,
        data: {
          conversationId: parsed.data.conversationId,
          messages,
        },
      };
    }

    const created = await createConversationWithMessage({
      source: "ask",
      locale: parsed.data.locale,
      visitorBody: parsed.data.body,
      systemBody: ack,
    });
    revalidateInbox();
    return {
      ok: true,
      data: {
        conversationId: created.conversation.id,
        messages: created.messages,
      },
    };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function submitContactMessage(
  input: unknown,
): Promise<PublicActionResult<{ conversationId: string }>> {
  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid form." };
  }
  if (parsed.data.website) {
    return { ok: false, error: "Invalid form." };
  }

  try {
    const created = await createConversationWithMessage({
      source: "contact",
      locale: parsed.data.locale,
      visitorName: parsed.data.name,
      visitorEmail: parsed.data.email,
      visitorBody: parsed.data.message,
      systemBody: systemAck(parsed.data.locale, "contact"),
    });
    revalidateInbox();
    return { ok: true, data: { conversationId: created.conversation.id } };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}
