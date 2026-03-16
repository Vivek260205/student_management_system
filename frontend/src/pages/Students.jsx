import React, {useEffect, useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Edit, Trash2, Search, Users, Download } from 'lucide-react'
import api from '../lib/api'
import StudentModal from '../components/StudentModal'
import useDarkMode from '../hooks/useDarkMode'
import useToast from '../hooks/useToast'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'
import jsPDF from 'jspdf'

export default function Students(){
  const toast = useToast()
  const { isDarkMode } = useDarkMode()
  const [students, setStudents] = useState([])
  const [attendancePercentages, setAttendancePercentages] = useState({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(()=>{ fetchStudents() }, [])

  async function fetchAttendancePercentages(){
    try {
      const res = await api.get('/api/attendance/percentages')
      const map = res.data.reduce((acc, item) => {
        acc[item.studentId] = item.percentage
        return acc
      }, {})
      setAttendancePercentages(map)
    } catch (error) {
      console.error('Failed to fetch attendance percentages:', error)
    }
  }

  async function fetchStudents(){
    try {
      const res = await api.get('/api/students')
      setStudents(res.data)
      await fetchAttendancePercentages()
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createOrUpdate(payload){
    try {
      if (payload.id) {
        await api.put(`/api/students/${payload.id}`, payload)
        toast.notify('Student updated successfully', 'success')
      } else {
        await api.post('/api/students', payload)
        toast.notify('Student added successfully', 'success')
      }
      setModalOpen(false)
      setEditingStudent(null)
      fetchStudents()
    } catch (error) {
      console.error('Failed to save student:', error)
      toast.notify('Failed to save student', 'error')
    }
  }

  async function remove(id){
    if (!confirm('Are you sure you want to delete this student?')) return
    try {
      await api.delete(`/api/students/${id}`)
      toast.notify('Student deleted', 'info')
      fetchStudents()
    } catch (error) {
      console.error('Failed to delete student:', error)
      toast.notify('Failed to delete student', 'error')
    }
  }

  function exportStudentsCsv() {
    const records = students.map((s) => ({
      ID: s.id,
      Name: `${s.firstName} ${s.lastName || ''}`.trim(),
      Email: s.email,
      Course: s.course || '',
      'Attendance %': attendancePercentages[s.id] !== undefined ? attendancePercentages[s.id].toFixed(1) : 'N/A'
    }))

    const csv = Papa.unparse(records)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `students-${new Date().toISOString().slice(0,10)}.csv`)
    toast.notify('Students exported to CSV', 'success')
  }

  function exportStudentsPDF() {
    const doc = new jsPDF()
    const today = new Date().toLocaleDateString()
    
    doc.setFontSize(20)
    doc.text('Students Report', 20, 30)
    doc.setFontSize(12)
    doc.text(`Generated: ${today}`, 20, 45)
    doc.text(`Total Students: ${students.length}`, 20, 55)
    
    let y = 70
    doc.setFontSize(14)
    doc.text('Student Details:', 20, y)
    y += 10
    
    doc.setFontSize(10)
    students.forEach(student => {
      const attendance = attendancePercentages[student.id] !== undefined ? `${attendancePercentages[student.id].toFixed(1)}%` : 'N/A'
      doc.text(`ID: ${student.id} | Name: ${student.firstName} ${student.lastName || ''} | Email: ${student.email || 'N/A'} | Course: ${student.course || 'N/A'} | Attendance: ${attendance}`, 20, y)
      y += 8
      if (y > 270) {
        doc.addPage()
        y = 30
      }
    })
    
    doc.save(`students-${today.replace(/\//g, '-')}.pdf`)
    toast.notify('Students report exported as PDF', 'success')
  }

  const openAddModal = () => {
    setEditingStudent(null)
    setModalOpen(true)
  }

  const openEditModal = (student) => {
    setEditingStudent(student)
    setModalOpen(true)
  }

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your student records</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Student
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportStudentsPDF}
            className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportStudentsCsv}
            className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-5 py-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-sm flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </motion.div>

      {/* Students Count */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredStudents.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendance %</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700/50">
              <AnimatePresence>
                {filteredStudents.map((s, index) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{s.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {s.firstName} {s.lastName || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{s.email || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{s.course || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {attendancePercentages[s.id] !== undefined ? `${attendancePercentages[s.id].toFixed(1)}%` : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditModal(s)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => remove(s.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm ? 'No students match your search' : 'No students found'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAddModal}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-200 shadow-lg"
            >
              {searchTerm ? 'Clear Search & Add Student' : 'Add Your First Student'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={editingStudent}
        onSave={createOrUpdate}
      />
    </motion.div>
  )
}
