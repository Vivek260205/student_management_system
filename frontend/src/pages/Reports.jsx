import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import api from '../lib/api'
import useToast from '../hooks/useToast'

export default function Reports() {
  const [attendanceSummary, setAttendanceSummary] = useState([])
  const [students, setStudents] = useState([])
  const toast = useToast()

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    api.get(`/api/attendance?date=${today}`).then(res => setAttendanceSummary(res.data)).catch(console.error)
    api.get('/api/students').then(res => setStudents(res.data)).catch(console.error)
  }, [])

  const exportCSV = () => {
    const header = 'FirstName,LastName,Status,Course\n'
    const rows = attendanceSummary.map(record => `${record.firstName},${record.lastName},${record.present ? 'Present' : 'Absent'},${record.course}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `attendance-report-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.notify('CSV report exported.', 'success')
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Attendance Report', 14, 22)
    doc.setFontSize(12)
    const today = new Date().toLocaleDateString()
    doc.text(`Generated: ${today}`, 14, 32)

    const rows = attendanceSummary.map((record, idx) => {
      const name = `${record.firstName} ${record.lastName}`
      const status = record.present ? 'Present' : 'Absent'
      return `${idx + 1}. ${name} - ${status} - ${record.course}`
    })

    doc.setFontSize(10)
    let y = 44
    rows.forEach(line => {
      doc.text(line, 14, y)
      y += 6
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })
    doc.save('attendance-report.pdf')
    toast.notify('PDF report exported.', 'success')
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"><Download className="w-4 h-4"/> CSV</button>
          <button onClick={exportPDF} className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"><Download className="w-4 h-4"/> PDF</button>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50">
        <h2 className="text-lg font-semibold mb-4">Daily Attendance Report</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSummary.map(record => (
                <tr key={record.studentId} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="px-4 py-2">{record.firstName} {record.lastName}</td>
                  <td className="px-4 py-2">{record.course}</td>
                  <td className={`px-4 py-2 font-semibold ${record.present ? 'text-emerald-600' : 'text-red-600'}`}>{record.present ? 'Present' : 'Absent'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
