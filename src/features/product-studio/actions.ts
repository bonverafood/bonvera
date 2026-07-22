"use server";

import { and, asc, desc, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { products, type Product } from "@/lib/db/schema";
import { requireStudioUser, UnauthorizedError } from "@/lib/supabase/auth";

import { productInputSchema, emptyToNull, type ProductInput } from "./schema";

export type ActionResult<T = void> =
  { ok: true; data: T } | { ok: false; error: string };

function mapError(error: unknown): string {
  if (error instanceof UnauthorizedError) {
    return "Oturum gerekli. Tekrar giris yapin.";
  }
  if (error instanceof Error && error.message.includes("DATABASE_URL")) {
    return "Veritabani baglantisi yok. DATABASE_URL ayarlayin.";
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
    const rows = await db
      .select()
      .from(products)
      .orderBy(asc(products.sortOrder), desc(products.updatedAt));
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
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    return { ok: true, data: row ?? null };
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

    const [dup] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, parsed.slug))
      .limit(1);
    if (dup) {
      return { ok: false, error: "Bu slug zaten kullaniliyor." };
    }

    const publishedAt = parsed.status === "published" ? new Date() : null;

    const [created] = await db
      .insert(products)
      .values({
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
      })
      .returning({ id: products.id });

    revalidateProducts(created!.id);
    return { ok: true, data: { id: created!.id } };
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

    const [existing] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    if (!existing) {
      return { ok: false, error: "Urun bulunamadi." };
    }

    const [dup] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.slug, parsed.slug), ne(products.id, id)))
      .limit(1);
    if (dup) {
      return { ok: false, error: "Bu slug zaten kullaniliyor." };
    }

    let publishedAt = existing.publishedAt;
    if (parsed.status === "published" && !publishedAt) {
      publishedAt = new Date();
    }
    if (parsed.status === "archived") {
      publishedAt = null;
    }

    await db
      .update(products)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

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
    await db
      .update(products)
      .set({
        status: "archived",
        publishedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));
    revalidateProducts(id);
    return { ok: true, data: { id } };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}
