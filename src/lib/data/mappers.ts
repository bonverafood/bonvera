import type { MediaAsset, Product, ProductStatus } from "./types";

/** Raw Supabase `products` row (snake_case). */
export type ProductRow = {
  id: string;
  slug: string;
  status: ProductStatus;
  name_tr: string;
  summary_tr: string;
  body_tr: string;
  image_url: string | null;
  seo_title_tr: string | null;
  seo_description_tr: string | null;
  og_image_url: string | null;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Raw Supabase `media_assets` row (snake_case). */
export type MediaAssetRow = {
  id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  mime_type: string;
  byte_size: number;
  kind: "image";
  alt_tr: string | null;
  created_by: string | null;
  created_at: string;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    nameTr: row.name_tr,
    summaryTr: row.summary_tr,
    bodyTr: row.body_tr,
    imageUrl: row.image_url,
    seoTitleTr: row.seo_title_tr,
    seoDescriptionTr: row.seo_description_tr,
    ogImageUrl: row.og_image_url,
    sortOrder: row.sort_order,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMediaAsset(row: MediaAssetRow): MediaAsset {
  return {
    id: row.id,
    storagePath: row.storage_path,
    publicUrl: row.public_url,
    fileName: row.file_name,
    mimeType: row.mime_type,
    byteSize: row.byte_size,
    kind: row.kind,
    altTr: row.alt_tr,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}
