import { useAuth } from '../features/auth'


export function Header() {
  const { logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-zinc-900 px-6 py-4">
      <div className="text-sm text-zinc-400">Admin Panel</div>

      <div className="flex items-center gap-3">

        <button
          onClick={logout}
          className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-900 hover:bg-white"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

