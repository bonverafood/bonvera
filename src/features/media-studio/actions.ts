"use server";

import { revalidatePath } from "next/cache";

import {
  deleteMediaAssetById,
  getMediaAssetById,
  listMediaAssets,
  MEDIA_BUCKET,
  updateMediaAssetAlt,
  type MediaAsset,
} from "@/lib/data";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { requireStudioUser, UnauthorizedError } from "@/lib/supabase/auth";

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
  console.error("[media-studio]", error);
  return "Islem basarisiz. Tekrar deneyin.";
}

function revalidateMedia() {
  revalidatePath("/studio/medya");
  revalidatePath("/studio/urunler");
}

export async function listMedia(): Promise<ActionResult<MediaAsset[]>> {
  try {
    await requireStudioUser();
    const rows = await listMediaAssets();
    return { ok: true, data: rows };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

/**
 * Storage upload deferred — UI slots remain; do not wire until RSC path is stable.
 * Kept exported so call sites can stay typed without shipping a live upload path.
 */
export async function uploadMedia(
  _formData: FormData,
): Promise<ActionResult<MediaAsset>> {
  void _formData;
  return {
    ok: false,
    error: "Gorsel yukleme gecici olarak kapali. Sonra tekrar acilacak.",
  };
}

export async function deleteMedia(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireStudioUser();
    const existing = await getMediaAssetById(id);

    if (!existing) {
      return { ok: false, error: "Medya bulunamadi." };
    }

    const supabase = createServiceRoleClient();
    const { error: removeError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove([existing.storagePath]);

    if (removeError) {
      console.error("[media-studio] remove", removeError);
    }

    await deleteMediaAssetById(id);
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
    const updated = await updateMediaAssetAlt(
      id,
      trimmed.length > 0 ? trimmed : null,
    );

    if (!updated) {
      return { ok: false, error: "Medya bulunamadi." };
    }

    revalidateMedia();
    return { ok: true, data: updated };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}
