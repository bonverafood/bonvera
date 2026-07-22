"use server";

import { connection } from "next/server";
import { revalidatePath } from "next/cache";

import {
  ensureSiteSeoDefaults,
  ensureSiteSeoPages,
  listProducts,
  updateSiteSeoDefaults,
  updateSiteSeoPage,
  type Product,
  type SiteSeoDefaults,
  type SiteSeoPage,
  type SiteSeoPageKey,
} from "@/lib/data";
import { requireStudioUser, UnauthorizedError } from "@/lib/supabase/auth";

import {
  emptyToNull,
  siteSeoDefaultsSchema,
  siteSeoPageSchema,
  type SiteSeoDefaultsInput,
  type SiteSeoPageInput,
} from "./schema";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type ProductSeoAuditItem = {
  id: string;
  nameTr: string;
  slug: string;
  status: Product["status"];
  missingTitle: boolean;
  missingDescription: boolean;
  missingOg: boolean;
};

function mapError(error: unknown): string {
  if (error instanceof UnauthorizedError) {
    return "Oturum gerekli. Tekrar giris yapin.";
  }
  if (
    error instanceof Error &&
    (error.message.includes("SUPABASE_SERVICE_ROLE_KEY") ||
      error.message.includes("NEXT_PUBLIC_SUPABASE_URL") ||
      error.message.includes("site_seo"))
  ) {
    return "SEO tablolari veya Supabase yapilandirmasi eksik. docs/sql/schema.sql dosyasini calistirin.";
  }
  console.error("[seo-studio]", error);
  return "Islem basarisiz. Tekrar deneyin.";
}

function isNextDynamicBailout(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string"
  ) {
    const digest = (error as { digest: string }).digest;
    if (
      digest === "DYNAMIC_SERVER_USAGE" ||
      digest.startsWith("NEXT_DYNAMIC") ||
      digest.startsWith("NEXT_PRERENDER")
    ) {
      return true;
    }
  }
  return (
    error instanceof Error &&
    (error.message.includes("Dynamic server usage") ||
      error.message.includes("couldn't be rendered statically"))
  );
}

function revalidateSeo() {
  revalidatePath("/studio/seo");
  revalidatePath("/");
  revalidatePath("/urunler");
  revalidatePath("/tarifler");
  revalidatePath("/blog");
  revalidatePath("/iletisim");
}

export async function loadSeoStudio(): Promise<
  ActionResult<{
    defaults: SiteSeoDefaults;
    pages: SiteSeoPage[];
    audit: ProductSeoAuditItem[];
  }>
> {
  try {
    await connection();
    await requireStudioUser();
    const [defaults, pages, products] = await Promise.all([
      ensureSiteSeoDefaults(),
      ensureSiteSeoPages(),
      listProducts(),
    ]);

    const audit: ProductSeoAuditItem[] = products
      .filter((product) => product.status !== "archived")
      .map((product) => ({
        id: product.id,
        nameTr: product.nameTr,
        slug: product.slug,
        status: product.status,
        missingTitle: !product.seoTitleTr?.trim(),
        missingDescription: !product.seoDescriptionTr?.trim(),
        missingOg: !product.ogImageUrl?.trim(),
      }))
      .filter(
        (item) =>
          item.missingTitle || item.missingDescription || item.missingOg,
      );

    return { ok: true, data: { defaults, pages, audit } };
  } catch (error) {
    if (isNextDynamicBailout(error)) throw error;
    return { ok: false, error: mapError(error) };
  }
}

export async function saveSiteDefaults(
  input: SiteSeoDefaultsInput,
): Promise<ActionResult> {
  try {
    await requireStudioUser();
    const parsed = siteSeoDefaultsSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Gecersiz form.",
      };
    }

    const defaults = await ensureSiteSeoDefaults();
    await updateSiteSeoDefaults(defaults.id, {
      titleSuffixTr: parsed.data.titleSuffixTr,
      defaultDescriptionTr: parsed.data.defaultDescriptionTr,
      defaultOgImageUrl: emptyToNull(parsed.data.defaultOgImageUrl),
      organizationNameTr: parsed.data.organizationNameTr,
      organizationDescriptionTr: parsed.data.organizationDescriptionTr,
    });

    revalidateSeo();
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function savePageSeo(
  input: SiteSeoPageInput,
): Promise<ActionResult> {
  try {
    await requireStudioUser();
    const parsed = siteSeoPageSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Gecersiz form.",
      };
    }

    await ensureSiteSeoPages();
    await updateSiteSeoPage(parsed.data.pageKey as SiteSeoPageKey, {
      titleTr: emptyToNull(parsed.data.titleTr),
      descriptionTr: emptyToNull(parsed.data.descriptionTr),
      ogImageUrl: emptyToNull(parsed.data.ogImageUrl),
    });

    revalidateSeo();
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}
