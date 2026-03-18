import React, { Component } from 'react'

class Signin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      submitted: false,
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
      submitted: false,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.setState({ submitted: true })
  }

  render() {
    const { email, password, submitted } = this.state

    return (
      <section className="form-page">
        <div className="form-card">
          <p className="form-tag">Welcome Back</p>
          <h2>Sign In</h2>
          <p className="form-description">
            Enter your email and password to access your workspace.
          </p>

          <form className="auth-form" onSubmit={this.handleSubmit}>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                placeholder="Enter your password"
                required
              />
            </label>

            <button className="submit-button" type="submit">
              Sign in
            </button>
          </form>

          {submitted && (
            <p className="success-message">
              Signed in as <strong>{email}</strong>
            </p>
          )}
        </div>
      </section>
    )
  }
}

export default Signin
