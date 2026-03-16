import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import api from '../lib/api'
import useToast from '../hooks/useToast'
import useAuth from '../auth/useAuth'

export default function Subjects() {
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [courseName, setCourseName] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [teachers, setTeachers] = useState([])
  const toast = useToast()
  const auth = useAuth()

  useEffect(() => {
    api.get('/api/courses').then(res => setCourses(res.data)).catch(console.error)
    api.get('/api/courses/subjects').then(res => setSubjects(res.data)).catch(console.error)
    api.get('/api/users').then(res => setTeachers(res.data.filter(u => u.roles && u.roles.includes('TEACHER')))).catch(console.error)
  }, [])

  const createCourse = async () => {
    if (!courseName) return toast.notify('Course name required', 'error')
    await api.post('/api/courses', { name: courseName, description: '' })
    toast.notify('Course added', 'success')
    setCourseName('')
    const res = await api.get('/api/courses')
    setCourses(res.data)
  }

  const createSubject = async () => {
    if (!subjectName || !courseId || !teacherId) {
      return toast.notify('Fill subject/course/teacher', 'error')
    }
    await api.post('/api/courses/subjects', { name: subjectName, courseId: parseInt(courseId), teacherId: parseInt(teacherId) })
    toast.notify('Subject added', 'success')
    setSubjectName(''); setCourseId(''); setTeacherId('')
    const res = await api.get('/api/courses/subjects')
    setSubjects(res.data)
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course & Subject Management</h1>
      </div>

      {auth.user?.roles.includes('ADMIN') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-white/20 dark:border-gray-700/50">
            <h2 className="font-semibold mb-3">Add Course</h2>
            <input value={courseName} onChange={e => setCourseName(e.target.value)} className="w-full p-2 border rounded-lg mb-2" placeholder="Course name" />
            <button onClick={createCourse} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-2">
              <PlusCircle className="inline w-4 h-4 mr-1" />Add Course
            </button>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-white/20 dark:border-gray-700/50">
            <h2 className="font-semibold mb-3">Add Subject</h2>
            <input value={subjectName} onChange={e => setSubjectName(e.target.value)} className="w-full p-2 border rounded-lg mb-2" placeholder="Subject name" />
            <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full p-2 border rounded-lg mb-2">
              <option value="">Choose course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="w-full p-2 border rounded-lg mb-2">
              <option value="">Choose teacher</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
            </select>
            <button onClick={createSubject} className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg px-4 py-2">
              <PlusCircle className="inline w-4 h-4 mr-1" />Add Subject
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-white/20 dark:border-gray-700/50">
        <h2 className="font-semibold mb-3">Available Subjects</h2>
        <ul className="space-y-2">
          {subjects.map(s => (
            <li key={s.id} className="rounded-lg p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between"><strong>{s.name}</strong><span className="text-xs text-gray-500">Course: {s.course?.name}</span></div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Teacher: {s.teacher?.username}</div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
