import { createContext, useContext, useEffect, useState } from 'react'

import { apiRequest } from '../services/api'

const AuthContext = createContext(null)

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  const loadCurrentUser = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      return
    }

    try {
      const currentUser = await apiRequest('/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      localStorage.setItem('user', JSON.stringify(currentUser))
      setUser(currentUser)
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const login = async (token) => {
    localStorage.setItem('token', token)

    await loadCurrentUser()
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}