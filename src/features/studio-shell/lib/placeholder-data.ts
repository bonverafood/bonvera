/** Realistic Bonvera placeholder data — UI shell only, not live data. */

export const DASHBOARD_STATS = [
  {
    id: "products",
    labelKey: "dashboard.stats.products",
    value: "24",
    hintKey: "dashboard.stats.productsHint",
  },
  {
    id: "collections",
    labelKey: "dashboard.stats.collections",
    value: "4",
    hintKey: "dashboard.stats.collectionsHint",
  },
  {
    id: "ordersInterest",
    labelKey: "dashboard.stats.messages",
    value: "7",
    hintKey: "dashboard.stats.messagesHint",
  },
  {
    id: "recipes",
    labelKey: "dashboard.stats.recipes",
    value: "12",
    hintKey: "dashboard.stats.recipesHint",
  },
] as const;

export const RECENT_PRODUCTS = [
  {
    name: "Çiğ İçli Köfte",
    collection: "İçli Köfte",
    statusKey: "dashboard.status.published",
    updatedKey: "dashboard.time.hoursAgo",
    updatedCount: 2,
  },
  {
    name: "Yaprak Sarma",
    collection: "Sarmalar",
    statusKey: "dashboard.status.published",
    updatedKey: "dashboard.time.hoursAgo",
    updatedCount: 5,
  },
  {
    name: "Humus",
    collection: "Mezeler",
    statusKey: "dashboard.status.draft",
    updatedKey: "dashboard.time.yesterday",
    updatedCount: 0,
  },
  {
    name: "Acılı Ezme",
    collection: "Mezeler",
    statusKey: "dashboard.status.published",
    updatedKey: "dashboard.time.daysAgo",
    updatedCount: 3,
  },
] as const;

export const LATEST_MESSAGES = [
  {
    from: "Le Petit Mezze — Lyon",
    preview: "Haftalık içli köfte siparişi için stok teyidi alabilir miyiz?",
    timeKey: "dashboard.time.minutesAgo",
    timeCount: 18,
    unread: true,
  },
  {
    from: "Carrefour Proximité",
    preview: "Yeni meze koleksiyonu için fiyat listesi talebi.",
    timeKey: "dashboard.time.hoursAgo",
    timeCount: 3,
    unread: true,
  },
  {
    from: "Bonvera TR Operasyon",
    preview: "PDF katalog v2 baskıya hazır — son kontrol?",
    timeKey: "dashboard.time.hoursAgo",
    timeCount: 6,
    unread: false,
  },
] as const;

export const RECENT_ACTIVITY = [
  {
    title: "Çiğ İçli Köfte görseli güncellendi",
    metaKey: "dashboard.activityMeta.media",
    timeKey: "dashboard.time.hoursAgo",
    timeCount: 1,
  },
  {
    title: "FR çevirisi: Yaprak Sarma açıklaması",
    metaKey: "dashboard.activityMeta.translation",
    timeKey: "dashboard.time.hoursAgo",
    timeCount: 4,
  },
  {
    title: "Blog taslağı: Ramazan meze tabağı",
    metaKey: "dashboard.activityMeta.blog",
    timeKey: "dashboard.time.yesterday",
    timeCount: 0,
  },
  {
    title: "SEO meta: Anasayfa başlığı düzenlendi",
    metaKey: "dashboard.activityMeta.seo",
    timeKey: "dashboard.time.daysAgo",
    timeCount: 2,
  },
] as const;

export const QUICK_ACTIONS = [
  {
    id: "product",
    href: "/studio/urunler",
    labelKey: "dashboard.quick.product",
  },
  {
    id: "media",
    href: "/studio/medya",
    labelKey: "dashboard.quick.media",
  },
  {
    id: "pdf",
    href: "/studio/pdf-katalog",
    labelKey: "dashboard.quick.pdf",
  },
  {
    id: "ask",
    href: "/studio/ask-bonvera",
    labelKey: "dashboard.quick.ask",
  },
] as const;
