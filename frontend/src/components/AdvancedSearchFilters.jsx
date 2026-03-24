import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import useDarkMode from '../hooks/useDarkMode'

const AdvancedSearchFilters = ({ data = [], onFiltered, loading = false }) => {
  const { isDarkMode } = useDarkMode()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [attendanceRange, setAttendanceRange] = useState([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const [courses, setCourses] = useState(['all'])

  useEffect(() => {
    const uniqueCourses = ['all', ...new Set(data.map(item => item.course || item.courseName).filter(Boolean))]
    setCourses(uniqueCourses)
  }, [data])

  useEffect(() => {
    const filtered = data.filter(item => {
      const name = `${item.firstName || ''} ${item.lastName || ''} ${item.name || ''}`.toLowerCase()
      const course = item.course || item.courseName || ''
      const attendance = item.attendance || item.percentage || 0

      const matchesSearch = name.includes(searchTerm.toLowerCase())
      const matchesCourse = selectedCourse === 'all' || course === selectedCourse
      const matchesAttendance = attendance >= attendanceRange[0] && attendance <= attendanceRange[1]

      return matchesSearch && matchesCourse && matchesAttendance
    })

    onFiltered(filtered)
  }, [searchTerm, selectedCourse, attendanceRange, data, onFiltered])

  const hasActiveFilters = searchTerm !== '' || selectedCourse !== 'all' || attendanceRange[0] !== 0 || attendanceRange[1] !== 100

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? 'bg-gray-800 text-white border border-gray-700 placeholder-gray-500'
              : 'bg-white text-gray-900 border border-gray-300 placeholder-gray-500'
          }`}
          disabled={loading}
        />
      </motion.div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            showFilters
              ? isDarkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700'
              : isDarkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              isDarkMode ? 'bg-red-500/30 text-red-300' : 'bg-red-100 text-red-700'
            }`}>
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCourse('all')
              setAttendanceRange([0, 100])
            }}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-lg p-4 space-y-4 border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Course Filter */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              >
                {courses.map(course => (
                  <option key={course} value={course}>
                    {course === 'all' ? 'All Courses' : course}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Range Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Attendance Range
                </label>
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {attendanceRange[0]}% - {attendanceRange[1]}%
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={attendanceRange[0]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val <= attendanceRange[1]) {
                      setAttendanceRange([val, attendanceRange[1]])
                    }
                  }}
                  className="w-full h-2 bg-gradient-to-r from-red-400 to-green-400 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={attendanceRange[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val >= attendanceRange[0]) {
                      setAttendanceRange([attendanceRange[0], val])
                    }
                  }}
                  className="w-full h-2 bg-gradient-to-r from-red-400 to-green-400 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-2 mt-3 text-xs">
                {[
                  { label: 'Excellent', range: [85, 100] },
                  { label: 'Good', range: [70, 84] },
                  { label: 'Average', range: [55, 69] },
                  { label: 'Poor', range: [0, 54] }
                ].map(level => (
                  <button
                    key={level.label}
                    onClick={() => setAttendanceRange(level.range)}
                    className={`px-2 py-1 rounded font-medium transition-all ${
                      attendanceRange[0] === level.range[0] && attendanceRange[1] === level.range[1]
                        ? isDarkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdvancedSearchFilters
