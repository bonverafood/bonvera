export type ProductStatus = "draft" | "published" | "archived";

export type Product = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

export type MediaKind = "image";

export type MediaAsset = {
  id: string;
  storagePath: string;
  publicUrl: string;
  fileName: string;
  mimeType: string;
  byteSize: number;
  kind: MediaKind;
  altTr: string | null;
  createdBy: string | null;
  createdAt: string;
};

export const MEDIA_BUCKET = "media";
export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;
export const MEDIA_ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
