import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import api from '../lib/api'
import useDarkMode from '../hooks/useDarkMode'

const ExcelImportModal = ({ isOpen, onClose, onSuccess }) => {
  const { isDarkMode } = useDarkMode()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xlsx')) {
        setError('Please select a valid Excel file (.xlsx)')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/api/import/students/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setResult(response.data)
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const headers = ['Name', 'Email', 'Phone Number', 'Course Name', 'Enrollment Number']
    const csv = headers.join(',') + '\n'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_template.csv'
    a.click()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`rounded-2xl shadow-2xl max-w-md w-full mx-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Import Students
              </h2>
              <button
                onClick={onClose}
                className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {!result ? (
                <>
                  {/* File Upload */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Select Excel File (.xlsx)
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                        isDarkMode
                          ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {file ? file.name : 'Drop file or click to select'}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Only .xlsx files supported
                      </p>
                    </div>
                    <input
                      id="fileInput"
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-gap-2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-500">{error}</p>
                    </motion.div>
                  )}

                  {/* Template Download */}
                  <button
                    onClick={downloadTemplate}
                    className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Download Template
                  </button>

                  {/* Upload Button */}
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`w-full py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                      uploading || !file
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload File
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* Results */
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25" />
                      <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </div>
                  </motion.div>

                  <h3 className={`text-xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Import Complete!
                  </h3>

                  <div className="space-y-2 mb-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Total Records: <span className="font-bold">{result.totalRecords}</span>
                    </p>
                    <p className="text-sm text-emerald-500 font-semibold">
                      ✓ Successful: {result.successfulImports}
                    </p>
                    {result.failedImports > 0 && (
                      <p className="text-sm text-red-500 font-semibold">
                        ✗ Failed: {result.failedImports}
                      </p>
                    )}
                  </div>

                  {result.errors.length > 0 && (
                    <div className={`bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {result.errors.map((err, id) => (
                        <p key={id} className="text-xs text-left">{err}</p>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExcelImportModal
