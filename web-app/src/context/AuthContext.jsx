// web-app/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate              = useNavigate()

  // Set API-GW baseURL globally
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || ''

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // fetch /api/auth/me
      axios.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    // data = { token, userId, name, role, email }
    const { token, userId, name, role, email: userEmail } = data

    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const u = { userId, name, role, email: userEmail }
    setUser(u)

    // route by role
    const roleRouteMap = {
      admin:      '/admin/users',
      restaurant: '/restaurant',
      delivery:   '/delivery/home',
      customer:   '/customer/home'
    }
    navigate(roleRouteMap[role] || '/')
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
