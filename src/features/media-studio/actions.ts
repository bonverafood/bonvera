"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import {
  MEDIA_ALLOWED_MIME,
  MEDIA_BUCKET,
  MEDIA_MAX_BYTES,
  mediaAssets,
  type MediaAsset,
} from "@/lib/db/schema";
import { requireStudioUser, UnauthorizedError } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/admin";

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
    return "Depolama yapilandirmasi eksik. SUPABASE_SERVICE_ROLE_KEY ayarlayin.";
  }
  if (error instanceof Error && error.message.includes("DATABASE_URL")) {
    return "Veritabani baglantisi yok. DATABASE_URL ayarlayin.";
  }
  console.error("[media-studio]", error);
  return "Islem basarisiz. Tekrar deneyin.";
}

function revalidateMedia() {
  revalidatePath("/studio/medya");
  revalidatePath("/studio/urunler");
}

function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 120);
}

export async function listMedia(): Promise<ActionResult<MediaAsset[]>> {
  try {
    await requireStudioUser();
    const rows = await db
      .select()
      .from(mediaAssets)
      .orderBy(desc(mediaAssets.createdAt));
    return { ok: true, data: rows };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function uploadMedia(
  formData: FormData,
): Promise<ActionResult<MediaAsset>> {
  try {
    const user = await requireStudioUser();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return { ok: false, error: "Dosya secilmedi." };
    }

    if (
      !MEDIA_ALLOWED_MIME.includes(
        file.type as (typeof MEDIA_ALLOWED_MIME)[number],
      )
    ) {
      return {
        ok: false,
        error: "Yalnizca JPEG, PNG veya WebP yuklenebilir.",
      };
    }

    if (file.size <= 0 || file.size > MEDIA_MAX_BYTES) {
      return { ok: false, error: "Dosya boyutu en fazla 5 MB olmali." };
    }

    const safeName = sanitizeFileName(file.name) || "image";
    const storagePath = `${user.id}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = createServiceRoleClient();
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[media-studio] upload", uploadError);
      return {
        ok: false,
        error:
          uploadError.message.includes("Bucket not found") ||
          uploadError.message.includes("not found")
            ? "Storage bucket 'media' bulunamadi. Supabase'de olusturun."
            : "Yukleme basarisiz. Tekrar deneyin.",
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);

    const [created] = await db
      .insert(mediaAssets)
      .values({
        storagePath,
        publicUrl,
        fileName: file.name.slice(0, 200),
        mimeType: file.type,
        byteSize: file.size,
        kind: "image",
        createdBy: user.id,
      })
      .returning();

    revalidateMedia();
    return { ok: true, data: created! };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function deleteMedia(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireStudioUser();
    const [existing] = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.id, id))
      .limit(1);

    if (!existing) {
      return { ok: false, error: "Medya bulunamadi." };
    }

    const supabase = createServiceRoleClient();
    const { error: removeError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove([existing.storagePath]);

    if (removeError) {
      console.error("[media-studio] remove", removeError);
      // Continue DB delete if file already gone
    }

    await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
    revalidateMedia();
    return { ok: true, data: { id } };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

export async function updateMediaAlt(
  id: string,
  altTr: string,
): Promise<ActionResult<MediaAsset>> {
  try {
    await requireStudioUser();
    const trimmed = altTr.trim().slice(0, 200);
    const [updated] = await db
      .update(mediaAssets)
      .set({ altTr: trimmed.length > 0 ? trimmed : null })
      .where(eq(mediaAssets.id, id))
      .returning();

    if (!updated) {
      return { ok: false, error: "Medya bulunamadi." };
    }

    revalidateMedia();
    return { ok: true, data: updated };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}
