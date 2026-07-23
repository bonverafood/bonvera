"use server";

import { revalidatePath } from "next/cache";

import {
  appendVisitorMessage,
  createConversationWithMessage,
  updateConversationVisitor,
  type Message,
} from "@/lib/data";

import {
  askContactSchema,
  askFollowUpAck,
  askMessageSchema,
  askNameSchema,
  askPromptAskContact,
  askPromptAskName,
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
    nextStep: "name" | "contact" | "done";
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
    // Follow-up only when client explicitly continues an existing thread.
    if (parsed.data.conversationId) {
      const messages = await appendVisitorMessage(
        parsed.data.conversationId,
        parsed.data.body,
        askFollowUpAck(parsed.data.locale),
      );
      revalidateInbox();
      return {
        ok: true,
        data: {
          conversationId: parsed.data.conversationId,
          messages,
          nextStep: "done",
        },
      };
    }

    const created = await createConversationWithMessage({
      source: "ask",
      locale: parsed.data.locale,
      visitorBody: parsed.data.body,
      systemBody: askPromptAskName(parsed.data.locale),
    });
    revalidateInbox();
    return {
      ok: true,
      data: {
        conversationId: created.conversation.id,
        messages: created.messages,
        nextStep: "name",
      },
    };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function submitAskName(input: unknown): Promise<
  PublicActionResult<{
    conversationId: string;
    messages: Message[];
    nextStep: "contact";
  }>
> {
  const parsed = askNameSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid name." };
  }
  if (parsed.data.website) {
    return { ok: false, error: "Invalid name." };
  }

  try {
    await updateConversationVisitor(parsed.data.conversationId, {
      visitorName: parsed.data.name,
    });
    const messages = await appendVisitorMessage(
      parsed.data.conversationId,
      parsed.data.name,
      askPromptAskContact(parsed.data.locale, parsed.data.name),
    );
    revalidateInbox();
    return {
      ok: true,
      data: {
        conversationId: parsed.data.conversationId,
        messages,
        nextStep: "contact",
      },
    };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function submitAskContact(input: unknown): Promise<
  PublicActionResult<{
    conversationId: string;
    messages: Message[];
    nextStep: "done";
  }>
> {
  const parsed = askContactSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message;
    if (issue === "invalidEmail") {
      return { ok: false, error: "invalidEmail" };
    }
    return { ok: false, error: "contactRequired" };
  }
  if (parsed.data.website) {
    return { ok: false, error: "Invalid contact." };
  }

  const email = parsed.data.email?.trim() || "";
  const phone = parsed.data.phone?.trim() || "";

  try {
    await updateConversationVisitor(parsed.data.conversationId, {
      visitorEmail: email || null,
      visitorPhone: phone || null,
    });

    const summaryParts =
      parsed.data.locale === "tr"
        ? [
            email ? `E-posta: ${email}` : null,
            phone ? `Telefon: ${phone}` : null,
          ]
        : [
            email ? `E-mail : ${email}` : null,
            phone ? `Téléphone : ${phone}` : null,
          ];
    const summary = summaryParts.filter(Boolean).join("\n");

    const messages = await appendVisitorMessage(
      parsed.data.conversationId,
      summary,
      systemAck(parsed.data.locale, "ask"),
    );
    revalidateInbox();
    return {
      ok: true,
      data: {
        conversationId: parsed.data.conversationId,
        messages,
        nextStep: "done",
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
