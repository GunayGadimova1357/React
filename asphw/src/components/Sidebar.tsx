import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', exact: true },
  { to: '/login', label: 'Login' },
  { to: '/logout', label: 'Logout' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="eyebrow">ASP project</p>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ to, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            <span>{label}</span>
            <small>{to}</small>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
