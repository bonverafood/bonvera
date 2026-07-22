-- Ask chat: optional visitor phone (FR / TR free-form, no format constraint)

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS visitor_phone text;
