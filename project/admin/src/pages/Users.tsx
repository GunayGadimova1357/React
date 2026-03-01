import { useMemo, useState } from 'react'
import { usersData, type AppUser } from '../data/users'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

export function Users() {
  const [users, setUsers] = useState<AppUser[]>(usersData)
  const [query, setQuery] = useState('')
  const [deleting, setDeleting] = useState<AppUser | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.email.toLowerCase().includes(q))
  }, [users, query])

  const toggleBlock = (user: AppUser) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' }
          : u
      )
    )

    toast.success(
      user.status === 'active'
        ? 'User blocked'
        : 'User unblocked'
    )
  }

  const confirmDelete = () => {
    if (!deleting) return
    setUsers((prev) => prev.filter((u) => u.id !== deleting.id))
    toast.success('User deleted')
    setDeleting(null)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage platform users
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email..."
          className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100"
        />
        <div className="text-sm text-zinc-400">
          {filtered.length} users
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-900">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-900 text-zinc-400">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className="border-b border-zinc-900 hover:bg-zinc-900/40"
              >
                <td className="px-4 py-3 font-medium">
                  {u.email}
                </td>

                <td className="px-4 py-3">
                  {u.status === 'active' ? (
                    <span className="rounded-full bg-green-500/15 px-2 py-1 text-xs text-green-400">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs text-red-400">
                      Blocked
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-zinc-400">
                  {u.createdAt}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBlock(u)}
                      className="rounded-md px-2 py-1 text-xs hover:bg-zinc-800"
                    >
                      {u.status === 'active'
                        ? 'Block'
                        : 'Unblock'}
                    </button>
                    <button
                      onClick={() => setDeleting(u)}
                      className="rounded-md px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-zinc-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleting}
        title="Remove user"
        description={`Are you sure you want to revoke access for ${deleting?.email}?`}
        confirmText="Remove"
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}