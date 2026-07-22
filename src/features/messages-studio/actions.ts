"use server";

import { revalidatePath } from "next/cache";

import {
  countNewConversations,
  getConversationWithMessages,
  listConversations,
  updateConversationStatus,
  type Conversation,
  type ConversationStatus,
  type ConversationWithMessages,
} from "@/lib/data";
import { requireStudioUser, UnauthorizedError } from "@/lib/supabase/auth";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function mapError(error: unknown): string {
  if (error instanceof UnauthorizedError) {
    return "Oturum gerekli. Tekrar giriş yapın.";
  }
  console.error("[messages-studio]", error);
  return "İşlem başarısız. Tekrar deneyin.";
}

export async function listInboxConversations(): Promise<
  ActionResult<Conversation[]>
> {
  try {
    await requireStudioUser();
    const data = await listConversations();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function getInboxUnreadCount(): Promise<ActionResult<number>> {
  try {
    await requireStudioUser();
    const data = await countNewConversations();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function getInboxConversation(
  id: string,
): Promise<ActionResult<ConversationWithMessages>> {
  try {
    await requireStudioUser();
    const data = await getConversationWithMessages(id);
    if (!data) {
      return { ok: false, error: "Konuşma bulunamadı." };
    }
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function markConversationStatus(
  id: string,
  status: ConversationStatus,
): Promise<ActionResult<Conversation>> {
  try {
    await requireStudioUser();
    const data = await updateConversationStatus(id, status);
    revalidatePath("/studio/mesajlar");
    revalidatePath("/studio");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}
