import React, { createContext, useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react'

export const ToastContext = createContext(null)

const TOAST_DURATION = 4000

const icons = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, TOAST_DURATION)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(() => ({ notify, removeToast }), [notify, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.type] || Info
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-80 max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{toast.message}</p>
                  </div>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="p-1 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
