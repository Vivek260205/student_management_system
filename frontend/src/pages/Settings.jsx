import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useToast from '../hooks/useToast'

export default function Settings() {
  const [attendanceRule, setAttendanceRule] = useState('60')
  const [theme, setTheme] = useState('auto')
  const [notifications, setNotifications] = useState(true)
  const toast = useToast()

  const save = () => {
    toast.notify('Settings saved', 'success')
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
        <h2 className="text-xl font-semibold mb-4">Attendance Rules</h2>
        <label className="block text-sm mb-2">Low attendance threshold (%)</label>
        <input value={attendanceRule} onChange={e => setAttendanceRule(e.target.value)} type="number" min="0" max="100" className="w-32 p-2 border rounded-lg" />
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
        <h2 className="text-xl font-semibold mb-4">System Theme</h2>
        <select value={theme} onChange={e => setTheme(e.target.value)} className="p-2 border rounded-lg">
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="form-checkbox" />
          Enable email alerts
        </label>
      </div>

      <button onClick={save} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg shadow-lg">Save Settings</button>
      <button onClick={async () => {
        const res = await fetch('/api/backup')
        const json = await res.json()
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
      }} className="ml-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-2 rounded-lg shadow-lg">Export Backup</button>
    </motion.div>
  )
}
