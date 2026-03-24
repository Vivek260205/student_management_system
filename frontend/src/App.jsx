import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import RequireRole from './components/RequireRole'
import AdminLayout from './layout/AdminLayout'
import Login from './pages/Login'
import StudentLogin from './pages/StudentLogin'
import Dashboard from './pages/Dashboard'
import PremiumDashboard from './pages/PremiumDashboard'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import Assignments from './pages/Assignments'
import Subjects from './pages/Subjects'
import Calendar from './pages/Calendar'
import FaceAttendance from './pages/FaceAttendance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import { TeacherDashboard, StudentDashboard } from './pages/RoleBasedDashboards'
import { ToastProvider } from './components/ToastProvider'

export default function App(){
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/student-login" element={<StudentLogin/>} />

        <Route path="/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/premium-dashboard" element={
                  <RequireRole roles={["ADMIN"]}>
                    <PremiumDashboard />
                  </RequireRole>
                } />
                <Route path="/teacher-dashboard" element={
                  <RequireRole roles={["TEACHER"]}>
                    <TeacherDashboard />
                  </RequireRole>
                } />
                <Route path="/my-dashboard" element={
                  <RequireRole roles={["STUDENT"]}>
                    <StudentDashboard />
                  </RequireRole>
                } />
                <Route path="/students" element={
                  <RequireRole roles={["ADMIN"]}>
                    <Students />
                  </RequireRole>
                } />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/face-attendance" element={<FaceAttendance />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </ToastProvider>
  )
}
