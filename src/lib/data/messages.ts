import { createServiceRoleClient } from "@/lib/supabase/admin";

import {
  mapConversation,
  mapMessage,
  type ConversationRow,
  type MessageRow,
} from "./mappers";
import type {
  Conversation,
  ConversationSource,
  ConversationStatus,
  ConversationWithMessages,
  Message,
} from "./types";

function client() {
  return createServiceRoleClient();
}

function previewOf(body: string) {
  const trimmed = body.trim().replace(/\s+/g, " ");
  return trimmed.length > 160 ? `${trimmed.slice(0, 157)}…` : trimmed;
}

export async function listConversations(): Promise<Conversation[]> {
  const { data, error } = await client()
    .from("conversations")
    .select("*")
    .neq("status", "archived")
    .order("last_message_at", { ascending: false });

  if (error) throw error;
  return (data as ConversationRow[]).map(mapConversation);
}

export async function countNewConversations(): Promise<number> {
  const { count, error } = await client()
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  if (error) throw error;
  return count ?? 0;
}

export async function getConversationWithMessages(
  id: string,
): Promise<ConversationWithMessages | null> {
  const { data: conv, error: convError } = await client()
    .from("conversations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (convError) throw convError;
  if (!conv) return null;

  const { data: msgs, error: msgError } = await client()
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  if (msgError) throw msgError;

  return {
    ...mapConversation(conv as ConversationRow),
    messages: (msgs as MessageRow[]).map(mapMessage),
  };
}

export async function updateConversationStatus(
  id: string,
  status: ConversationStatus,
): Promise<Conversation> {
  const { data, error } = await client()
    .from("conversations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapConversation(data as ConversationRow);
}

type CreateConversationInput = {
  source: ConversationSource;
  locale: string;
  visitorName?: string | null;
  visitorEmail?: string | null;
  visitorBody: string;
  systemBody?: string | null;
};

export async function createConversationWithMessage(
  input: CreateConversationInput,
): Promise<{ conversation: Conversation; messages: Message[] }> {
  const now = new Date().toISOString();
  const preview = previewOf(input.visitorBody);

  const { data: conv, error: convError } = await client()
    .from("conversations")
    .insert({
      source: input.source,
      status: "new",
      locale: input.locale,
      visitor_name: input.visitorName?.trim() || null,
      visitor_email: input.visitorEmail?.trim() || null,
      preview,
      last_message_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (convError) throw convError;

  const conversation = mapConversation(conv as ConversationRow);

  const { data: visitorRow, error: visitorError } = await client()
    .from("messages")
    .insert({
      conversation_id: conversation.id,
      role: "visitor",
      body: input.visitorBody.trim(),
    })
    .select("*")
    .single();

  if (visitorError) throw visitorError;

  const messages: Message[] = [mapMessage(visitorRow as MessageRow)];

  if (input.systemBody?.trim()) {
    const { data: systemRow, error: systemError } = await client()
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        role: "system",
        body: input.systemBody.trim(),
      })
      .select("*")
      .single();

    if (systemError) throw systemError;
    messages.push(mapMessage(systemRow as MessageRow));
  }

  return { conversation, messages };
}

export async function appendVisitorMessage(
  conversationId: string,
  body: string,
  systemBody?: string | null,
): Promise<Message[]> {
  const now = new Date().toISOString();
  const text = body.trim();

  const { error: updateError } = await client()
    .from("conversations")
    .update({
      preview: previewOf(text),
      last_message_at: now,
      updated_at: now,
      status: "new",
    })
    .eq("id", conversationId);

  if (updateError) throw updateError;

  const rows: { conversation_id: string; role: string; body: string }[] = [
    { conversation_id: conversationId, role: "visitor", body: text },
  ];

  const { data: visitorRows, error: visitorError } = await client()
    .from("messages")
    .insert(rows)
    .select("*");

  if (visitorError) throw visitorError;

  const messages: Message[] = (visitorRows as MessageRow[]).map(mapMessage);

  if (systemBody?.trim()) {
    const { data: systemRow, error: systemError } = await client()
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "system",
        body: systemBody.trim(),
      })
      .select("*")
      .single();

    if (systemError) throw systemError;
    messages.push(mapMessage(systemRow as MessageRow));
  }

  return messages;
}

export async function updateConversationVisitor(
  conversationId: string,
  patch: {
    visitorName?: string | null;
    visitorEmail?: string | null;
    visitorPhone?: string | null;
  },
): Promise<Conversation> {
  const now = new Date().toISOString();
  const row: Record<string, string | null> = { updated_at: now };
  if (patch.visitorName !== undefined) {
    row.visitor_name = patch.visitorName?.trim() || null;
  }
  if (patch.visitorEmail !== undefined) {
    row.visitor_email = patch.visitorEmail?.trim() || null;
  }
  if (patch.visitorPhone !== undefined) {
    row.visitor_phone = patch.visitorPhone?.trim() || null;
  }

  const { data, error } = await client()
    .from("conversations")
    .update(row)
    .eq("id", conversationId)
    .select("*")
    .single();

  if (error) throw error;
  return mapConversation(data as ConversationRow);
}

export async function appendSystemMessage(
  conversationId: string,
  body: string,
): Promise<Message> {
  const now = new Date().toISOString();
  const text = body.trim();

  const { error: updateError } = await client()
    .from("conversations")
    .update({
      last_message_at: now,
      updated_at: now,
    })
    .eq("id", conversationId);

  if (updateError) throw updateError;

  const { data, error } = await client()
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role: "system",
      body: text,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapMessage(data as MessageRow);
}
