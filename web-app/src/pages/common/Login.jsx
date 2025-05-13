import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/pages/loginPage.css'

export default function Login() {
  const { login }           = useAuth()
  const [form, setForm]     = useState({ email:'', password:'' })
  const [error, setError]   = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    const { email, password } = form
    if (!email || !password) {
      return setError('Please fill in all fields')
    }

    try {
      await login(email, password)
      // upon success, AuthContext.login() already navigated for us.
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Login failed')
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>

      <p>
        <small>
          Don’t have an account? <a href="/register">Register here</a>
        </small>
      </p>
    </div>
  )
}
