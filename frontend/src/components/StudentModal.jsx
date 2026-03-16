import React, {useState, useEffect} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Edit } from 'lucide-react'
import useDarkMode from '../hooks/useDarkMode'

export default function StudentModal({ isOpen, onClose, student = {}, onSave }){
  const { isDarkMode } = useDarkMode()
  const [state, setState] = useState({
    id: student.id || '',
    firstName: student.firstName || '',
    lastName: student.lastName || '',
    email: student.email || '',
    course: student.course || '',
    dob: student.dob || ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setState({
      id: student.id || '',
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      email: student.email || '',
      course: student.course || '',
      dob: student.dob || ''
    })
  }, [student])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(state)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-white/20 dark:border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg">
                    {student.id ? (
                      <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {student.id ? 'Edit Student' : 'Add New Student'}
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <form onSubmit={submit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    required
                    value={state.firstName}
                    onChange={e=>setState({...state, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
                    placeholder="Enter first name"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    value={state.lastName}
                    onChange={e=>setState({...state, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
                    placeholder="Enter last name"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={state.email}
                  onChange={e=>setState({...state, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
                  placeholder="Enter email address"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.225, duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course
                </label>
                <input
                  value={state.course}
                  onChange={e => setState({ ...state, course: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
                  placeholder="Enter course name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={state.dob}
                  onChange={e=>setState({...state, dob: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white backdrop-blur-sm"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex justify-end space-x-3 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600/50 rounded-xl hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all duration-200"
                  disabled={loading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Saving...
                    </motion.div>
                  ) : (
                    student.id ? 'Update Student' : 'Add Student'
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}