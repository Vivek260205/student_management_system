import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, CheckCircle2, UserCheck } from 'lucide-react'
import api from '../lib/api'
import useToast from '../hooks/useToast'

export default function FaceAttendance() {
  const toast = useToast()
  const [students, setStudents] = useState([])
  const [present, setPresent] = useState([])
  const [inProgress, setInProgress] = useState(false)

  useEffect(() => {
    api.get('/api/students').then(res => setStudents(res.data)).catch(console.error)
  }, [])

  const startCamera = () => {
    if (students.length === 0) {
      toast.notify('No students available to mark', 'error')
      return
    }

    setInProgress(true)
    toast.notify('Simulating face recognition session...', 'info')

    setTimeout(() => {
      const chosen = students.filter(() => Math.random() > 0.18).map((s) => s.id)
      setPresent(chosen)
      toast.notify(`Marked ${chosen.length} students present using camera simulation`, 'success')
      setInProgress(false)
    }, 1000)
  }

  const markPresent = async () => {
    if (students.length === 0) return
    const entries = students.map((student) => ({ studentId: student.id, present: present.includes(student.id) }))
    await api.post('/api/attendance', { date: new Date().toISOString().split('T')[0], entries })
    toast.notify('Face-attendance session saved.', 'success')
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Face Attendance</h1>
        <button
          onClick={startCamera}
          disabled={inProgress}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          <Camera className="inline w-5 h-5 mr-2" />
          {inProgress ? 'Scanning...' : 'Start Camera'}
        </button>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Simulated face recognition marks random students present each time.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.map(student => (
            <div key={student.id} className={`p-4 rounded-xl border ${present.includes(student.id) ? 'border-green-400 bg-green-50/60' : 'border-gray-300 dark:border-gray-600'} flex justify-between items-center`}> 
              <p className="font-medium text-gray-700 dark:text-gray-100">{student.firstName} {student.lastName}</p>
              {present.includes(student.id) ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <UserCheck className="w-6 h-6 text-gray-400" />}
            </div>
          ))}
        </div>
        <div className="text-right mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={markPresent} disabled={inProgress}>Save Session</button>
        </div>
      </div>
    </motion.div>
  )
}
