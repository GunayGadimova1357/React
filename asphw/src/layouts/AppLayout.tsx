import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { useTheme } from '../context/useTheme'

export function AppLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="content-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Layout</p>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            <strong>{theme === 'dark' ? 'Switch to light' : 'Switch to dark'}</strong>
          </button>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
