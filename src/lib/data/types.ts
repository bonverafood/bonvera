export type ProductStatus = "draft" | "published" | "archived";

export type Product = {
  id: string;
  slug: string;
  status: ProductStatus;
  nameTr: string;
  summaryTr: string;
  bodyTr: string;
  nameFr: string;
  summaryFr: string;
  bodyFr: string;
  imageUrl: string | null;
  seoTitleTr: string | null;
  seoDescriptionTr: string | null;
  seoTitleFr: string | null;
  seoDescriptionFr: string | null;
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

export const SITE_SEO_PAGE_KEYS = [
  "home",
  "urunler",
  "tarifler",
  "blog",
  "iletisim",
] as const;

export type SiteSeoPageKey = (typeof SITE_SEO_PAGE_KEYS)[number];

export const SITE_SEO_PAGE_PATHS: Record<SiteSeoPageKey, string> = {
  home: "/",
  urunler: "/urunler",
  tarifler: "/tarifler",
  blog: "/blog",
  iletisim: "/iletisim",
};

export type SiteSeoDefaults = {
  id: string;
  titleSuffixTr: string;
  defaultDescriptionTr: string;
  defaultOgImageUrl: string | null;
  organizationNameTr: string;
  organizationDescriptionTr: string;
  createdAt: string;
  updatedAt: string;
};

export type SiteSeoPage = {
  id: string;
  pageKey: SiteSeoPageKey;
  path: string;
  titleTr: string | null;
  descriptionTr: string | null;
  ogImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationSource = "ask" | "contact";
export type ConversationStatus = "new" | "read" | "archived";
export type MessageRole = "visitor" | "system";

export type Conversation = {
  id: string;
  source: ConversationSource;
  status: ConversationStatus;
  locale: string;
  visitorName: string | null;
  visitorEmail: string | null;
  preview: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  role: MessageRole;
  body: string;
  createdAt: string;
};

export type ConversationWithMessages = Conversation & {
  messages: Message[];
};
