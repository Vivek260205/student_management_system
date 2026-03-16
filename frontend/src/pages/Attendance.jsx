import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, TrendingUp, Save, Calendar, User, Users, UserCheck, UserX, Download } from 'lucide-react'
import api from '../lib/api'
import useDarkMode from '../hooks/useDarkMode'
import useToast from '../hooks/useToast'
import jsPDF from 'jspdf'

export default function Attendance(){
  const { isDarkMode } = useDarkMode()
  const toast = useToast()
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const presentCount = Object.values(attendance).filter(Boolean).length
  const absentCount = Math.max(0, students.length - presentCount)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await api.get('/api/students')
      setStudents(res.data)
      // Initialize attendance as present for all
      const initialAttendance = {}
      res.data.forEach(student => {
        initialAttendance[student.id] = true
      })
      setAttendance(initialAttendance)
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  const saveAttendance = async () => {
    setSaving(true)
    try {
      const entries = Object.entries(attendance).map(([studentId, present]) => ({
        studentId: parseInt(studentId),
        present
      }))
      
      await api.post('/api/attendance', {
        date: new Date().toISOString().split('T')[0],
        entries
      })
      
      toast.notify('Attendance saved successfully', 'success')
    } catch (error) {
      console.error('Failed to save attendance:', error)
      toast.notify('Failed to save attendance', 'error')
    } finally {
      setSaving(false)
    }
  }

  const markAllPresent = () => {
    const newAttendance = {}
    students.forEach(student => {
      newAttendance[student.id] = true
    })
    setAttendance(newAttendance)
    toast.notify('All students marked as present', 'info')
  }

  const markAllAbsent = () => {
    const newAttendance = {}
    students.forEach(student => {
      newAttendance[student.id] = false
    })
    setAttendance(newAttendance)
    toast.notify('All students marked as absent', 'info')
  }

  const exportAttendancePDF = () => {
    const doc = new jsPDF()
    const today = new Date().toLocaleDateString()
    
    doc.setFontSize(20)
    doc.text('Attendance Report', 20, 30)
    doc.setFontSize(12)
    doc.text(`Date: ${today}`, 20, 45)
    doc.text(`Total Students: ${students.length}`, 20, 55)
    doc.text(`Present: ${presentCount}`, 20, 65)
    doc.text(`Absent: ${absentCount}`, 20, 75)
    
    let y = 90
    doc.setFontSize(14)
    doc.text('Student Attendance Details:', 20, y)
    y += 10
    
    doc.setFontSize(10)
    students.forEach(student => {
      const status = attendance[student.id] ? 'Present' : 'Absent'
      doc.text(`${student.firstName} ${student.lastName || ''}: ${status}`, 20, y)
      y += 8
      if (y > 270) {
        doc.addPage()
        y = 30
      }
    })
    
    doc.save(`attendance-${today.replace(/\//g, '-')}.pdf`)
    toast.notify('Attendance report exported as PDF', 'success')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Mark attendance for today</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={markAllPresent}
            className="bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <UserCheck className="w-5 h-5" />
            Mark All Present
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={markAllAbsent}
            className="bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <UserX className="w-5 h-5" />
            Mark All Absent
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportAttendancePDF}
            className="bg-purple-500 text-white px-4 py-3 rounded-xl hover:bg-purple-600 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveAttendance}
            disabled={saving}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
          >
            {saving ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Saving...' : 'Save Attendance'}
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-l-4 border-green-500 border border-white/20 dark:border-gray-700/50"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 dark:bg-green-400/20 rounded-xl mr-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Present</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{presentCount}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-l-4 border-red-500 border border-white/20 dark:border-gray-700/50"
        >
          <div className="flex items-center">
            <div className="p-3 bg-red-500/20 dark:bg-red-400/20 rounded-xl mr-4">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{absentCount}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-l-4 border-blue-500 border border-white/20 dark:border-gray-700/50"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/20 dark:bg-blue-400/20 rounded-xl mr-4">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Attendance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mark Attendance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click on student names to toggle attendance</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700/50">
              {students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <motion.div
                        className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {student.firstName[0]}{student.lastName?.[0] || ''}
                      </motion.div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName || ''}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{student.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        attendance[student.id]
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                      animate={{ scale: attendance[student.id] ? [1, 1.05, 1] : [1, 0.95, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      {attendance[student.id] ? 'Present' : 'Absent'}
                    </motion.span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleAttendance(student.id)}
                      className={`px-4 py-2 rounded-xl transition-all duration-200 shadow-lg ${
                        attendance[student.id]
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      Mark as {attendance[student.id] ? 'Absent' : 'Present'}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <User className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No students available</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Add students first to mark attendance</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
