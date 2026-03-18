import React, { Component } from 'react'

class Signup extends Component {
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
          <p className="form-tag">Create Account</p>
          <h2>Create Your Account</h2>
          <p className="form-description">
            Register with your email and create a secure password.
          </p>

          <form className="auth-form" onSubmit={this.handleSubmit}>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                placeholder="newuser@example.com"
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
                placeholder="Create a password"
                required
              />
            </label>

            <button className="submit-button" type="submit">
              Create account
            </button>
          </form>

          {submitted && (
            <p className="success-message">
              Account created for <strong>{email}</strong>
            </p>
          )}
        </div>
      </section>
    )
  }
}

export default Signup
