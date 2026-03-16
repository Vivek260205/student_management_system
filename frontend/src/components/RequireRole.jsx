import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'

export default function RequireRole({ roles = [], children }){
  const auth = useAuth()
  if (!auth?.isAuthenticated) return <Navigate to="/login" />
  const has = (auth.user?.roles || []).some(r => roles.includes(r))
  return has ? children : <Navigate to="/" />
}
