import { useMemo, useState, useEffect } from 'react'
import { type Artist } from '../data/artists'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { UserCircle, UserMinus, Loader2 } from 'lucide-react'
import * as artistApi from '../services/artistApi'

export function Artists() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Artist | null>(null)
  const [deleting, setDeleting] = useState<Artist | null>(null)

  useEffect(() => {
    loadArtists()
  }, [])

  const loadArtists = async () => {
    try {
      setIsLoading(true)
      const data = await artistApi.getArtists()
      setArtists(data)
    } catch (error) {
      toast.error('Failed to load artists')
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return artists
    return artists.filter((a) => a.name.toLowerCase().includes(q))
  }, [artists, query])

  const handleCreate = async (name: string, file?: File) => { 
    try {
      const newArtist = await artistApi.createArtist(name, file)
      setArtists((prev) => [newArtist, ...prev])
      toast.success(`${newArtist.name} added`)
      setCreateOpen(false)
    } catch (error) {
      toast.error('Error creating artist')
    }
  }

  const handleUpdate = async (id: string, name: string, file?: File) => { 
    try {
      const updated = await artistApi.updateArtist(id, name, file)
      setArtists((prev) => prev.map((a) => (a.id === id ? updated : a)))
      toast.success('Artist updated')
      setEditing(null)
    } catch (error) {
      toast.error('Error updating artist')
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await artistApi.deleteArtist(deleting.id)
      setArtists((prev) => prev.filter((a) => a.id !== deleting.id))
      toast.success(`Artist removed`, {
        icon: <UserMinus size={18} className="text-red-400" />
      })
    } catch (error) {
      toast.error('Error deleting artist')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Artists</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage artist profiles</p>
        </div>
        {/* <button onClick={() => setCreateOpen(true)} className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:brightness-110">
          + Create artist
        </button> */}
      </div>

      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artist..."
          className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100"
        />
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
                <th className="px-4 py-3 font-medium">Photo</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-zinc-900 hover:bg-zinc-900/40">
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-800">
                      {a.coverUrl ? (
                        <img src={a.coverUrl} className="h-full w-full object-cover" />
                      ) : (
                        <UserCircle className="h-full w-full text-zinc-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(a)} className="rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800">
                        Edit
                      </button>
                      <button onClick={() => setDeleting(a)} className="rounded-md px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {createOpen && (
        <ArtistModal 
            open={createOpen} 
            onClose={() => setCreateOpen(false)} 
            onSubmit={(name, email, password, file) => handleCreate(name, email, password, file)} // почта и пароль. все таки лучше убрать файлы
            title="Create artist" 
        />
      )}

      {editing && (
        <ArtistModal 
          open={!!editing} 
          onClose={() => setEditing(null)} 
          onSubmit={(name, email, password, file) => handleUpdate(editing.id, name, email, password, file)} // читаешь? email password
          initial={editing} 
          title="Edit artist" 
        />
      )}

      <ConfirmDialog 
        open={!!deleting} 
        title="Delete artist" 
        description={`Are you sure you want to delete ${deleting?.name}?`} 
        confirmText="Delete" 
        onClose={() => setDeleting(null)} 
        onConfirm={confirmDelete} 
      />
    </div>
  )
}

function ArtistModal({ open, onClose, onSubmit, initial, title }: { 
    open: boolean, 
    onClose: () => void, 
    onSubmit: (name: string, email: string, password?: string, file?: File) => void, // и вот тут email password
    initial?: Artist, 
    title: string 
}) {
  const [name, setName] = useState(initial?.name || '')
  const [previewUrl, setPreviewUrl] = useState(initial?.coverUrl || '')
  const [file, setFile] = useState<File | undefined>()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Artist Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100"
            placeholder="Enter name"
          />
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4">
          <div className="text-sm font-medium text-zinc-200">Profile Picture</div>
          <div className="mt-3 flex items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-zinc-800 border border-zinc-800">
              {previewUrl ? <img src={previewUrl} className="h-full w-full object-cover" /> : <UserCircle className="w-full h-full text-zinc-700" />}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-xs file:text-zinc-200 hover:file:bg-zinc-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900">Cancel</button>
          <button 
            onClick={() => onSubmit(name, file)} 
            disabled={!name.trim()} 
            className="rounded-lg bg-zinc-100 px-6 py-2 text-sm font-medium text-zinc-950 hover:brightness-110 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}