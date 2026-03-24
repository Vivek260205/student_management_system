import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend } from 'recharts'
import { Users, User, CheckCircle, FileText, TrendingUp, Award, Activity, Download, Upload, Search } from 'lucide-react'
import api from '../lib/api'
import useDarkMode from '../hooks/useDarkMode'

const PremiumDashboard = () => {
  const { isDarkMode } = useDarkMode()
  const [stats, setStats] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [courseData, setCourseData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, weeklyRes, monthlyRes, perfRes, courseRes] = await Promise.all([
        api.get('/api/analytics/dashboard-stats'),
        api.get('/api/analytics/weekly-attendance'),
        api.get('/api/analytics/monthly-attendance'),
        api.get('/api/analytics/student-performance'),
        api.get('/api/analytics/course-distribution')
      ])

      setStats(statsRes.data)
      setWeeklyData(weeklyRes.data.map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        present: d.present,
        absent: d.absent,
        percentage: d.percentage
      })))
      
      setMonthlyData(monthlyRes.data.map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present: d.present,
        absent: d.absent
      })))

      setPerformanceData(perfRes.data)
      
      const courseArray = Object.entries(courseRes.data).map(([name, value]) => ({
        name,
        value,
        fill: `hsl(${Math.random() * 360}, 70%, 60%)`
      }))
      setCourseData(courseArray)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6']

  const StatCard = ({ title, value, icon: Icon, color, delay, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-5" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {trend && <p className="text-xs mt-2 text-emerald-500 font-semibold">{trend}</p>}
        </div>
        <div className={`p-4 rounded-xl ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  )

  const ChartCard = ({ title, children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`rounded-2xl p-6 shadow-lg ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}
    >
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      {children}
    </motion.div>
  )

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Premium Dashboard
        </h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Real-time analytics and student management
        </p>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats && (
          <>
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              color="bg-blue-500"
              delay={0}
              trend="↑ 12% this month"
            />
            <StatCard
              title="Total Teachers"
              value={stats.totalTeachers}
              icon={User}
              color="bg-purple-500"
              delay={0.1}
            />
            <StatCard
              title="Present Today"
              value={stats.presentToday}
              icon={CheckCircle}
              color="bg-emerald-500"
              delay={0.2}
              trend={`${stats.attendancePercentage.toFixed(1)}%`}
            />
            <StatCard
              title="Pending Tasks"
              value={stats.pendingAssignments}
              icon={FileText}
              color="bg-orange-500"
              delay={0.3}
            />
          </>
        )}
      </div>

      {/* Performance Score */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-6 shadow-lg mb-8 ${
            isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Performance</p>
              <p className="text-5xl font-bold mt-2 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                {stats.averagePerformance.toFixed(1)}%
              </p>
            </div>
            <div className="text-right">
              <Award className="w-16 h-16 text-emerald-400 mb-2" />
              <span className="text-emerald-400 font-semibold">Excellent</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Attendance */}
        <ChartCard title="Weekly Attendance Trend" delay={0.5}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFF', border: 'none', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="present" stroke="#10B981" fillOpacity={1} fill="url(#colorPresent)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Course Distribution */}
        <ChartCard title="Course Distribution" delay={0.6}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {courseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Monthly Attendance */}
      <ChartCard title="Monthly Attendance Overview" delay={0.7}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFF', border: 'none', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="present" stackId="a" fill="#10B981" />
            <Bar dataKey="absent" stackId="a" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex gap-4 flex-wrap"
      >
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
          <Download className="w-5 h-5" />
          Export Report
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
          <Upload className="w-5 h-5" />
          Import Students
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
          <Search className="w-5 h-5" />
          Advanced Search
        </button>
      </motion.div>
    </div>
  )
}

export default PremiumDashboard
