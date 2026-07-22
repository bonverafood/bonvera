-- Messages inbox (Ask chat + contact form) — run in Supabase SQL Editor

DO $$ BEGIN
  CREATE TYPE public.conversation_source AS ENUM ('ask', 'contact');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.conversation_status AS ENUM ('new', 'read', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  source public.conversation_source NOT NULL,
  status public.conversation_status DEFAULT 'new' NOT NULL,
  locale text DEFAULT 'fr' NOT NULL,
  visitor_name text,
  visitor_email text,
  preview text DEFAULT '' NOT NULL,
  last_message_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  conversation_id uuid NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('visitor', 'system')),
  body text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS conversations_status_last_message_idx
  ON public.conversations (status, last_message_at DESC);

CREATE INDEX IF NOT EXISTS messages_conversation_created_idx
  ON public.messages (conversation_id, created_at ASC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: access only via service role (server actions).
