import { createServiceRoleClient } from "@/lib/supabase/admin";

import { mapProduct, type ProductRow } from "./mappers";
import type { Product, ProductStatus } from "./types";

export type ProductWrite = {
  slug: string;
  status: ProductStatus;
  nameTr: string;
  summaryTr: string;
  bodyTr: string;
  imageUrl: string | null;
  seoTitleTr: string | null;
  seoDescriptionTr: string | null;
  ogImageUrl: string | null;
  sortOrder: number;
  publishedAt: string | null;
};

function client() {
  return createServiceRoleClient();
}

export async function listProducts(): Promise<Product[]> {
  const { data, error } = await client()
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await client()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProduct(data as ProductRow) : null;
}

export async function findProductIdBySlug(
  slug: string,
  excludeId?: string,
): Promise<string | null> {
  let query = client().from("products").select("id").eq("slug", slug);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

export async function insertProduct(
  input: ProductWrite,
): Promise<{ id: string }> {
  const { data, error } = await client()
    .from("products")
    .insert({
      slug: input.slug,
      status: input.status,
      name_tr: input.nameTr,
      summary_tr: input.summaryTr,
      body_tr: input.bodyTr,
      image_url: input.imageUrl,
      seo_title_tr: input.seoTitleTr,
      seo_description_tr: input.seoDescriptionTr,
      og_image_url: input.ogImageUrl,
      sort_order: input.sortOrder,
      published_at: input.publishedAt,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id as string };
}

export async function updateProductById(
  id: string,
  input: ProductWrite & { updatedAt: string },
): Promise<void> {
  const { error } = await client()
    .from("products")
    .update({
      slug: input.slug,
      status: input.status,
      name_tr: input.nameTr,
      summary_tr: input.summaryTr,
      body_tr: input.bodyTr,
      image_url: input.imageUrl,
      seo_title_tr: input.seoTitleTr,
      seo_description_tr: input.seoDescriptionTr,
      og_image_url: input.ogImageUrl,
      sort_order: input.sortOrder,
      published_at: input.publishedAt,
      updated_at: input.updatedAt,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function archiveProductById(id: string): Promise<void> {
  const { error } = await client()
    .from("products")
    .update({
      status: "archived",
      published_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
