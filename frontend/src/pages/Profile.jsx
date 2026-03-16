import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserCircle, ShieldCheck, BarChart3 } from 'lucide-react'
import api from '../lib/api'
import useToast from '../hooks/useToast'

export default function Profile() {
  const toast = useToast()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    api.get('/api/auth/profile').then(res => setProfile(res.data)).catch(console.error)
  }, [])

  if (!profile) return <p>Loading profile...</p>

  const [form, setForm] = useState({ username: profile.username, email: profile.email || '', displayName: profile.displayName || '', avatarUrl: profile.avatarUrl || '' })

  const handleSave = async () => {
    try {
      await api.put('/api/users/profile', form)
      toast.notify('Profile saved', 'success')
    } catch (e) {
      console.error(e)
      toast.notify('Save failed', 'error')
    }
  }

  const handleFile = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm((prev) => ({ ...prev, avatarUrl: url }))
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div style={{ backgroundImage: `url(${form.avatarUrl || `https://ui-avatars.com/api/?name=${profile.username}`})` }} className="w-16 h-16 rounded-full bg-cover bg-center" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{form.displayName || profile.username}</h1>
            <p className="text-gray-600 dark:text-gray-400">{profile.roles.join(', ')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.displayName} onChange={e => setForm({...form, displayName: e.target.value})} placeholder="Full Name" className="w-full p-2 border rounded-lg" />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full p-2 border rounded-lg" />
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-600 dark:text-gray-300">Avatar</label>
            <input type="file" onChange={handleFile} className="mt-1" />
          </div>
          <button onClick={handleSave} className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg">Save Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200"><UserCircle className="w-5 h-5" /> Full Name</div>
          <p className="mt-2 font-semibold">{profile.username}</p>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200"><ShieldCheck className="w-5 h-5" /> Role</div>
          <p className="mt-2 font-semibold">{profile.roles.join(', ')}</p>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200"><BarChart3 className="w-5 h-5" /> Attendance</div>
          <p className="mt-2 font-semibold">Coming soon</p>
        </div>
      </div>
    </motion.div>
  )
}
