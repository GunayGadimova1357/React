import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

class Navbar extends Component {
  render() {
    return (
      <header className="navbar">
        <NavLink className="brand" to="/signin">
          Auth
        </NavLink>
        
        <nav className="nav-links">
          <NavLink
            to="/signin"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Sign In
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Create Account
          </NavLink>
        </nav>
      </header>
    )
  }
}

export default Navbar
