"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Trash2,
  UserPlus,
  Key,
  Settings,
  Users,
  Activity,
  Calendar,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  LogOut,
} from "lucide-react"

import ProjectMembersTab from "@/components/ProjectMembersTab"
import KeysTab from "@/components/KeysTab"
import SettingsTab from "@/components/SettingsTab"
import ProjectActivityTab from "@/components/ProjectActivityTab"
import {toast } from "react-toastify"

const tabs = [
  { id: "keys", label: "API Keys", icon: Key },
  { id: "members", label: "Members", icon: Users },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  

  const [project, setProject] = useState(null)
  const [activeTab, setActiveTab] = useState("keys")
  const [loading, setLoading] = useState(true)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [memberForm, setMemberForm] = useState({ username: "", role: "viewer", message: "" })
  const [keyCount, setKeyCount] = useState(0)

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`/api/projects/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProject(data)

        try {
          const keyRes = await fetch(`/api/projects/${id}/keys`)
          if (keyRes.ok) {
            const keys = await keyRes.json()
            setKeyCount(keys.length)
          }
        } catch (err) {}
      }
      setLoading(false)
    }
    if (id) {
      fetchProject()
    }
  }, [id])

  if (!id) {
    return <p>Project ID missing</p>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-xl">Project not found</p>
        </div>
      </div>
    )
  }

  const isOwner = project.owner && project.owner._id === project.currentUserId
  const isTeam = project.access === "team"

  const handleAddMemberClick = () => {
    if (!isOwner) {
      toast.warning("You are not the owner of this project", "Access Denied")
      return
    }
    if (!isTeam) {
      toast.info("This project does not support team members", "Team Access Required")
      return
    }
    setShowAddMemberModal(true)
  }

  const handleAddMember = async () => {
    const res = await fetch(`/api/projects/${id}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberForm),
    })
    if (res.ok) {
      toast.success("Invite sent successfully", "Member Invited")
      setShowAddMemberModal(false)
      setMemberForm({ username: "", role: "viewer", message: "" })
    } else {
      toast.error("Failed to send invite", "Invitation Error")
    }
  }

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const res = await fetch(`/api/projects/${id}/members/${memberId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole }),
      })

      if (res.ok) {
        const updated = await res.json()
        setProject(updated)
        toast.success("Member role updated successfully", "Role Changed")
      } else {
        toast.error("Failed to change role", "Role Change Error")
      }
    } catch (err) {
      console.error("Error changing role:", err)
      toast.error("Something went wrong", "Unexpected Error")
    }
  }

  const handleRemoveMember = async (memberId) => {
    const confirmed = window.confirm("Are you sure you want to remove this member?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/projects/${id}/members/${memberId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        const updated = await res.json()
        setProject(updated)
        toast.success("Member removed successfully", "Member Removed")
      } else {
        toast.error("Failed to remove member", "Removal Error")
      }
    } catch (err) {
      console.error("Error removing member:", err)
      toast.error("Something went wrong", "Unexpected Error")
    }
  }

  const handleDeleteProject = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this project?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Project deleted successfully", "Project Deleted")
        setTimeout(() => router.push("/dashboard"), 1500)
      } else {
        toast.error("Failed to delete project", "Delete Error")
      }
    } catch (err) {
      toast.error("Something went wrong", "Unexpected Error")
    }
  }

  const handleLeaveProject = async () => {
    const confirmed = window.confirm("Are you sure you want to leave this project?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/projects/${id}/leave`, { method: "DELETE" })
      if (res.ok) {
        toast.success("You have left the project", "Left Project")
        setTimeout(() => router.push("/dashboard"), 1500)
      } else {
        toast.error("Failed to leave project", "Leave Error")
      }
    } catch (err) {
      toast.error("Something went wrong", "Unexpected Error")
    }
  }

  return (
    <>


      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <motion.main
          className="transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8">
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
              </button>

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <GitBranch className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
                    <p className="text-gray-400 mb-3">{project.description}</p>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          project.status === "active"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {project.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          project.access === "team"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        }`}
                      >
                        {project.access}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Created {new Date(project.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => router.push(`/dashboard/projects/${id}/keys/add`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Key className="w-4 h-4" />
                    <span>Add Key</span>
                  </motion.button>

                  <motion.button
                    onClick={handleAddMemberClick}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Member</span>
                  </motion.button>

                  {isOwner ? (
                    <motion.button
                      onClick={handleDeleteProject}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Project</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleLeaveProject}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Leave Project</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">API Keys</p>
                    <p className="text-2xl font-bold text-white">{keyCount}</p>
                  </div>
                  <Key className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Members</p>
                    <p className="text-2xl font-bold text-white">{project.members?.length || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Requests</p>
                    <p className="text-2xl font-bold text-white">{project.requestCount || 0}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Uptime</p>
                    <p className="text-2xl font-bold text-white">99.9%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex border-b border-white/10">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 transition-all relative ${
                      activeTab === tab.id
                        ? "text-purple-400 bg-white/5"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                        layoutId="activeTab"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "keys" && (
                    <KeysTab
                      key="keys"
                      projectId={id}
                      isEditor={
                        isOwner ||
                        project.members?.some((m) => m.user._id === project.currentUserId && m.role === "editor")
                      }
                    />
                  )}
                  {activeTab === "members" && (
                    <ProjectMembersTab
                      key="members"
                      members={project.members}
                      ownerId={project.owner?._id}
                      currentUserId={project.currentUserId}
                      handleRemoveMember={handleRemoveMember}
                      handleRoleChange={handleRoleChange}
                    />
                  )}
                  {activeTab === "activity" && <ProjectActivityTab key="activity" id={id} />}
                  {activeTab === "settings" && (
                    <SettingsTab key="settings" project={project} isOwner={isOwner} projectId={id} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.main>

        {/* Add Member Modal */}
        <AnimatePresence>
          {showAddMemberModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700/50"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="text-lg font-semibold mb-4 text-white">Invite Member</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={memberForm.username}
                    onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })}
                  />
                  <select
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <textarea
                    placeholder="Message (optional)"
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                    value={memberForm.message}
                    onChange={(e) => setMemberForm({ ...memberForm, message: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowAddMemberModal(false)}
                  >
                    Cancel
                  </button>
                  <motion.button
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    onClick={handleAddMember}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send Invite
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
