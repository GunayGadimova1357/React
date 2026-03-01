import { useMemo, useState, useEffect } from 'react'
import { moderatorsData, type Moderator } from '../data/moderators'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { UserPlus, Mail, Shield, Lock } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function Team() {
  const [mods, setMods] = useState<Moderator[]>(moderatorsData)
  const [query, setQuery] = useState('')
  const [openAdd, setOpenAdd] = useState(false)
  
  const [deleting, setDeleting] = useState<Moderator | null>(null)
  const [editing, setEditing] = useState<Moderator | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mods
    return mods.filter((m) => m.email.toLowerCase().includes(q))
  }, [mods, query])

  const addModerator = (email: string, role: 'admin' | 'moderator') => {
    setMods((prev) => [...prev, { id: crypto.randomUUID(), email, role }])
    toast.success(`Account for ${email} created`)
  }

  const confirmDelete = () => {
    if (!deleting) return
    setMods(prev => prev.filter(m => m.id !== deleting.id))
    toast.success('Access revoked')
    setDeleting(null)
  }

  const updateRole = (id: string, newRole: 'admin' | 'moderator') => {
    setMods(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m))
    toast.success('Permissions updated')
    setEditing(null)
  }

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Team</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage team permissions</p>
        </div>
        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200 active:scale-95"
        >
          <UserPlus size={14} />
          Add Moderator
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search team by email..."
          className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-100"
        />
        <div className="text-sm text-zinc-400">
          {filtered.length} members
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-400">
              <th className="px-4 py-3 font-medium">Moderator</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filtered.map((m) => (
              <tr key={m.id} className="group border-b border-zinc-900 last:border-0 hover:bg-zinc-900/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-500">
                      <Mail size={14} />
                    </div>
                    <span className="font-medium text-zinc-100">{m.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    m.role === 'admin' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {m.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditing(m)} 
                      className="rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setDeleting(m)} 
                      className="rounded-md px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-zinc-400">
                  No team members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddModeratorModal 
        open={openAdd} 
        onClose={() => setOpenAdd(false)} 
        onAdd={addModerator} 
      />

      <EditRoleModal 
        moderator={editing} 
        onClose={() => setEditing(null)} 
        onSave={(role) => editing && updateRole(editing.id, role)} 
      />

      <ConfirmDialog 
        open={!!deleting} 
        title="Remove member" 
        description={`Are you sure you want to revoke access for ${deleting?.email}?`} 
        confirmText="Remove" 
        onClose={() => setDeleting(null)} 
        onConfirm={confirmDelete} 
      />
    </div>
  )
}

function EditRoleModal({ moderator, onClose, onSave }: { 
  moderator: Moderator | null, 
  onClose: () => void, 
  onSave: (role: 'admin' | 'moderator') => void 
}) {
  const [role, setRole] = useState<'admin' | 'moderator'>('moderator')

  useEffect(() => {
    if (moderator) setRole(moderator.role)
  }, [moderator])

  return (
    <Modal open={!!moderator} title="Edit Permissions" onClose={onClose}>
      <div className="space-y-5 py-2">
        <div className="space-y-1">
          <p className="text-sm text-zinc-100">{moderator?.email}</p>
          <p className="text-xs text-zinc-500">Select the new access level for this account.</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Access Level</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'moderator')}
              className="admin-select w-full pl-10 pr-4 py-2 text-sm"
            >
              <option value="moderator">Moderator (Limited Access)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onSave(role)}
            className="w-full rounded-lg bg-zinc-100 py-2.5 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Update Role
          </button>
        </div>
      </div>
    </Modal>
  )
}

function AddModeratorModal({ open, onClose, onAdd }: {
  open: boolean
  onClose: () => void
  onAdd: (email: string, role: 'admin' | 'moderator') => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'moderator'>('moderator')

  const handleCreate = () => {
    if (!email || !password) return toast.error('Fill in all fields')
    onAdd(email, role)
    setEmail(''); setPassword(''); onClose()
  }

  return (
    <Modal open={open} title="Create New Account" onClose={onClose}>
      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Initial Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Access Level</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'moderator')}
              className="admin-select w-full pl-10 pr-4 py-2 text-sm"
            >
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleCreate}
            className="w-full rounded-lg bg-zinc-100 py-2.5 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Create Account
          </button>
        </div>
      </div>
    </Modal>
  )
}
