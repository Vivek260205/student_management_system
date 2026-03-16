import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'
import useToast from '../hooks/useToast'

export default function StudentLogin(){
  const auth = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try{
      await auth.login({ username, password })
      toast.notify('Welcome back! You are logged in.', 'success')
      nav('/')
    }catch(err){
      const message = err.response?.data?.error || 'Login failed'
      setError(message)
      toast.notify(message, 'error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl mb-4">Student Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input required className="w-full p-2 border mb-2" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input required className="w-full p-2 border mb-4" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-green-600 text-white p-2 rounded">Login as Student</button>
      </form>
    </div>
  )
}
