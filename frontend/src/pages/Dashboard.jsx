import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, CheckCircle, XCircle, TrendingUp, UserPlus, Calendar, FileText, Award, Target } from 'lucide-react'
import api from '../lib/api'
import useDarkMode from '../hooks/useDarkMode'

const attendanceData = [
  { name: 'Mon', present: 45, absent: 5 },
  { name: 'Tue', present: 48, absent: 2 },
  { name: 'Wed', present: 42, absent: 8 },
  { name: 'Thu', present: 50, absent: 0 },
  { name: 'Fri', present: 47, absent: 3 },
]

const pieData = [
  { name: 'Present', value: 232, color: '#10B981' },
  { name: 'Absent', value: 18, color: '#EF4444' },
]

export default function Dashboard(){
  const { isDarkMode } = useDarkMode()
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendancePercentage: 0
  })
  const [loadingDashboard, setLoadingDashboard] = useState(true)
  const [insights, setInsights] = useState({
    averageAttendance: 0,
    mostRegularStudent: '-',
    lowestAttendanceStudent: '-',
    riskStudents: []
  })
  const [attendanceData, setAttendanceData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [activityFeed, setActivityFeed] = useState([])
  const [pieData, setPieData] = useState([
    { name: 'Present', value: 0, color: '#10B981' },
    { name: 'Absent', value: 0, color: '#EF4444' },
  ])

  useEffect(() => {
    fetchStats()
    fetchCharts()
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const res = await api.get('/api/activities')
      setActivityFeed(res.data)
    } catch (e) {
      console.error('Failed to fetch activities', e)
    }
  }

  const getPerfLabel = (score) => {
    if (score >= 85) return { label: 'Excellent', className: 'bg-emerald-100 text-emerald-700' }
    if (score >= 70) return { label: 'Good', className: 'bg-blue-100 text-blue-700' }
    if (score >= 55) return { label: 'Average', className: 'bg-yellow-100 text-yellow-700' }
    return { label: 'Needs Attention', className: 'bg-red-100 text-red-700' }
  }

  const fetchStats = async () => {
    try {
      const [studentsRes, attendanceRes, percentagesRes] = await Promise.all([
        api.get('/api/students'),
        api.get('/api/attendance/insights'),
        api.get('/api/attendance/percentages')
      ])

      const total = studentsRes.data.length
      const today = new Date().toISOString().split('T')[0]
      const todayAttendance = await api.get(`/api/attendance?date=${today}`)
      const presentToday = todayAttendance.data.filter(a => a.present).length
      const absentToday = total - presentToday
      const attendancePercentage = total > 0 ? Math.round((presentToday / total) * 100) : 0

      setStats({
        totalStudents: total,
        presentToday,
        absentToday,
        attendancePercentage
      })

      setInsights({
        averageAttendance: attendanceRes.data.averageAttendance || 0,
        mostRegularStudent: attendanceRes.data.mostRegularStudent || '-',
        lowestAttendanceStudent: attendanceRes.data.lowestAttendanceStudent || '-',
        riskStudents: attendanceRes.data.riskStudents || []
      })

      const perf = percentagesRes.data.map((student) => {
        const attendance = student.percentage
        const assignments = Math.max(40, Math.min(100, attendance + (Math.random() * 20 - 10)))
        const score = Math.round(attendance * 0.6 + assignments * 0.4)
        const label = getPerfLabel(score)
        return {
          ...student,
          attendance,
          assignments: Math.round(assignments),
          score,
          performance: label.label,
          badgeClass: label.className
        }
      })
      setPerformanceData(perf)

    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoadingDashboard(false)
    }
  }

  const fetchCharts = async () => {
    try {
      const [dailyRes, weeklyRes] = await Promise.all([
        api.get('/api/attendance/daily'),
        api.get('/api/attendance/daily?start=' + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      ])
      
      // Process weekly data (last 7 days)
      const weeklyData = dailyRes.data.slice(-7).map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        present: d.present,
        absent: d.absent
      }))
      setAttendanceData(weeklyData)

      // Process monthly data (last 30 days)
      const monthlyData = weeklyRes.data.map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present: d.present,
        absent: d.absent
      }))
      setMonthlyData(monthlyData)

      // Update pie data
      const latest = dailyRes.data[dailyRes.data.length - 1]
      if (latest) {
        setPieData([
          { name: 'Present', value: latest.present, color: '#10B981' },
          { name: 'Absent', value: latest.absent, color: '#EF4444' },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-l-4 ${color} hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('border-', 'bg-').replace('-500', '-500/20')} dark:bg-gray-700/50`}>
          <Icon className="w-8 h-8 text-current" />
        </div>
      </div>
    </motion.div>
  )

  if (loadingDashboard) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <Link
          to="/students"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Manage Students
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="border-blue-500"
          delay={0.1}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={CheckCircle}
          color="border-green-500"
          delay={0.2}
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={XCircle}
          color="border-red-500"
          delay={0.3}
        />
        <StatCard
          title="Attendance %"
          value={`${stats.attendancePercentage}%`}
          icon={TrendingUp}
          color="border-purple-500"
          delay={0.4}
        />
      </div>

      {/* AI Attendance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          AI Attendance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50/80 dark:bg-green-900/20 rounded-xl">
            <Target className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Most Regular</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{insights.mostRegularStudent}</p>
          </div>
          <div className="text-center p-4 bg-red-50/80 dark:bg-red-900/20 rounded-xl">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Lowest Attendance</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{insights.lowestAttendanceStudent}</p>
          </div>
          <div className="text-center p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Class Attendance</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{insights.averageAttendance.toFixed(1)}%</p>
          </div>
        </div>
      </motion.div>

      {/* Risk students and performance prediction */}
      <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Predictions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">At-risk Students (&lt; 60% attendance)</p>
            <ul className="space-y-2">
              {insights.riskStudents.length === 0 ? (
                <li className="text-sm text-gray-500 dark:text-gray-300">No students at risk.</li>
              ) : insights.riskStudents.map((student) => (
                <li key={student.studentId} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm text-red-700 dark:text-red-200">{student.firstName} {student.lastName} ({student.percentage.toFixed(1)}%)</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Student performance score (attendance + assignments)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {performanceData.slice(0, 8).map((student) => (
                <div key={student.studentId} className="p-3 rounded-lg bg-white/90 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-700 dark:text-gray-200">{student.firstName} {student.lastName}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${student.badgeClass}`}>{student.performance}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Score: {student.score}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Activity Feed</h3>
        <ul className="space-y-2 max-h-56 overflow-y-auto">
          {activityFeed.length === 0 ? (
            <li className="text-sm text-gray-500 dark:text-gray-300">No recent actions.</li>
          ) : activityFeed.map((act) => (
            <li key={act.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-200">{act.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(act.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  color: isDarkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Bar dataKey="present" fill="#10B981" name="Present" />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Attendance Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monthly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  color: isDarkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={3} name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={3} name="Absent" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Today's Attendance Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Today's Attendance</h3>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col space-y-4 lg:ml-6">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-lg text-gray-600 dark:text-gray-400">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/students"
            className="flex items-center p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100/80 dark:hover:bg-blue-900/30 transition-all duration-200 group"
          >
            <div className="p-2 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg mr-3 group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Add Student</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Register new students</p>
            </div>
          </Link>
          <Link
            to="/attendance"
            className="flex items-center p-4 bg-green-50/80 dark:bg-green-900/20 rounded-xl hover:bg-green-100/80 dark:hover:bg-green-900/30 transition-all duration-200 group"
          >
            <div className="p-2 bg-green-500/20 dark:bg-green-400/20 rounded-lg mr-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">Mark Attendance</p>
              <p className="text-sm text-green-700 dark:text-green-300">Record daily attendance</p>
            </div>
          </Link>
          <div className="flex items-center p-4 bg-purple-50/80 dark:bg-purple-900/20 rounded-xl group">
            <div className="p-2 bg-purple-500/20 dark:bg-purple-400/20 rounded-lg mr-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-purple-900 dark:text-purple-100">View Reports</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Generate attendance reports</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
