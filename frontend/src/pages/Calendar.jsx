import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../lib/api'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [details, setDetails] = useState(null)

  useEffect(() => {
    fetchCalendar()
  }, [])

  const fetchCalendar = async () => {
    const end = new Date().toISOString().split('T')[0]
    const start = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
    const res = await api.get(`/api/attendance/daily?start=${start}&end=${end}`)
    setEvents(res.data)
  }

  const onDateClick = (day) => {
    setSelectedDate(day.date)
    setDetails(day)
  }

  const days = (() => {
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const arr = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0]
      const record = events.find(e => e.date === dateString)
      arr.push({ date: dateString, present: record?.present ?? 0, absent: record?.absent ?? 0 })
    }
    return arr
  })()

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Calendar</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-4 bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-white/20 dark:border-gray-700/50">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {WEEKDAYS.map(day => <div key={day} className="text-xs font-semibold text-gray-500 dark:text-gray-300">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }, (_, i) => <div key={`blank-${i}`} className="h-20" />)}
            {days.map((day) => {
              const color = day.present > day.absent ? 'bg-emerald-400/70' : day.absent > day.present ? 'bg-red-400/70' : 'bg-yellow-400/70'
              return (
                <button key={day.date} onClick={() => onDateClick(day)} className={`h-20 rounded-lg p-2 text-xs ${color} text-white`}>{new Date(day.date).getDate()}</button>
              )
            })}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-white/20 dark:border-gray-700/50">
          <h2 className="font-semibold mb-2">Details</h2>
          {details ? (
            <div>
              <p><strong>Date:</strong> {details.date}</p>
              <p><strong>Present:</strong> {details.present}</p>
              <p><strong>Absent:</strong> {details.absent}</p>
            </div>
          ) : <p className="text-gray-500">Click a date to view details.</p>}
        </div>
      </div>
    </motion.div>
  )
}
