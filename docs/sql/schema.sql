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

-- SEO Studio: site-wide defaults (single logical row) + fixed marketing pages
CREATE TABLE IF NOT EXISTS public.site_seo_defaults (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  title_suffix_tr text DEFAULT ' · Bonvera' NOT NULL,
  default_description_tr text DEFAULT '' NOT NULL,
  default_og_image_url text,
  organization_name_tr text DEFAULT 'Bonvera' NOT NULL,
  organization_description_tr text DEFAULT '' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

INSERT INTO public.site_seo_defaults (
  title_suffix_tr,
  default_description_tr,
  organization_name_tr,
  organization_description_tr
)
SELECT
  ' · Bonvera',
  'Fransa''da uretilen otantik Turk mutfagi. Premium mezeler, icli kofte ve sarmalar.',
  'Bonvera',
  'Authentic Turkish Cuisine, Crafted in France.'
WHERE NOT EXISTS (SELECT 1 FROM public.site_seo_defaults);

CREATE TABLE IF NOT EXISTS public.site_seo_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  page_key text NOT NULL,
  path text NOT NULL,
  title_tr text,
  description_tr text,
  og_image_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT site_seo_pages_page_key_unique UNIQUE (page_key)
);

INSERT INTO public.site_seo_pages (page_key, path, title_tr, description_tr)
VALUES
  (
    'home',
    '/',
    'Bonvera',
    'Fransa''da uretilen otantik Turk mutfagi. Premium mezeler, icli kofte ve sarmalar.'
  ),
  (
    'urunler',
    '/urunler',
    'Urunler — Bonvera',
    'Bonvera premium urun koleksiyonu: mezeler, icli kofte ve sarmalar.'
  ),
  (
    'tarifler',
    '/tarifler',
    'Tarifler — Bonvera',
    'Bonvera urunleriyle hazirlanan tarif fikirleri.'
  ),
  (
    'blog',
    '/blog',
    'Blog — Bonvera',
    'Bonvera marka hikayesi ve SEO odakli yazilar.'
  ),
  (
    'iletisim',
    '/iletisim',
    'Iletisim — Bonvera',
    'Bonvera ile iletisime gecin: is ortakligi, katalog ve teklif talepleri.'
  )
ON CONFLICT (page_key) DO NOTHING;
