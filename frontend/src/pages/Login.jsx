import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import useAuth from '../auth/useAuth'
import useToast from '../hooks/useToast'

export default function Login(){
  const auth = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-white/20"
      >
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.h2
              className="text-4xl font-bold text-white mb-2"
              animate={{ backgroundPosition: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'linear-gradient(45deg, #ffffff, #e0e7ff, #ffffff)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Welcome Back
            </motion.h2>
            <p className="text-white/80">Sign in to your admin dashboard</p>
          </motion.div>

          <motion.form
            onSubmit={submit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-400/50 text-white px-4 py-3 rounded-xl backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <motion.input
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e=>setUsername(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <motion.input
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 text-white py-4 px-4 rounded-xl hover:from-white/30 hover:to-white/20 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="ml-2">Signing In...</span>
                </motion.div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </motion.form>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-white/60 text-sm">
              Default credentials: <span className="font-semibold text-white">admin / adminpass</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
