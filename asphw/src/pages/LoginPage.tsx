export function LoginPage() {
  return (
    <section className="auth-layout">
      <div className="auth-card">
        <p className="eyebrow">Login</p>
        <h2>Sign in to your account</h2>
        <p className="section-copy">Simple login page with basic form fields.</p>

        <form className="auth-form">
          <label>
            <span>Email</span>
            <input type="email" placeholder="name@company.com" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" placeholder="Enter your password" />
          </label>
          <button type="submit" className="primary-button">
            Sign in
          </button>
        </form>
      </div>
    </section>
  )
}
