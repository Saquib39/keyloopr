"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Copy, MoreVertical, Key, Edit3, Trash2, X } from "lucide-react"
import toast from "react-hot-toast"
import KeyForm from "./KeyForm"

export default function KeysTab({ projectId, currentUserId, isOwner, isEditor }) {
  const [keys, setKeys] = useState([])
  const [visibleKeyIds, setVisibleKeyIds] = useState([])
  const [openMenuId, setOpenMenuId] = useState(null)
  const [keyBeingEdited, setKeyBeingEdited] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const canEdit = isOwner || isEditor

  const fetchKeys = async () => {
    const res = await fetch(`/api/projects/${projectId}/keys`)
    if (res.ok) {
      const data = await res.json()
      setKeys(data)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [projectId])

  const toggleKeyVisibility = (id) => {
    setVisibleKeyIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value)
    toast.success("Copied to clipboard")
  }

  const handleDelete = async (keyId) => {
    if (!confirm("Delete this key?")) return
    const res = await fetch(`/api/projects/${projectId}/keys/${keyId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      setKeys((prev) => prev.filter((k) => k._id !== keyId))
      toast.success("Key deleted")
    } else {
      toast.error("Failed to delete key")
    }
  }

  const handleEditKey = (key) => {
    setKeyBeingEdited(key)
    setShowEditModal(true)
    setOpenMenuId(null)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setKeyBeingEdited(null)
  }

  const handleKeyUpdateSuccess = () => {
    handleCloseEditModal()
    fetchKeys()
  }

  const getKeyTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "api":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "database":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "auth":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Key className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Project Keys</h2>
        </div>
        <div className="text-sm text-gray-400">
          {keys.length} {keys.length === 1 ? "key" : "keys"} total
        </div>
      </div>

      {keys.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <Key className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No keys added yet</p>
          <p className="text-gray-500 text-sm">Add your first API key to get started</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {keys.map((k, index) => (
              <motion.div
                key={k._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white">{k.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getKeyTypeColor(k.type)}`}>
                        {k.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 bg-slate-800/50 rounded-lg p-3 font-mono text-sm">
                        <span className="text-gray-300">
                          {visibleKeyIds.includes(k._id) ? k.value : "••••••••••••••••••••••••••••••••"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleKeyVisibility(k._id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                          {visibleKeyIds.includes(k._id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCopy(k.value)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                          <Copy className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {k.description && <p className="text-gray-400 text-sm">{k.description}</p>}
                  </div>

                  {canEdit && (
                    <div className="relative ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setOpenMenuId(openMenuId === k._id ? null : k._id)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </motion.button>

                      <AnimatePresence>
                        {openMenuId === k._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 mt-2 w-40 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden"
                          >
                            <button
                              className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                              onClick={() => handleEditKey(k)}
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit Key
                            </button>
                            <button
                              className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                              onClick={() => handleDelete(k._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Key
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showEditModal && keyBeingEdited && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={handleCloseEditModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Edit3 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Edit Key
                    </h2>
                    <p className="text-sm text-gray-400">Update your API key details</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseEditModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <KeyForm projectId={projectId} existingKey={keyBeingEdited} onSuccess={handleKeyUpdateSuccess} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
