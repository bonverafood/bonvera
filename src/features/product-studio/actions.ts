"use server";

import { revalidatePath } from "next/cache";

import {
  archiveProductById,
  findProductIdBySlug,
  getProductById,
  insertProduct,
  listProducts as listProductsQuery,
  updateProductById,
  type Product,
} from "@/lib/data";
import { requireStudioUser, UnauthorizedError } from "@/lib/supabase/auth";

import { emptyToNull, productInputSchema, type ProductInput } from "./schema";

export type ActionResult<T = void> =
  { ok: true; data: T } | { ok: false; error: string };

function mapError(error: unknown): string {
  if (error instanceof UnauthorizedError) {
    return "Oturum gerekli. Tekrar giris yapin.";
  }
  if (
    error instanceof Error &&
    (error.message.includes("SUPABASE_SERVICE_ROLE_KEY") ||
      error.message.includes("NEXT_PUBLIC_SUPABASE_URL"))
  ) {
    return "Supabase yapilandirmasi eksik. URL ve SERVICE_ROLE_KEY ayarlayin.";
  }
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  ) {
    return "Bu slug zaten kullaniliyor.";
  }
  if (error instanceof Error && /unique|duplicate/i.test(error.message)) {
    return "Bu slug zaten kullaniliyor.";
  }
  console.error("[product-studio]", error);
  return "Islem basarisiz. Tekrar deneyin.";
}

function revalidateProducts(id?: string) {
  revalidatePath("/studio/urunler");
  if (id) {
    revalidatePath(`/studio/urunler/${id}`);
  }
}

export async function listProducts(): Promise<ActionResult<Product[]>> {
  try {
    await requireStudioUser();
    const rows = await listProductsQuery();
    return { ok: true, data: rows };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function getProduct(
  id: string,
): Promise<ActionResult<Product | null>> {
  try {
    await requireStudioUser();
    const row = await getProductById(id);
    return { ok: true, data: row };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function createProduct(
  input: ProductInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireStudioUser();
    const parsed = productInputSchema.parse(input);

    const dupId = await findProductIdBySlug(parsed.slug);
    if (dupId) {
      return { ok: false, error: "Bu slug zaten kullaniliyor." };
    }

    const publishedAt =
      parsed.status === "published" ? new Date().toISOString() : null;

    const created = await insertProduct({
      slug: parsed.slug,
      status: parsed.status,
      nameTr: parsed.nameTr,
      summaryTr: parsed.summaryTr,
      bodyTr: parsed.bodyTr,
      imageUrl: emptyToNull(parsed.imageUrl),
      seoTitleTr: emptyToNull(parsed.seoTitleTr),
      seoDescriptionTr: emptyToNull(parsed.seoDescriptionTr),
      ogImageUrl: emptyToNull(parsed.ogImageUrl),
      sortOrder: parsed.sortOrder,
      publishedAt,
    });

    revalidateProducts(created.id);
    return { ok: true, data: { id: created.id } };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireStudioUser();
    const parsed = productInputSchema.parse(input);

    const existing = await getProductById(id);
    if (!existing) {
      return { ok: false, error: "Urun bulunamadi." };
    }

    const dupId = await findProductIdBySlug(parsed.slug, id);
    if (dupId) {
      return { ok: false, error: "Bu slug zaten kullaniliyor." };
    }

    let publishedAt = existing.publishedAt;
    if (parsed.status === "published" && !publishedAt) {
      publishedAt = new Date().toISOString();
    }
    if (parsed.status === "archived") {
      publishedAt = null;
    }

    await updateProductById(id, {
      slug: parsed.slug,
      status: parsed.status,
      nameTr: parsed.nameTr,
      summaryTr: parsed.summaryTr,
      bodyTr: parsed.bodyTr,
      imageUrl: emptyToNull(parsed.imageUrl),
      seoTitleTr: emptyToNull(parsed.seoTitleTr),
      seoDescriptionTr: emptyToNull(parsed.seoDescriptionTr),
      ogImageUrl: emptyToNull(parsed.ogImageUrl),
      sortOrder: parsed.sortOrder,
      publishedAt,
      updatedAt: new Date().toISOString(),
    });

    revalidateProducts(id);
    return { ok: true, data: { id } };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function archiveProduct(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireStudioUser();
    await archiveProductById(id);
    revalidateProducts(id);
    return { ok: true, data: { id } };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}
