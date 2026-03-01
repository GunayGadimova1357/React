import { useMemo, useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { formatDuration } from "@/lib/formatDuration"
import { getAudioDuration } from "@/lib/audio"
import { Modal } from "@/components/ui/Modal"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { useTranslation } from "react-i18next"
import { getMyArtistSongs, uploadArtistSong, updateArtistSong, deleteArtistSong, type SongResponseDto } from "@/services/artistSongsApi"
import { getMyArtistAlbums, type AlbumResponseDto } from "@/services/artistAlbumsApi"
import { GenreService, type Genre } from "@/services/genreApi"
import { Check } from "lucide-react"

export function Tracks() {
  const { t } = useTranslation()
  const [tracks, setTracks] = useState<SongResponseDto[]>([])
  const [albums, setAlbums] = useState<AlbumResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState("")

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<SongResponseDto | null>(null)
  const [deleting, setDeleting] = useState<SongResponseDto | null>(null)
  const [deletingLoading, setDeletingLoading] = useState(false)

  useEffect(() => {
    Promise.all([getMyArtistSongs(), getMyArtistAlbums()])
      .then(([songs, alb]) => {
        setTracks(songs)
        setAlbums(alb)
      })
      .catch((e) => toast.error(e?.message || "Failed to load tracks"))
      .finally(() => setLoading(false))
  }, [])

  const enrichedTracks = useMemo(() => {
    return tracks.map(track => ({
      ...track,
      release: albums.find(a => a.id === track.albumId)
    }))
  }, [tracks, albums])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return enrichedTracks.filter((track) =>
      [track.title, track.release?.albumName, ...(track.genres || [])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
  }, [enrichedTracks, query])

  const handleSave = async (data: { title: string; albumId?: string | null; audioFile: File; coverFile?: File | null; genreIds: string[] }) => {
    setSaving(true)
    try {
      // Validation for single albums
      if (data.albumId) {
        const album = albums.find(a => a.id === data.albumId);
        if (album?.isSingle) {
          const existingTracks = tracks.filter(t => t.albumId === data.albumId);
          if (existingTracks.length > 0) {
            toast.error('Cannot add more than one track to a single album');
            setSaving(false);
            return;
          }
        }
      }

      if (editing) {
        const updated = await updateArtistSong(editing.id, data)
        setTracks((prev) => prev.map((t) => (t.id === editing.id ? updated : t)))
        toast.success(t("tracks.toast.updated"))
      } else {
        const created = await uploadArtistSong(data)
        setTracks((prev) => [created, ...prev])
        toast.success(t("tracks.toast.created", { title: created.title }))
      }
      setCreateOpen(false)
      setEditing(null)
    } catch (e: any) {
      console.error("Save error:", e)
      toast.error(e?.response?.data?.message || e?.message || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setDeletingLoading(true)
    try {
      await deleteArtistSong(deleting.id)
      setTracks((prev) => prev.filter((track) => track.id !== deleting.id))
      toast.success(t("tracks.toast.deleted"))
      setDeleting(null)
    } catch (e: any) {
      console.error("Delete error:", e)
      toast.error(e?.response?.data?.message || e?.message || "Delete failed")
      setDeleting(null)
    } finally {
      setDeletingLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">{t("tracks.title")}</h1>
          <p className="mt-1 text-sm text-zinc-400">{t("tracks.subtitle")}</p>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setCreateOpen(true)
          }}
          disabled={saving}
          className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-white active:scale-95 transition-all shadow-md disabled:opacity-50"
        >
          {saving ? "Uploading..." : t("tracks.upload_btn")}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("tracks.search_placeholder")}
          className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
        />
        <div className="text-sm text-zinc-500 font-medium">{filtered.length} {t("tracks.items_count")}</div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/50 shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm text-zinc-500">{t("tracks.loading")}</div>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-500">
                <th className="px-5 py-4 font-medium">{t("tracks.table.cover")}</th>
                <th className="px-5 py-4 font-medium">{t("tracks.table.title")}</th>
                <th className="px-5 py-4 font-medium">{t("tracks.table.release")}</th>
                <th className="px-5 py-4 font-medium">{t("tracks.table.genres")}</th>
                <th className="px-5 py-4 font-medium">{t("tracks.table.duration")}</th>
                <th className="px-5 py-4 text-right font-medium">{t("tracks.table.actions")}</th>
              </tr>
            <tbody className="divide-y divide-zinc-900">
              {filtered.map((track) => (
                <tr key={track.id} className="group hover:bg-zinc-900/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                      {track.coverUrl && (
                        <img src={track.coverUrl} className="h-full w-full object-cover" alt="" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-zinc-200">{track.title}</td>
                  <td className="px-5 py-4 text-zinc-400">
                    {track.albumName || <span className="text-zinc-600 italic">{t("tracks.no_release")}</span>}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    <div className="flex items-center gap-2">
                      {track.genres && track.genres.length > 0 ? (
                        <>
                          <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-950 font-bold rounded-md whitespace-nowrap shadow-sm">
                            {track.genres[0]}
                          </span>
                          {track.genres.length > 1 && (
                            <div title={track.genres.slice(1).join(', ')} className="flex items-center justify-center h-5 px-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full cursor-help hover:bg-blue-500/20">
                              <span className="text-[9px] text-blue-400 font-black">+{track.genres.length - 1}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 font-mono">
                    {formatDuration(track.duration)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setEditing(track)}
                        disabled={saving || !!deleting}
                        className="text-xs font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                      >
                        {t("tracks.actions.edit")}
                      </button>
                      <button
                        onClick={() => setDeleting(track)}
                        disabled={saving || !!deleting}
                        className="text-xs font-medium text-rose-500/80 hover:text-rose-400 transition-colors disabled:opacity-50"
                      >
                        {t("tracks.actions.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      <Modal open={createOpen || !!editing} title={editing ? t("tracks.modal.title_edit") : t("tracks.modal.title_upload")} onClose={() => { setCreateOpen(false); setEditing(null); }}>
        <TrackForm 
          mode={editing ? "edit" : "create"} 
          initial={editing} 
          tracks={tracks}
          albums={albums}
          onSubmit={handleSave} 
          onClose={() => { setCreateOpen(false); setEditing(null); }} 
        />
      </Modal>

      <ConfirmDialog 
        open={!!deleting} 
        title={t("tracks.delete_dialog.title")} 
        description={t("tracks.delete_dialog.description", { title: deleting?.title })} 
        onClose={() => setDeleting(null)} 
        onConfirm={confirmDelete}
        loading={deletingLoading}
      />
    </div>
  )
}

function TrackForm({ mode, initial, onSubmit, onClose, tracks, albums }: any) {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")
  const [albumId, setAlbumId] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState("")
  const [loadingDuration, setLoadingDuration] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverPreview, setCoverPreview] = useState("")
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([])

  useEffect(() => {
    GenreService.getAll().then(setGenres).catch(() => toast.error("Failed to load genres"))
  }, [])

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "")
      setAlbumId(initial.albumId || "")
      setDuration(initial.duration || 0)
      setAudioUrl(initial.fileUrl || "")
      setCoverPreview(initial.coverUrl || "")
      setAudioFile(null)
      setCoverFile(null)
      setSelectedGenreIds(initial.genreIds || [])
    } else {
      setTitle("")
      setAlbumId("")
      setDuration(0)
      setAudioUrl("")
      setCoverPreview("")
      setAudioFile(null)
      setCoverFile(null)
      setSelectedGenreIds([])
    }
  }, [initial])

  const handleAudioPick = (file: File) => {
    setAudioFile(file)
    setLoadingDuration(true)
    getAudioDuration(file).then(d => {
      setDuration(d)
      setAudioUrl(URL.createObjectURL(file))
      setLoadingDuration(false)
      toast.success(t("tracks.toast.audio_ready"))
    })
  }

  const toggleGenre = (id: string) => {
    setSelectedGenreIds(prev => {
      const isRemoving = prev.includes(id);
      if (isRemoving && prev.length === 1) {
        toast.error('At least one genre must be selected');
        return prev;
      }
      return isRemoving ? prev.filter(gid => gid !== id) : [...prev, id]
    })
  }

  const save = () => {
    // Audio file is required only for creation, not for editing
    if (mode === "create" && !audioFile) return
    if (!title.trim() || selectedGenreIds.length === 0 || !albumId) {
      toast.error('Please fill required fields');
      return;
    }
    setUploading(true)
    onSubmit({ 
      title: title.trim(), 
      albumId: albumId || null, 
      audioFile: audioFile || undefined,
      coverFile: coverFile || undefined,
      genreIds: selectedGenreIds
    }).finally(() => setUploading(false))
  }

  return (
    <div className="space-y-6 pt-4 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-center">
        <div className="group relative h-32 w-32 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
          {(coverPreview || coverFile) ? (
            <img src={coverFile ? URL.createObjectURL(coverFile) : coverPreview} className="h-full w-full object-cover" alt="" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-600 font-medium text-center px-4">
              {t("tracks.form.no_cover")}
            </div>
          )}
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-semibold text-white">
              {t("tracks.form.upload_cover")}
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

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-400 mb-2 ml-1">{t("tracks.form.label_release")}</label>
          <select
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500 appearance-none cursor-pointer transition-colors"
          >
            <option value="" disabled>{t("tracks.form.placeholder_release")}</option>
            {albums.map(a => (
              <option key={a.id} value={a.id}>
                {a.albumName} ({a.isSingle ? "single" : "album"})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-400 mb-2 ml-1">{t("tracks.form.label_title")}</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder={t("tracks.form.placeholder_title")}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-all" 
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-400 mb-2 ml-1">{t("tracks.form.label_genres")}</label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-zinc-800 bg-zinc-950/50 max-h-40 overflow-y-auto">
            {genres.map(g => {
              const active = selectedGenreIds.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGenre(g.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${active ? "bg-zinc-100 border-zinc-100 text-zinc-950" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"}`}
                >
                  {active && <Check size={12} />}
                  {g.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-zinc-900 border-dashed bg-zinc-900/20 p-6">
        <label className="block text-sm font-medium text-zinc-400 mb-4">{t("tracks.form.audio_file")}</label>
        <input
          type="file"
          accept="audio/*"
          onChange={e => e.target.files?.[0] && handleAudioPick(e.target.files[0])}
          className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer transition-all"
        />
        {audioUrl && (
          <div className="mt-6 flex items-center gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
             <audio className="h-8 flex-1" controls src={audioUrl} />
             <span className="text-xs font-mono font-medium text-zinc-500 pr-2">{formatDuration(duration)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">{t("tracks.form.cancel")}</button>
        <button
          onClick={save}
          disabled={!title.trim() || !albumId || selectedGenreIds.length === 0 || (mode === "create" && !audioFile) || loadingDuration || uploading}
          className="rounded-xl bg-zinc-100 px-10 py-2.5 text-sm font-bold text-zinc-950 disabled:opacity-20 hover:bg-white active:scale-95 transition-all shadow-md flex items-center gap-2"
        >
          {uploading && <div className="w-4 h-4 border border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin"></div>}
          {mode === "create" ? t("tracks.form.add_btn") : t("tracks.form.save_btn")}
        </button>
      </div>
    </div>
  )
}