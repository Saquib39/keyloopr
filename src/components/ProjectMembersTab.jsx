"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Crown, Shield, Eye, MoreVertical, UserMinus, Settings, CheckCircle, Clock, X } from "lucide-react"

export default function ProjectMembersTab({ members, ownerId, currentUserId, handleRemoveMember, handleRoleChange }) {
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editRoleId, setEditRoleId] = useState(null)

  const safeMembers = Array.isArray(members) ? members : []

  const getRoleColor = (role) => {
    switch (role) {
      case "owner":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "editor":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "viewer":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "inactive":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getRoleIcon = (role, isOwner) => {
    if (isOwner) return Crown
    switch (role) {
      case "editor":
        return Settings
      case "viewer":
        return Eye
      default:
        return Shield
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircle
      case "pending":
        return Clock
      case "inactive":
        return X
      default:
        return Clock
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Project Members</h2>
        </div>
        <div className="text-sm text-gray-400">
          {safeMembers.length} {safeMembers.length === 1 ? "member" : "members"}
        </div>
      </div>

      {safeMembers.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No members added yet</p>
          <p className="text-gray-500 text-sm">Invite team members to collaborate on this project</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {safeMembers.map((m, index) => {
              const isOwner = m.user._id === ownerId
              const isCurrentUser = m.user._id === currentUserId
              const RoleIcon = getRoleIcon(m.role, isOwner)
              const StatusIcon = getStatusIcon(m.status)

              return (
                <motion.div
                  key={m.user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {m.user.username.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{m.user.username}</h3>
                          {isCurrentUser && (
                            <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">You</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <RoleIcon className="w-4 h-4 text-gray-400" />
                            <span
                              className={`px-2 py-1 rounded-full text-xs border ${getRoleColor(isOwner ? "owner" : m.role)}`}
                            >
                              {isOwner ? "Owner" : m.role}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <StatusIcon className="w-4 h-4 text-gray-400" />
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(m.status)}`}>
                              {m.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {currentUserId === ownerId && !isOwner && (
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                          onClick={() => setOpenMenuId(openMenuId === m.user._id ? null : m.user._id)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>

                        <AnimatePresence>
                          {openMenuId === m.user._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 mt-2 w-44 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden"
                            >
                              <button
                                className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                onClick={() => {
                                  setEditRoleId(m.user._id)
                                  setOpenMenuId(null)
                                }}
                              >
                                <Settings className="w-4 h-4" />
                                Change Role
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                onClick={() => {
                                  handleRemoveMember(m.user._id)
                                  setOpenMenuId(null)
                                }}
                              >
                                <UserMinus className="w-4 h-4" />
                                Remove Member
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {editRoleId === m.user._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-300">Change role to:</label>
                          <select
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={m.role}
                            onChange={(e) => {
                              handleRoleChange(m.user._id, e.target.value)
                              setEditRoleId(null)
                            }}
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                          </select>
                          <button
                            onClick={() => setEditRoleId(null)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
