import { useMemo, useState, useEffect } from 'react'
import { type Album } from '../services/albumApi'
import { type Artist } from '../services/artistApi'
import * as artistApi from '../services/artistApi'
import * as albumApi from '../services/albumApi'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { Loader2, Disc } from 'lucide-react'

export function Albums() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Album | null>(null)
  const [deleting, setDeleting] = useState<Album | null>(null)

  useEffect(() => {
    Promise.all([albumApi.getAlbums(), artistApi.getArtists()])
      .then(([albumsData, artistsData]) => {
        setAlbums(albumsData)
        setArtists(artistsData)
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return albums
    return albums.filter((a) => 
      a.title.toLowerCase().includes(q) || 
      a.artistName?.toLowerCase().includes(q)
    )
  }, [albums, query])

  const handleCreate = async (title: string, artistId: string, file?: File) => {
    try {
      await albumApi.createAlbum(title, artistId, file)
      toast.success(`Album created successfully`)
      const updatedAlbums = await albumApi.getAlbums()
      setAlbums(updatedAlbums)
      setCreateOpen(false)
    } catch (error) {
      toast.error('Failed to create album')
    }
  }

  const handleUpdate = async (id: string, title: string, artistId: string, file?: File) => {
    try {
      const updated = await albumApi.updateAlbum(id, title, artistId, file)
      setAlbums((prev) => prev.map((a) => (a.id === id ? updated : a)))
      toast.success('Album updated')
      setEditing(null)
    } catch (error) {
      toast.error('Failed to update album')
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await albumApi.deleteAlbum(deleting.id)
      setAlbums((prev) => prev.filter((a) => a.id !== deleting.id))
      toast.success(`Album removed`)
    } catch (error) {
      toast.error('Failed to delete album')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Albums</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage your album collection and artists</p>
        </div>
        {/* <button onClick={() => setCreateOpen(true)} className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:brightness-110">
          + Create album
        </button> */}
      </div>

      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by album or artist..."
          className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100"
        />
        <div className="text-sm text-zinc-400">{filtered.length} items</div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-900 min-h-[200px] relative">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-zinc-500" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-400">
                <th className="px-4 py-3 font-medium">Cover</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Artist</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-zinc-900 hover:bg-zinc-900/40">
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-zinc-800 border border-zinc-800">
                      {a.coverUrl ? (
                        <img src={a.coverUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Disc className="m-auto h-full w-5 text-zinc-700" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3 text-zinc-400">{a.artistName || 'Unknown Artist'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(a)} className="rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800">Edit</button>
                      <button onClick={() => setDeleting(a)} className="rounded-md px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {createOpen && (
        <Modal open={createOpen} title="Create new album" onClose={() => setCreateOpen(false)}>
          <AlbumForm artists={artists} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} />
        </Modal>
      )}

      {editing && (
        <Modal open={!!editing} title="Edit album" onClose={() => setEditing(null)}>
          <AlbumForm 
            artists={artists} 
            initial={editing} 
            onClose={() => setEditing(null)} 
            onSubmit={(title, artistId, file) => handleUpdate(editing.id, title, artistId, file)} 
          />
        </Modal>
      )}

      <ConfirmDialog open={!!deleting} title="Delete album" description={`Delete ${deleting?.title}?`} confirmText="Delete" onClose={() => setDeleting(null)} onConfirm={confirmDelete} />
    </div>
  )
}

function AlbumForm({ 
  initial, 
  artists, 
  onSubmit, 
  onClose 
}: { 
  initial?: Album; 
  artists: Artist[]; 
  onSubmit: (title: string, artistId: string, file?: File) => void; 
  onClose: () => void 
}) {
  const [title, setTitle] = useState(initial?.title || '')
  const [artistId, setArtistId] = useState(initial?.artistId || '')
  const [coverUrl, setCoverUrl] = useState<string | undefined>(initial?.coverUrl)
  const [coverFile, setCoverFile] = useState<File | undefined>()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      if (coverUrl?.startsWith('blob:')) URL.revokeObjectURL(coverUrl)
      setCoverUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Album Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100" 
            placeholder="Enter album name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Artist</label>
          <select 
            value={artistId} 
            onChange={(e) => setArtistId(e.target.value)}
            className="admin-select w-full px-3 py-2 text-sm"
          >
            <option value="">Select artist</option>
            {artists.map(art => (
              <option key={art.id} value={art.id}>{art.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4">
        <div className="mt-3 flex items-center gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-xl bg-zinc-800 border border-zinc-800">
            {coverUrl ? (
              <img src={coverUrl} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600 text-xs">No Image</div>
            )}
          </div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFile} 
            className="flex-1 text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-zinc-200" 
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onClose} className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900">
          Cancel
        </button>
        <button 
          onClick={() => onSubmit(title, artistId, coverFile)} 
          disabled={!title.trim() || !artistId}
          className="rounded-lg bg-zinc-100 px-6 py-2 text-sm font-medium text-zinc-950 hover:brightness-110 disabled:opacity-50"
        >
          Save Album
        </button>
      </div>
    </div>
  )
}
