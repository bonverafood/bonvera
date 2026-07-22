import { createServiceRoleClient } from "@/lib/supabase/admin";

import {
  mapSiteSeoDefaults,
  mapSiteSeoPage,
  type SiteSeoDefaultsRow,
  type SiteSeoPageRow,
} from "./mappers";
import {
  SITE_SEO_PAGE_KEYS,
  SITE_SEO_PAGE_PATHS,
  type SiteSeoDefaults,
  type SiteSeoPage,
  type SiteSeoPageKey,
} from "./types";

function client() {
  return createServiceRoleClient();
}

export type SiteSeoDefaultsWrite = {
  titleSuffixTr: string;
  defaultDescriptionTr: string;
  defaultOgImageUrl: string | null;
  organizationNameTr: string;
  organizationDescriptionTr: string;
};

export type SiteSeoPageWrite = {
  titleTr: string | null;
  descriptionTr: string | null;
  ogImageUrl: string | null;
};

export async function getSiteSeoDefaults(): Promise<SiteSeoDefaults | null> {
  const { data, error } = await client()
    .from("site_seo_defaults")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSiteSeoDefaults(data as SiteSeoDefaultsRow) : null;
}

export async function ensureSiteSeoDefaults(): Promise<SiteSeoDefaults> {
  const existing = await getSiteSeoDefaults();
  if (existing) return existing;

  const { data, error } = await client()
    .from("site_seo_defaults")
    .insert({
      title_suffix_tr: " · Bonvera",
      default_description_tr:
        "Fransa'da uretilen otantik Turk mutfagi. Premium mezeler, icli kofte ve sarmalar.",
      organization_name_tr: "Bonvera",
      organization_description_tr:
        "Authentic Turkish Cuisine, Crafted in France.",
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapSiteSeoDefaults(data as SiteSeoDefaultsRow);
}

export async function updateSiteSeoDefaults(
  id: string,
  input: SiteSeoDefaultsWrite,
): Promise<void> {
  const { error } = await client()
    .from("site_seo_defaults")
    .update({
      title_suffix_tr: input.titleSuffixTr,
      default_description_tr: input.defaultDescriptionTr,
      default_og_image_url: input.defaultOgImageUrl,
      organization_name_tr: input.organizationNameTr,
      organization_description_tr: input.organizationDescriptionTr,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function listSiteSeoPages(): Promise<SiteSeoPage[]> {
  const { data, error } = await client()
    .from("site_seo_pages")
    .select("*")
    .order("path", { ascending: true });

  if (error) throw error;
  return (data as SiteSeoPageRow[]).map(mapSiteSeoPage);
}

export async function ensureSiteSeoPages(): Promise<SiteSeoPage[]> {
  const existing = await listSiteSeoPages();
  const byKey = new Map(existing.map((page) => [page.pageKey, page]));
  const missing = SITE_SEO_PAGE_KEYS.filter((key) => !byKey.has(key));

  if (missing.length > 0) {
    const { error } = await client()
      .from("site_seo_pages")
      .insert(
        missing.map((pageKey) => ({
          page_key: pageKey,
          path: SITE_SEO_PAGE_PATHS[pageKey],
          title_tr: null,
          description_tr: null,
          og_image_url: null,
        })),
      );
    if (error) throw error;
    return listSiteSeoPages();
  }

  return existing;
}

export async function getSiteSeoPageByKey(
  pageKey: SiteSeoPageKey,
): Promise<SiteSeoPage | null> {
  const { data, error } = await client()
    .from("site_seo_pages")
    .select("*")
    .eq("page_key", pageKey)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSiteSeoPage(data as SiteSeoPageRow) : null;
}

export async function updateSiteSeoPage(
  pageKey: SiteSeoPageKey,
  input: SiteSeoPageWrite,
): Promise<void> {
  const { error } = await client()
    .from("site_seo_pages")
    .update({
      title_tr: input.titleTr,
      description_tr: input.descriptionTr,
      og_image_url: input.ogImageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("page_key", pageKey);

  if (error) throw error;
}
