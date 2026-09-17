/**
 * Media library helpers. Files live in Supabase Storage bucket `public-media`;
 * metadata lives in the `public.media` table.
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type MediaRow = Database["public"]["Tables"]["media"]["Row"];

export const PUBLIC_MEDIA_BUCKET = "public-media";

/** Build a public URL for a file at bucket/path. */
export function publicUrlFor(bucket: string | null, path: string | null): string | null {
  if (!bucket || !path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl ?? null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return null;
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export async function uploadMedia(
  file: File,
  opts: { folder?: string; alt?: string; title?: string } = {},
): Promise<MediaRow> {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const folder = opts.folder ?? `media-library/${yyyy}/${mm}`;
  const ext = (file.name.match(/\.[^.]+$/)?.[0] ?? "").toLowerCase();
  const base = slugify(file.name) || "file";
  const path = `${folder}/${base}-${Date.now()}${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(PUBLIC_MEDIA_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
  if (uploadError) throw uploadError;

  const dims = await readImageDimensions(file);

  const { data, error: insertError } = await supabase
    .from("media")
    .insert({
      bucket: PUBLIC_MEDIA_BUCKET,
      storage_path: path,
      alt: opts.alt ?? null,
      title: opts.title ?? file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
    })
    .select()
    .single();

  if (insertError) {
    // Roll the storage file back
    await supabase.storage.from(PUBLIC_MEDIA_BUCKET).remove([path]).catch(() => {});
    throw insertError;
  }

  return data;
}

export async function deleteMedia(row: MediaRow): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from(row.bucket)
    .remove([row.storage_path]);
  if (storageError) throw storageError;
  const { error: dbError } = await supabase.from("media").delete().eq("id", row.id);
  if (dbError) throw dbError;
}

export async function updateMediaMeta(
  id: string,
  patch: { alt?: string | null; title?: string | null },
): Promise<void> {
  const { error } = await supabase.from("media").update(patch).eq("id", id);
  if (error) throw error;
}

export async function listMedia(): Promise<MediaRow[]> {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
