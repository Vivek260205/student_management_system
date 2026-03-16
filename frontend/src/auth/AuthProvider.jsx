import React, {createContext, useEffect, useState} from 'react'
import api from '../lib/api'

export const AuthContext = createContext(null)

function parseJwt(token){
  try{
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  }catch(e){ return null }
}

export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    if (!token) return null
    const claims = parseJwt(token)
    return { username: claims?.sub, roles: claims?.roles ? claims.roles.split(',') : [] }
  })

  useEffect(()=>{
    if (token) {
      localStorage.setItem('token', token)
      const claims = parseJwt(token)
      setUser({ username: claims?.sub, roles: claims?.roles ? claims.roles.split(',') : [] })
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const login = async ({ username, password }) => {
    const res = await api.post('/api/auth/login', { username, password })
    setToken(res.data.token)
    return res
  }

  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
