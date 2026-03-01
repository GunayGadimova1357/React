import { useMemo, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { getMyArtistAlbums, createArtistAlbum, updateArtistAlbum, deleteArtistAlbum, type AlbumResponseDto } from "@/services/artistAlbumsApi";
import { getMyArtistSongs } from "@/services/artistSongsApi";

const getStatus = (releaseDate: string, t: any) => {
  const date = new Date(releaseDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today
    ? { label: t("releases.status.published"), color: "text-emerald-400 bg-emerald-500/10" }
    : { label: t("releases.status.scheduled"), color: "text-amber-400 bg-amber-500/10" };
};

export function Releases() {
  const { t } = useTranslation();
  const [releases, setReleases] = useState<AlbumResponseDto[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AlbumResponseDto | null>(null);
  const [deleting, setDeleting] = useState<AlbumResponseDto | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  useEffect(() => {
    Promise.all([getMyArtistAlbums(), getMyArtistSongs()])
      .then(([albums, songs]) => {
        setReleases(albums);
        setTracks(songs);
      })
      .catch((e) => {
        console.error("Load releases error:", e);
        toast.error(e?.response?.data?.message || e?.message || "Failed to load releases");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return releases.filter(
      (r) =>
        r.albumName.toLowerCase().includes(q) ||
        (r.isSingle ? "single" : "album").toLowerCase().includes(q)
    ).map(r => ({
      ...r,
      songsCount: tracks.filter(t => t.albumId === r.id).length
    }));
  }, [releases, query, tracks]);

  const handleSave = async (data: { albumName: string; releaseDate: string; isSingle: boolean; coverFile?: File | null }) => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateArtistAlbum(editing.id, data);
        setReleases((prev) => prev.map((r) => (r.id === editing.id ? updated : r)));
        toast.success(t("releases.toast.updated"));
      } else {
        const created = await createArtistAlbum(data);
        setReleases((prev) => [created, ...prev]);
        toast.success(t("releases.toast.created"));
      }
      setEditing(null);
      setCreateOpen(false);
    } catch (e: any) {
      console.error("Save error:", e);
      toast.error(e?.response?.data?.message || e?.message || "Save failed");
    } finally {
      setSaving(false)
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await deleteArtistAlbum(deleting.id);
      setReleases((prev) => prev.filter((r) => r.id !== deleting.id));
      toast.success(t("releases.toast.deleted", { title: deleting.albumName }));
      setDeleting(null);
    } catch (e: any) {
      console.error("Delete error:", e);
      toast.error(e?.response?.data?.message || e?.message || "Delete failed");
      setDeleting(null);
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">{t("releases.title")}</h1>
          <p className="text-sm text-zinc-400 mt-1">{t("releases.subtitle")}</p>
        </div>
        <button
          onClick={() => {
            setEditing(null); 
            setCreateOpen(true);
          }}
          disabled={saving}
          className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-white transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {saving ? "Creating..." : t("releases.create_btn")}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("releases.search_placeholder")}
          className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
        />
        <div className="text-sm text-zinc-500 font-medium">
          {filtered.length} {t("releases.items_count")}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/50 shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm text-zinc-500">{t("releases.loading")}</div>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-500">
                <th className="px-5 py-4 font-medium">{t("releases.table.cover")}</th>
                <th className="px-5 py-4 font-medium">{t("releases.table.title")}</th>
                <th className="px-5 py-4 font-medium">{t("releases.table.type")}</th>
                <th className="px-5 py-4 font-medium">{t("releases.table.date")}</th>
                <th className="px-5 py-4 font-medium">{t("releases.table.songs")}</th>
                <th className="px-5 py-4 text-right font-medium">{t("releases.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filtered.map((r) => {
                return (
                  <tr key={r.id} className="group hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-sm">
                        {r.coverUrl && <img src={r.coverUrl} className="h-full w-full object-cover" alt="" />}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-zinc-200">{r.albumName}</td>
                    <td className="px-5 py-4 text-xs text-zinc-400 font-medium">
                      {t(`releases.types.${r.isSingle ? "single" : "album"}`)}
                    </td>
                    <td className="px-5 py-4 text-zinc-400">
                      {new Date(r.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-zinc-400">
                      {r.songsCount}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditing(r)}
                          disabled={saving || !!deleting}
                          className="text-xs font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                          {t("releases.actions.edit")}
                        </button>
                        <button
                          onClick={() => setDeleting(r)}
                          disabled={saving || !!deleting}
                          className="text-xs font-medium text-rose-500/80 hover:text-rose-400 transition-colors disabled:opacity-50"
                        >
                          {t("releases.actions.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {(createOpen || editing) && (
        <ReleaseModal
          open={true}
          initial={editing}
          mode={editing ? "edit" : "create"}
          onClose={() => {
            setEditing(null);
            setCreateOpen(false);
          }}
          onSubmit={handleSave}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title={t("releases.delete_dialog.title")}
        description={t("releases.delete_dialog.description", { title: deleting?.albumName })}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deletingLoading}
      />
    </div>
  );
}

function ReleaseModal({ open, onClose, onSubmit, initial, mode }: any) {
  const { t } = useTranslation();

  const [albumName, setAlbumName] = useState("");
  const [isSingle, setIsSingle] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setAlbumName(initial.albumName || "");
      setIsSingle(initial.isSingle || false);
      setCoverPreview(initial.coverUrl || "");
      setCoverFile(null);
    } else {
      setAlbumName("");
      setIsSingle(false);
      setCoverFile(null);
      setCoverPreview("");
    }
  }, [initial, mode]);

  const handleSave = () => {
    setUploading(true)
    onSubmit({
      albumName: albumName.trim(),
      releaseDate: new Date().toISOString().split('T')[0], // Current UTC date in YYYY-MM-DD format
      isSingle,
      coverFile,
    }).finally(() => setUploading(false))
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? t("releases.modal.title_create") : t("releases.modal.title_edit")}
      onClose={onClose}
    >
      <div className="space-y-6 pt-4">

        <div className="flex justify-center">
          <div className="group relative h-32 w-32 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
            {(coverPreview || coverFile) ? (
              <img src={coverFile ? URL.createObjectURL(coverFile) : coverPreview} className="h-full w-full object-cover" alt="" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-600 font-medium text-center px-4">
                {t("releases.modal.no_image")}
              </div>
            )}
            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold text-white">
                {t("releases.modal.upload")}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCoverFile(file);
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2 ml-1">
              {t("releases.modal.label_title")}
            </label>
            <input
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder={t("releases.modal.placeholder_title")}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2 ml-1">
              {t("releases.modal.label_type")}
            </label>
            <select
              value={isSingle ? "single" : "album"}
              onChange={(e) => setIsSingle(e.target.value === "single")}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none cursor-pointer focus:border-zinc-500 transition-colors appearance-none"
            >
              <option value="album">{t("releases.types.album")}</option>
              <option value="single">{t("releases.types.single")}</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {t("releases.modal.cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={!albumName.trim() || uploading}
            className="rounded-xl bg-zinc-100 px-8 py-2.5 text-sm font-bold text-zinc-950 disabled:opacity-20 active:scale-95 transition-all shadow-md"
          >
            {uploading ? "Uploading..." : t("releases.modal.save")}
          </button>
        </div>
      </div>
    </Modal>
  );
}