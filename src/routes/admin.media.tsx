import { useState, useRef } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Copy, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import {
  deleteMedia,
  listMedia,
  publicUrlFor,
  updateMediaMeta,
  uploadMedia,
  type MediaRow,
} from "@/lib/media";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/media")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const media = await listMedia();
    return { identity, media };
  },
  component: AdminMedia,
});

function AdminMedia() {
  const { identity, media } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaRow | null>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    let done = 0;
    for (const file of Array.from(files)) {
      setProgress(`${done + 1} / ${files.length}: ${file.name}`);
      try {
        await uploadMedia(file);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        toast.error(`${file.name}: ${message}`);
      }
      done += 1;
    }
    setUploading(false);
    setProgress(null);
    toast.success(`${files.length} file${files.length === 1 ? "" : "s"} uploaded`);
    if (fileInput.current) fileInput.current.value = "";
    router.invalidate();
  }

  async function handleDelete(row: MediaRow) {
    if (!confirm(`Delete ${row.title ?? row.storage_path}?`)) return;
    try {
      await deleteMedia(row);
      toast.success("Deleted");
      setSelected(null);
      router.invalidate();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      toast.error(message);
    }
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Media library"
        intro={`${media.length} file${media.length === 1 ? "" : "s"} in the public bucket`}
        actions={
          writable ? (
            <>
              <input
                ref={fileInput}
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={(ev) => handleUpload(ev.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                <Upload className="h-4 w-4" />
                {uploading ? progress ?? "Uploading…" : "Upload"}
              </button>
            </>
          ) : null
        }
      />

      {media.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-border bg-card p-10 text-center"
          onDragOver={(ev) => ev.preventDefault()}
          onDrop={(ev) => {
            ev.preventDefault();
            handleUpload(ev.dataTransfer.files);
          }}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No media yet. Drop files here or click Upload above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {media.map((row) => {
            const url = publicUrlFor(row.bucket, row.storage_path);
            const isImage = row.mime_type?.startsWith("image/");
            return (
              <button
                key={row.id}
                onClick={() => setSelected(row)}
                className="group overflow-hidden rounded-lg border border-border bg-card text-left transition-colors hover:border-primary/40"
              >
                <div className="relative aspect-square bg-surface">
                  {isImage && url ? (
                    <img
                      src={url}
                      alt={row.alt ?? row.title ?? ""}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      {row.mime_type ?? "file"}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium">
                    {row.title ?? row.storage_path.split("/").pop()}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {row.width && row.height ? `${row.width}×${row.height}` : ""}
                    {row.size_bytes ? ` · ${formatBytes(row.size_bytes)}` : ""}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected ? (
        <MediaDetail
          row={selected}
          writable={writable}
          canDelete={isSuperAdmin(identity.role)}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            router.invalidate();
          }}
          onDelete={() => handleDelete(selected)}
        />
      ) : null}
    </AdminShell>
  );
}

function MediaDetail({
  row,
  writable,
  canDelete,
  onClose,
  onSaved,
  onDelete,
}: {
  row: MediaRow;
  writable: boolean;
  canDelete: boolean;
  onClose: () => void;
  onSaved: () => void;
  onDelete: () => void;
}) {
  const url = publicUrlFor(row.bucket, row.storage_path);
  const [alt, setAlt] = useState(row.alt ?? "");
  const [title, setTitle] = useState(row.title ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await updateMediaMeta(row.id, { alt, title });
      toast.success("Saved");
      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      toast.error(message);
      setSaving(false);
    }
  }

  function copyUrl() {
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  function copyPath() {
    navigator.clipboard.writeText(row.storage_path);
    toast.success("Storage path copied");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur p-4"
      onClick={onClose}
    >
      <div
        onClick={(ev) => ev.stopPropagation()}
        className="grid max-h-[90vh] w-full max-w-4xl gap-6 overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lg md:grid-cols-[1fr_320px]"
      >
        <div className="flex items-center justify-center rounded-md border border-border bg-surface p-4">
          {url && row.mime_type?.startsWith("image/") ? (
            <img src={url} alt={row.alt ?? ""} className="max-h-[60vh] object-contain" />
          ) : (
            <div className="text-sm text-muted-foreground">{row.mime_type ?? "file"}</div>
          )}
        </div>
        <div>
          <div className="mb-2 flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold">Media</h2>
            <button
              onClick={onClose}
              className="rounded-md border border-border px-3 py-1 text-xs"
            >
              Close
            </button>
          </div>

          <fieldset disabled={!writable} className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium">Title</span>
              <input
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Alt text (for screen readers)</span>
              <input
                value={alt}
                onChange={(ev) => setAlt(ev.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
          </fieldset>

          <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
            <div>
              <dt className="font-medium text-foreground">Storage path</dt>
              <dd className="mt-0.5 font-mono break-all">{row.storage_path}</dd>
            </div>
            {row.mime_type ? (
              <div>
                <dt className="font-medium text-foreground">Type</dt>
                <dd>{row.mime_type}</dd>
              </div>
            ) : null}
            {row.width && row.height ? (
              <div>
                <dt className="font-medium text-foreground">Dimensions</dt>
                <dd>
                  {row.width} × {row.height}
                </dd>
              </div>
            ) : null}
            {row.size_bytes ? (
              <div>
                <dt className="font-medium text-foreground">Size</dt>
                <dd>{formatBytes(row.size_bytes)}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-4 space-y-2">
            <button
              onClick={copyUrl}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:border-primary/40"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy public URL
            </button>
            <button
              onClick={copyPath}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:border-primary/40"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy storage path
            </button>
          </div>

          {writable ? (
            <div className="mt-4 flex gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save metadata"}
              </button>
              {canDelete ? (
                <button
                  onClick={onDelete}
                  className="rounded-md border border-destructive/60 px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
