import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <section className="hero-panel">
            <p className="eyebrow">Secure Access</p>
            <h1>Bring every account touchpoint into one calm, confident flow.</h1>
          </section>

          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    )
  }
}

export default App
