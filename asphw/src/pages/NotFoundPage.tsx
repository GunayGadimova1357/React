import { NavLink } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="not-found-card">
        <p className="eyebrow">404</p>
        <h2>Page not found</h2>
        <p className="section-copy">
          The page you opened does not exist. Use the sidebar to return to one
          of the main routes.
        </p>
        <NavLink to="/" className="primary-link">
          Go to home
        </NavLink>
      </div>
    </section>
  )
}
