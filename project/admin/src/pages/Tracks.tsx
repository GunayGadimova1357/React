import { useMemo, useState, useEffect } from 'react'
import { formatDuration } from '../lib/formatDuration'
import * as trackApi from '../services/trackApi'
import * as artistApi from '../services/artistApi'
import * as albumApi from '../services/albumApi'
import { GenreService, type Genre } from '../services/genreApi'
import { type Track } from '../services/trackApi'
import { type Artist } from '../services/artistApi'
import { type Album } from '../services/albumApi'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { Loader2, Music, Check } from 'lucide-react'

export function Tracks() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Track | null>(null)
  const [deleting, setDeleting] = useState<Track | null>(null)

  useEffect(() => {
    Promise.all([
      trackApi.getTracks(),
      artistApi.getArtists(),
      albumApi.getAlbums(),
      GenreService.getAll()
    ])
      .then(([t, art, alb, gen]) => {
        setTracks(t)
        setArtists(art)
        setAlbums(alb)
        setGenres(gen)
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tracks
    return tracks.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.artistName?.toLowerCase().includes(q)
    )
  }, [tracks, query])

  
  const handleUpload = async (title: string, genreIds: string[], artistId: string, audio: File, albumId?: string, cover?: File) => {
    try {
      const newTrack = await trackApi.uploadTrack(title, artistId, audio, albumId, cover, genreIds)
      
      const artist = artists.find(a => a.id === artistId);
      const selectedGenreNames = genres.filter(g => genreIds.includes(g.id)).map(g => g.name);

      const fullTrack: Track = {
        ...newTrack,
        artistName: artist?.name || 'Unknown',
        genres: selectedGenreNames,
        genreIds: genreIds 
      };

      setTracks((prev) => [fullTrack, ...prev])
      toast.success(`Track "${title}" uploaded`)
      setCreateOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed')
    }
  }

  const handleUpdate = async (id: string, title: string, genreIds: string[], artistId: string, audio?: File, albumId?: string, cover?: File) => {
    try {
      const updated = await trackApi.updateTrack(id, title, audio, albumId, cover, genreIds)
      
      const artist = artists.find(a => a.id === artistId);
      const selectedGenreNames = genres.filter(g => genreIds.includes(g.id)).map(g => g.name);

      const fullTrack: Track = {
        ...updated,
        artistName: artist?.name || 'Unknown',
        genres: selectedGenreNames,
        genreIds: genreIds
      };

      setTracks((prev) => prev.map((t) => (t.id === id ? fullTrack : t)))
      toast.success('Track updated')
      setEditing(null)
    } catch (error: any) {
      toast.error('Update failed')
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await trackApi.deleteTrack(deleting.id)
      setTracks((prev) => prev.filter((t) => t.id !== deleting.id))
      toast.success('Track removed')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tracks</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage your song library</p>
        </div>
        {/* <button onClick={() => setCreateOpen(true)} className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:brightness-110">
          + Upload track
        </button> */}
      </div>

      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks..."
          className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-900 min-h-[200px] relative">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-zinc-500" />
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-400">
                <th className="px-4 py-3 font-medium">Cover</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Genres</th>
                <th className="px-4 py-3 font-medium">Artist</th>
                <th className="px-4 py-3 font-medium text-center">Duration</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-zinc-800 border border-zinc-800">
                      {t.coverUrl ? (
                        <img src={t.coverUrl} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <Music className="m-auto h-full w-5 text-zinc-700" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {t.genres && t.genres.length > 0 ? (
                        <>
                          <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-950 font-bold rounded-md whitespace-nowrap shadow-sm">
                            {t.genres[0]}
                          </span>
                          {t.genres.length > 1 && (
                            <div title={t.genres.slice(1).join(', ')} className="flex items-center justify-center h-5 px-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full cursor-help hover:bg-blue-500/20">
                              <span className="text-[9px] text-blue-400 font-black">+{t.genres.length - 1}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{t.artistName || '—'}</td>
                  <td className="px-4 py-3 text-center text-zinc-400">{formatDuration(t.duration)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(t)} className="rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800">Edit</button>
                      <button onClick={() => setDeleting(t)} className="rounded-md px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {createOpen && (
        <Modal open={createOpen} title="Upload track" onClose={() => setCreateOpen(false)}>
          <TrackForm genres={genres} artists={artists} albums={albums} onClose={() => setCreateOpen(false)} onSubmit={handleUpload} />
        </Modal>
      )}

      {editing && (
        <Modal open={!!editing} title="Edit track" onClose={() => setEditing(null)}>
          <TrackForm
            genres={genres}
            artists={artists}
            albums={albums}
            initial={editing}
            onClose={() => setEditing(null)}
            onSubmit={(title, gIds, aId, audio, albId, cover) => handleUpdate(editing.id, title, gIds, aId, audio, albId, cover)}
          />
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete track"
        description={`Delete "${deleting?.title}"?`}
        confirmText="Delete"
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

function TrackForm({ initial, artists, albums, genres, onSubmit, onClose }: {
  initial?: Track;
  artists: Artist[];
  albums: Album[];
  genres: Genre[];
  onSubmit: (title: string, genreIds: string[], artistId: string, audio?: File, albumId?: string, cover?: File) => void;
  onClose: () => void
}) {
  const [title, setTitle] = useState(initial?.title || '')
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>(initial?.genreIds || [])
  const [artistId, setArtistId] = useState(initial?.artistId || '')
  const [albumId, setAlbumId] = useState(initial?.albumId || '')
  const [audioFile, setAudioFile] = useState<File | undefined>()
  const [coverFile, setCoverFile] = useState<File | undefined>()
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl || '')

  const filteredAlbums = useMemo(() =>
    albums.filter(a => a.artistId === artistId),
    [albums, artistId])

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      if (coverUrl?.startsWith('blob:')) URL.revokeObjectURL(coverUrl)
      setCoverUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = () => {
    if (!title.trim() || selectedGenreIds.length === 0 || !artistId) {
      toast.error('Please fill required fields');
      return;
    }
    onSubmit(title, selectedGenreIds, artistId, audioFile, albumId || undefined, coverFile);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="col-span-2">
          <label className="mb-1 block text-sm text-zinc-400">Track Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100" />
        </div>

        <div className="col-span-2">
          <label className="mb-2 block text-sm text-zinc-400">Genres</label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-zinc-800 bg-zinc-950/50 max-h-40 overflow-y-auto font-sans">
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

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Artist</label>
          <select value={artistId} onChange={(e) => { setArtistId(e.target.value); setAlbumId(''); }} className="admin-select w-full px-3 py-2 text-sm">
            <option value="">Select artist</option>
            {artists.map(art => <option key={art.id} value={art.id}>{art.name}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Album</label>
          <select value={albumId} onChange={(e) => setAlbumId(e.target.value)} className="admin-select w-full px-3 py-2 text-sm">
            <option value="">Single / No Album</option>
            {filteredAlbums.map(alb => <option key={alb.id} value={alb.id}>{alb.title}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4">
          <label className="mb-2 block text-xs font-medium text-zinc-400 uppercase tracking-wider">Audio File</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0])} className="w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-zinc-200" />
        </div>
        
        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-lg bg-zinc-800 border border-zinc-800 flex-shrink-0">
            {coverUrl ? <img src={coverUrl} className="h-full w-full object-cover" /> : <Music className="m-auto h-full w-6 text-zinc-700" />}
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-xs font-medium text-zinc-400 uppercase tracking-wider">Cover Art</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-zinc-200" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onClose} className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900">Cancel</button>
        <button 
          onClick={handleSave} 
          disabled={!title.trim() || selectedGenreIds.length === 0 || !artistId || (!audioFile && !initial?.id)} 
          className="rounded-lg bg-zinc-100 px-6 py-2 text-sm font-medium text-zinc-950 hover:brightness-110 disabled:opacity-50"
        >
          Save Track
        </button>
      </div>
    </div>
  )
}
