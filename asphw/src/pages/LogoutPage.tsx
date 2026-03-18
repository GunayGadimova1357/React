export function LogoutPage() {
  return (
    <section className="auth-layout">
      <div className="auth-card logout-card">
        <p className="eyebrow">Logout</p>
        <h2>End your session</h2>
        <p className="section-copy">
          This route can be connected to token cleanup or a logout endpoint.
        </p>
        <div className="logout-actions">
          <button type="button" className="primary-button">
            Logout now
          </button>
          <button type="button" className="ghost-button">
            Stay signed in
          </button>
        </div>
      </div>
    </section>
  )
}
