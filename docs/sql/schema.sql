-- Bonvera Studio schema (run in Supabase SQL Editor)
-- Data layer: Supabase JS client only (no Drizzle / DATABASE_URL)

DO $$ BEGIN
  CREATE TYPE public.product_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.media_kind AS ENUM ('image');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  slug text NOT NULL,
  status public.product_status DEFAULT 'draft' NOT NULL,
  name_tr text NOT NULL,
  summary_tr text DEFAULT '' NOT NULL,
  body_tr text DEFAULT '' NOT NULL,
  image_url text,
  seo_title_tr text,
  seo_description_tr text,
  og_image_url text,
  sort_order integer DEFAULT 0 NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT products_slug_unique UNIQUE (slug)
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  byte_size integer NOT NULL,
  kind public.media_kind DEFAULT 'image' NOT NULL,
  alt_tr text,
  created_by text,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT media_assets_storage_path_unique UNIQUE (storage_path)
);
