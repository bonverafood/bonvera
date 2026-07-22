"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileText,
  FolderOpen,
  ImageIcon,
  MessageSquare,
  Package,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import type { StudioNavId } from "../constants/nav";
import { StudioEmptyState } from "./studio-empty-state";
import { StudioPageHeader } from "./studio-page-header";

const MODULE_ICONS: Record<Exclude<StudioNavId, "dashboard">, LucideIcon> = {
  products: Package,
  collections: FolderOpen,
  recipes: BookOpen,
  blog: FileText,
  media: ImageIcon,
  seo: Search,
  pdf: FileText,
  ask: Sparkles,
  messages: MessageSquare,
  brand: Settings2,
};

type StudioModulePageProps = {
  navId: Exclude<StudioNavId, "dashboard">;
};

export function StudioModulePage({ navId }: StudioModulePageProps) {
  const t = useTranslations("StudioShell");
  const base = `modules.${navId}` as const;
  const Icon = MODULE_ICONS[navId];

  return (
    <div>
      <StudioPageHeader
        title={t(`${base}.title`)}
        description={t(`${base}.description`)}
        actions={
          <Button type="button" size="lg">
            {t(`${base}.primaryAction`)}
          </Button>
        }
      />
      <StudioEmptyState
        icon={<Icon className="size-5" aria-hidden />}
        title={t(`${base}.emptyTitle`)}
        description={t(`${base}.emptyDescription`)}
        actionLabel={t(`${base}.primaryAction`)}
      />
      <p className="text-muted-foreground mt-6 text-xs">
        {t("modules.shellNote")}
      </p>
    </div>
  );
}
