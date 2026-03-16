import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Send, Calendar } from 'lucide-react'
import api from '../lib/api'
import useToast from '../hooks/useToast'
import useAuth from '../auth/useAuth'

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [subjects, setSubjects] = useState([])
  const toast = useToast()
  const auth = useAuth()

  useEffect(() => {
    fetchAssignments()
    api.get('/api/courses/subjects').then(res => setSubjects(res.data)).catch(console.error)
  }, [])

  const fetchAssignments = async () => {
    const res = await api.get('/api/assignments')
    setAssignments(res.data)
  }

  const createAssignment = async () => {
    if (!title || !subjectId || !dueDate) {
      toast.notify('Fill title, subject, due date', 'error')
      return
    }
    try {
      await api.post('/api/assignments', { title, description, dueDate, subjectId: parseInt(subjectId) })
      toast.notify('Assignment created', 'success')
      fetchAssignments()
      setTitle(''); setDescription(''); setDueDate(''); setSubjectId('')
    } catch (e) {
      toast.notify('Failed to create assignment', 'error')
      console.error(e)
    }
  }

  const submitAssignment = async (assignmentId) => {
    try {
      await api.post(`/api/assignments/${assignmentId}/submit`, { comments: 'Submitted via portal' })
      toast.notify('Assignment submitted', 'success')
      fetchAssignments()
    } catch (e) {
      toast.notify('Submission failed', 'error')
      console.error(e)
    }
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        {(auth.user?.roles || []).some(r => ['ADMIN','TEACHER'].includes(r)) && (
          <button onClick={createAssignment} className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-lg text-white shadow">
            <PlusCircle className="inline w-4 h-4 mr-1" />Create
          </button>
        )}
      </div>

      {(auth.user?.roles || []).some(r => ['ADMIN','TEACHER'].includes(r)) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-white/20 dark:border-gray-700/50">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-2 rounded-lg border" />
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="p-2 rounded-lg border">
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input value={dueDate} onChange={e => setDueDate(e.target.value)} type="date" className="p-2 rounded-lg border" />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="p-2 rounded-lg border" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map(ass => (
          <div key={ass.id} className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-white/20 dark:border-gray-700/50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{ass.title}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-300">Due: {new Date(ass.dueDate).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ass.description}</p>
            <p className="text-xs mt-2 text-gray-500">Subject: {ass.subject} | Teacher: {ass.teacher}</p>
            {(auth.user?.roles || []).includes('STUDENT') && (
              <button onClick={() => submitAssignment(ass.id)} className="mt-3 bg-green-500 text-white px-3 py-2 rounded-lg">Submit</button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
