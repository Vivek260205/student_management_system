import React from 'react'
import { motion } from 'framer-motion'
import useDarkMode from '../hooks/useDarkMode'

// Glassmorphic Card Component
export const GlassCard = ({ children, className = '', delay = 0 }) => {
  const { isDarkMode } = useDarkMode()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`
        backdrop-blur-xl rounded-2xl shadow-2xl border
        ${isDarkMode
          ? 'bg-gray-800/40 border-gray-700/50 shadow-black/30'
          : 'bg-white/40 border-white/60 shadow-gray-900/10'
        }
        hover:shadow-2xl transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

// Animated Button Component
export const AnimatedButton = ({ children, onClick, variant = 'primary', icon: Icon, className = '', loading = false, disabled = false }) => {
  const { isDarkMode } = useDarkMode()

  const variants = {
    primary: `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white`,
    success: `bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white`,
    warning: `bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white`,
    danger: `bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white`,
    secondary: `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-gray-900`,
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 rounded-lg
        font-semibold transition-all duration-300 shadow-lg hover:shadow-xl
        ${variants[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {Icon && !loading && <Icon className="w-5 h-5" />}
      {loading && <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />}
      {children}
    </motion.button>
  )
}

// Premium Stat Card Component
export const PremiumStatCard = ({ title, value, icon: Icon, trend, color = 'blue', delay = 0 }) => {
  const { isDarkMode } = useDarkMode()

  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    emerald: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-yellow-500',
    red: 'from-red-500 to-rose-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`
        relative overflow-hidden rounded-2xl p-6 shadow-lg
        backdrop-blur-sm border
        ${isDarkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-white/60'
        }
        hover:shadow-2xl transition-all duration-300
        group
      `}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </h3>
          {trend && (
            <motion.p
              className="text-xs font-semibold mt-2 text-emerald-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 }}
            >
              {trend}
            </motion.p>
          )}
        </div>

        <motion.div
          className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Hover Border Animation */}
      <motion.div
        className={`absolute inset-0 rounded-2xl border-2 ${colorClasses[color].split('to-')[1].replace('500', '400')} pointer-events-none`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  )
}

// Cool Badge Component
export const PremiumBadge = ({ label, variant = 'success', icon: Icon }) => {
  const variants = {
    success: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    warning: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    error: 'bg-red-500/20 text-red-500 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium backdrop-blur-sm ${variants[variant]}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </motion.div>
  )
}

// Animated Loading Skeleton
export const PremiumSkeleton = ({ count = 1, height = 'h-12' }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`${height} bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg`}
          animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

export default {
  GlassCard,
  AnimatedButton,
  PremiumStatCard,
  PremiumBadge,
  PremiumSkeleton
}
