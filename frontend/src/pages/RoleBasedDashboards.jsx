import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, BookOpen, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useDarkMode from '../hooks/useDarkMode'

// Placeholder data for teachers
const teacherChartData = [
  { day: 'Mon', submissions: 45, pending: 5 },
  { day: 'Tue', submissions: 50, pending: 3 },
  { day: 'Wed', submissions: 42, pending: 8 },
  { day: 'Thu', submissions: 55, pending: 2 },
  { day: 'Fri', submissions: 48, pending: 4 },
]

// Placeholder data for students
const studentChartData = [
  { week: 'Week 1', score: 85 },
  { week: 'Week 2', score: 88 },
  { week: 'Week 3', score: 82 },
  { week: 'Week 4', score: 90 },
]

const TeacherDashboard = () => {
  const { isDarkMode } = useDarkMode()

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Teacher Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Classes" value="12" icon={Users} color="bg-blue-500" />
        <StatCard title="Pending Assignments" value="8" icon={BookOpen} color="bg-orange-500" />
        <StatCard title="Submissions Today" value="34" icon={CheckCircle} color="bg-emerald-500" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Assignment Submissions
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teacherChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <Tooltip />
            <Bar dataKey="submissions" fill="#10B981" />
            <Bar dataKey="pending" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

const StudentDashboard = () => {
  const { isDarkMode } = useDarkMode()

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="My Attendance" value="92%" icon={CheckCircle} color="bg-emerald-500" />
        <StatCard title="Pending Tasks" value="5" icon={Clock} color="bg-orange-500" />
        <StatCard title="Average Score" value="8.5/10" icon={TrendingUp} color="bg-blue-500" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          My Performance Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={studentChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

export { TeacherDashboard, StudentDashboard }
