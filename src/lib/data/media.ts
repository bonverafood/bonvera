import { createServiceRoleClient } from "@/lib/supabase/admin";

import { mapMediaAsset, type MediaAssetRow } from "./mappers";
import type { MediaAsset } from "./types";
import { MEDIA_BUCKET } from "./types";

export { MEDIA_ALLOWED_MIME, MEDIA_BUCKET, MEDIA_MAX_BYTES } from "./types";

function client() {
  return createServiceRoleClient();
}

export async function listMediaAssets(): Promise<MediaAsset[]> {
  const { data, error } = await client()
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as MediaAssetRow[]).map(mapMediaAsset);
}

export async function getMediaAssetById(
  id: string,
): Promise<MediaAsset | null> {
  const { data, error } = await client()
    .from("media_assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapMediaAsset(data as MediaAssetRow) : null;
}

export async function insertMediaAsset(input: {
  storagePath: string;
  publicUrl: string;
  fileName: string;
  mimeType: string;
  byteSize: number;
  createdBy: string;
}): Promise<MediaAsset> {
  const { data, error } = await client()
    .from("media_assets")
    .insert({
      storage_path: input.storagePath,
      public_url: input.publicUrl,
      file_name: input.fileName,
      mime_type: input.mimeType,
      byte_size: input.byteSize,
      kind: "image",
      created_by: input.createdBy,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapMediaAsset(data as MediaAssetRow);
}

export async function deleteMediaAssetById(id: string): Promise<void> {
  const { error } = await client().from("media_assets").delete().eq("id", id);
  if (error) throw error;
}

export async function updateMediaAssetAlt(
  id: string,
  altTr: string | null,
): Promise<MediaAsset | null> {
  const { data, error } = await client()
    .from("media_assets")
    .update({ alt_tr: altTr })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data ? mapMediaAsset(data as MediaAssetRow) : null;
}

export function getMediaPublicUrl(storagePath: string) {
  return client().storage.from(MEDIA_BUCKET).getPublicUrl(storagePath).data
    .publicUrl;
}
