import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  User
} from 'lucide-react'
import useAuth from '../auth/useAuth'
import useDarkMode from '../hooks/useDarkMode'
import { navItems } from '../utils/constants'

const iconMap = {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  User
}

export default function AdminLayout({ children }) {
  const auth = useAuth()
  const { isDarkMode, toggle } = useDarkMode()
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearch = async (value) => {
    setSearchQuery(value)
    if (!value.trim()) {
      setSearchResults([])
      setSearchOpen(false)
      return
    }
    try {
      const res = await fetch(`/api/students?search=${encodeURIComponent(value)}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      setSearchResults(data)
      setSearchOpen(true)
    } catch (error) {
      console.error('Search failed', error)
    }
  }

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 }
  }

  const contentVariants = {
    expanded: { marginLeft: 256 },
    collapsed: { marginLeft: 80 }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent
                auth={auth}
                location={location}
                navItems={navItems}
                collapsed={false}
                onLogout={auth.logout}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        className="fixed left-0 top-0 h-full bg-gray-900 text-white shadow-2xl hidden lg:block z-40"
        variants={sidebarVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <SidebarContent
          auth={auth}
          location={location}
          navItems={navItems}
          collapsed={sidebarCollapsed}
          onLogout={auth.logout}
          isDarkMode={isDarkMode}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 min-h-screen"
        variants={contentVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Top Navbar */}
        <motion.header
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          className={`bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 flex justify-between items-center sticky top-0 z-30 backdrop-blur-sm bg-opacity-95`}
        >
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden mr-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <motion.h2
              className={`text-xl font-semibold text-gray-900 dark:text-white ml-4 transition-opacity duration-300 ${
                sidebarCollapsed ? 'lg:opacity-0 lg:pointer-events-none' : 'lg:opacity-100'
              }`}
              animate={{ scale: sidebarCollapsed ? 0.9 : 1 }}
            >
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </motion.h2>
          </div>

          <div className="flex items-center space-x-3">
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search students..."
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm w-64"
            />
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggle}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <div className="flex items-center space-x-3">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {auth.user?.username?.[0]?.toUpperCase()}
              </motion.div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{auth.user?.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{auth.user?.roles?.join(', ')}</p>
              </div>
            </div>

            <motion.button
              onClick={auth.logout}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.header>

        {searchOpen && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-11/12 md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Search Results</h4>
            {searchResults.length === 0 ? (
              <p className="text-sm text-gray-500">No matches found.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((student) => (
                  <li key={student.id} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setSearchOpen(false); }}>
                    <div className="flex justify-between"><span>{student.firstName} {student.lastName}</span><span className="text-xs text-gray-500">{student.course}</span></div>
                    <div className="text-xs text-gray-500">{student.email}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="p-4 lg:p-6"
        >
          {children}
        </motion.main>
      </motion.div>
    </div>
  )
}

function SidebarContent({ auth, location, navItems, collapsed, onLogout, isDarkMode }) {
  return (
    <>
      <div className="p-6 border-b border-gray-700">
        <motion.h1
          className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ${
            collapsed ? 'lg:text-center' : ''
          }`}
          animate={{ scale: collapsed ? 0.8 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {collapsed ? 'SMS' : 'SMS Admin'}
        </motion.h1>
      </div>

      <nav className="flex-1 px-4 py-6">
        {navItems.map((item, index) => {
          const IconComponent = iconMap[item.icon]
          const isActive = location.pathname === item.path

          return (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md'
                } ${collapsed ? 'lg:justify-center' : ''}`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <IconComponent className={`w-5 h-5 ${collapsed ? 'lg:mr-0' : 'mr-3'}`} />
                </motion.div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className={`flex items-center ${collapsed ? 'lg:justify-center' : ''}`}>
          <motion.div
            className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {auth.user?.username?.[0]?.toUpperCase()}
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="ml-3 hidden lg:block"
              >
                <p className="text-sm font-medium">{auth.user?.username}</p>
                <p className="text-xs text-gray-400">{auth.user?.roles?.join(', ')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}