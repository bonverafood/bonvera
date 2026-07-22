import type {
  MediaAsset,
  Product,
  ProductStatus,
  SiteSeoDefaults,
  SiteSeoPage,
  SiteSeoPageKey,
  Conversation,
  ConversationSource,
  ConversationStatus,
  Message,
  MessageRole,
} from "./types";

/** Raw Supabase `products` row (snake_case). */
export type ProductRow = {
  id: string;
  slug: string;
  status: ProductStatus;
  name_tr: string;
  summary_tr: string;
  body_tr: string;
  name_fr: string | null;
  summary_fr: string | null;
  body_fr: string | null;
  image_url: string | null;
  seo_title_tr: string | null;
  seo_description_tr: string | null;
  seo_title_fr: string | null;
  seo_description_fr: string | null;
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
    nameFr: row.name_fr ?? "",
    summaryFr: row.summary_fr ?? "",
    bodyFr: row.body_fr ?? "",
    imageUrl: row.image_url,
    seoTitleTr: row.seo_title_tr,
    seoDescriptionTr: row.seo_description_tr,
    seoTitleFr: row.seo_title_fr,
    seoDescriptionFr: row.seo_description_fr,
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

/** Raw Supabase `site_seo_defaults` row. */
export type SiteSeoDefaultsRow = {
  id: string;
  title_suffix_tr: string;
  default_description_tr: string;
  default_og_image_url: string | null;
  organization_name_tr: string;
  organization_description_tr: string;
  created_at: string;
  updated_at: string;
};

/** Raw Supabase `site_seo_pages` row. */
export type SiteSeoPageRow = {
  id: string;
  page_key: string;
  path: string;
  title_tr: string | null;
  description_tr: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export function mapSiteSeoDefaults(row: SiteSeoDefaultsRow): SiteSeoDefaults {
  return {
    id: row.id,
    titleSuffixTr: row.title_suffix_tr,
    defaultDescriptionTr: row.default_description_tr,
    defaultOgImageUrl: row.default_og_image_url,
    organizationNameTr: row.organization_name_tr,
    organizationDescriptionTr: row.organization_description_tr,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSiteSeoPage(row: SiteSeoPageRow): SiteSeoPage {
  return {
    id: row.id,
    pageKey: row.page_key as SiteSeoPageKey,
    path: row.path,
    titleTr: row.title_tr,
    descriptionTr: row.description_tr,
    ogImageUrl: row.og_image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Raw Supabase `conversations` row. */
export type ConversationRow = {
  id: string;
  source: ConversationSource;
  status: ConversationStatus;
  locale: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  preview: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
};

/** Raw Supabase `messages` row. */
export type MessageRow = {
  id: string;
  conversation_id: string;
  role: MessageRole;
  body: string;
  created_at: string;
};

export function mapConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    source: row.source,
    status: row.status,
    locale: row.locale,
    visitorName: row.visitor_name,
    visitorEmail: row.visitor_email,
    visitorPhone: row.visitor_phone ?? null,
    preview: row.preview,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role,
    body: row.body,
    createdAt: row.created_at,
  };
}
