-- Add FR product fields (run in Supabase SQL Editor)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name_fr text DEFAULT '' NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS summary_fr text DEFAULT '' NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS body_fr text DEFAULT '' NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_title_fr text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_description_fr text;
