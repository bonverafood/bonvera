import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileText,
  FolderOpen,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Package,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react";

export type StudioNavId =
  | "dashboard"
  | "products"
  | "collections"
  | "recipes"
  | "blog"
  | "media"
  | "seo"
  | "pdf"
  | "ask"
  | "messages"
  | "brand";

export type StudioNavItem = {
  id: StudioNavId;
  href: string;
  labelKey: string;
  icon: LucideIcon;
  /** Match path prefixes under /studio */
  match: string[];
};

/**
 * Bonvera Studio primary navigation (Turkish labels via i18n keys).
 * Paths are internal `/studio/...` routes.
 */
export const STUDIO_NAV: readonly StudioNavItem[] = [
  {
    id: "dashboard",
    href: "/studio",
    labelKey: "nav.dashboard",
    icon: LayoutDashboard,
    match: ["/studio"],
  },
  {
    id: "products",
    href: "/studio/urunler",
    labelKey: "nav.products",
    icon: Package,
    match: ["/studio/urunler"],
  },
  {
    id: "collections",
    href: "/studio/koleksiyonlar",
    labelKey: "nav.collections",
    icon: FolderOpen,
    match: ["/studio/koleksiyonlar"],
  },
  {
    id: "recipes",
    href: "/studio/tarifler",
    labelKey: "nav.recipes",
    icon: BookOpen,
    match: ["/studio/tarifler"],
  },
  {
    id: "blog",
    href: "/studio/blog",
    labelKey: "nav.blog",
    icon: FileText,
    match: ["/studio/blog"],
  },
  {
    id: "media",
    href: "/studio/medya",
    labelKey: "nav.media",
    icon: ImageIcon,
    match: ["/studio/medya"],
  },
  {
    id: "seo",
    href: "/studio/seo",
    labelKey: "nav.seo",
    icon: Search,
    match: ["/studio/seo"],
  },
  {
    id: "pdf",
    href: "/studio/pdf-katalog",
    labelKey: "nav.pdf",
    icon: FileText,
    match: ["/studio/pdf-katalog"],
  },
  {
    id: "ask",
    href: "/studio/ask-bonvera",
    labelKey: "nav.ask",
    icon: Sparkles,
    match: ["/studio/ask-bonvera"],
  },
  {
    id: "messages",
    href: "/studio/mesajlar",
    labelKey: "nav.messages",
    icon: MessageSquare,
    match: ["/studio/mesajlar"],
  },
  {
    id: "brand",
    href: "/studio/marka",
    labelKey: "nav.brand",
    icon: Settings2,
    match: ["/studio/marka"],
  },
] as const;

export function getActiveNavId(pathname: string): StudioNavId {
  const normalized = pathname.replace(/\/$/, "") || "/";

  // More specific paths first (skip dashboard exact-only until end)
  const candidates = [...STUDIO_NAV].filter((item) => item.id !== "dashboard");
  for (const item of candidates) {
    if (
      item.match.some(
        (prefix) =>
          normalized === prefix || normalized.startsWith(`${prefix}/`),
      )
    ) {
      return item.id;
    }
  }

  if (normalized === "/studio" || normalized.endsWith("/studio")) {
    return "dashboard";
  }

  return "dashboard";
}

export function getNavItem(id: StudioNavId) {
  return STUDIO_NAV.find((item) => item.id === id) ?? STUDIO_NAV[0];
}
