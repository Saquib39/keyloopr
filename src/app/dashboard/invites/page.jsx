"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Users, Clock, CheckCircle, XCircle, User, MessageSquare } from "lucide-react"


export default function InvitesPage() {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch("/api/invites")
      .then((res) => res.json())
      .then((data) => {
        setInvites(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleResponse = async (projectId, action) => {
    const res = await fetch(`/api/invites/${projectId}/${action}`, { method: "POST" })
    if (res.ok) {
      // Remove the invite from the list with animation
      setInvites((prev) => prev.filter((inv) => inv.projectId !== projectId))
    } else {
      alert("Failed to update invite")
    }
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "from-red-400 to-red-600"
      case "editor":
        return "from-blue-400 to-blue-600"
      case "viewer":
        return "from-green-400 to-green-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      <div className={`transition-all duration-300 `}>
        <div className="p-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Project Invitations
              </h1>
            </div>
            <p className="text-gray-400">Manage your pending project invitations and join new teams</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{invites.length}</p>
                  <p className="text-gray-400 text-sm">Pending Invites</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {invites.filter((inv) => inv.role === "admin").length}
                  </p>
                  <p className="text-gray-400 text-sm">Admin Invites</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {invites.filter((inv) => inv.role !== "admin").length}
                  </p>
                  <p className="text-gray-400 text-sm">Member Invites</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Invites List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          ) : invites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-12 max-w-md mx-auto">
                <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Pending Invites</h3>
                <p className="text-gray-400">You don't have any pending project invitations at the moment.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              <AnimatePresence>
                {invites.map((inv) => (
                  <motion.div
                    key={inv.projectId}
                    variants={itemVariants}
                    exit="exit"
                    layout
                    className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <h2 className="text-xl font-semibold text-white">{inv.projectName}</h2>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(inv.role)} text-white`}
                          >
                            {inv.role}
                          </span>
                        </div>

                        <p className="text-gray-300 mb-3">{inv.projectDesc}</p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <User className="w-4 h-4" />
                            <span>
                              Invited by: <span className="text-white font-medium">{inv.owner}</span>
                            </span>
                          </div>

                          {inv.message && (
                            <div className="flex items-start gap-2 text-sm text-gray-400">
                              <MessageSquare className="w-4 h-4 mt-0.5" />
                              <div>
                                <span>Message: </span>
                                <span className="text-gray-300 italic">"{inv.message}"</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleResponse(inv.projectId, "accept")}
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleResponse(inv.projectId, "reject")}
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
