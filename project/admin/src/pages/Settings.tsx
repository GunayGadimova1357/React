import { useState } from 'react'
import { moderatorsData, type Moderator } from '../data/moderators'
import { Modal } from '../components/ui/Modal'
import { Users, UserPlus, Mail, Shield, Lock, Trash2, ShieldOff } from 'lucide-react'

import { toast } from 'react-hot-toast'

export function Settings() {
  const [mods, setMods] = useState<Moderator[]>(moderatorsData)
  const [open, setOpen] = useState(false)

  const addModerator = (email: string, role: 'admin' | 'moderator') => {
    setMods((prev) => [
      ...prev,
      { id: crypto.randomUUID(), email, role },
    ])

    toast.success(`Account for ${email} created`)
  }

const removeModerator = (id: string, email: string) => {
  const previousMods = [...mods] 
  setMods(mods.filter(m => m.id !== id))

  toast(
    (t) => (
      <span className="flex items-center gap-2">
        Access revoked for <b>{email}</b>
        <button
          onClick={() => {
            setMods(previousMods)
            toast.dismiss(t.id)
          }}
          className="ml-2 rounded border border-zinc-700 px-2 py-1 text-[10px] uppercase hover:bg-zinc-800"
        >
          Undo
        </button>
      </span>
    ),
    { icon: <ShieldOff size={18} className="text-red-400" /> }
  )
}
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-500">Manage your team and platform permissions</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/30 p-4">
          <h2 className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Users size={18} className="text-indigo-400" />
            Moderators Team
          </h2>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-zinc-200 active:scale-95"
          >
            <UserPlus size={14} />
            Add Moderator
          </button>
        </div>

        <div className="divide-y divide-zinc-900">
          {mods.map((m) => (
            <div
              key={m.id}
              className="group flex items-center justify-between px-6 py-4 transition hover:bg-zinc-900/40"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{m.email}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">{m.role}</p>
                </div>
              </div>
              
              <button 
                
                onClick={() => removeModerator(m.id, m.email)}
                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AddModeratorModal
        open={open}
        onClose={() => setOpen(false)}
        onAdd={addModerator}
      />
    </div>
  )
}

function AddModeratorModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (email: string, role: 'admin' | 'moderator') => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'moderator'>('moderator')

  const handleCreate = () => {
  
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    onAdd(email, role)
    setEmail('')
    setPassword('')
    onClose()
  }

  return (
    <Modal open={open} title="Create New Account" onClose={onClose}>
      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:border-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Initial Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:border-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Access Level</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'moderator')}
              className="admin-select w-full pl-10 pr-4 py-2.5 text-sm"
            >
              <option value="moderator">Moderator (Limited Access)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleCreate}
            className="w-full rounded-xl bg-zinc-100 py-3 text-sm font-bold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            Create Account
          </button>
        </div>
      </div>
    </Modal>
  )
}
