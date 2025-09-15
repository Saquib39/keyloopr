"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import {
  Search,
  Grid,
  List,
  Plus,
  Users,
  Key,
  Activity,
  Settings,
  FolderOpen,
  Crown,
  User,
  Clock,
  Eye,
} from "lucide-react"


export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAccess, setFilterAccess] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [projectKeyCounts, setProjectKeyCounts] = useState({})

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects/new")
        const data = await res.json()
        setProjects(data)

        const keyCountPromises = data.map(async (project) => {
          try {
            const keyRes = await fetch(`/api/projects/${project._id}/keys`)
            if (keyRes.ok) {
              const keys = await keyRes.json()
              return { projectId: project._id, count: keys.length }
            }
            return { projectId: project._id, count: 0 }
          } catch (err) {
            return { projectId: project._id, count: 0 }
          }
        })

        const keyCountResults = await Promise.all(keyCountPromises)
        const keyCountMap = {}
        keyCountResults.forEach(({ projectId, count }) => {
          keyCountMap[projectId] = count
        })
        setProjectKeyCounts(keyCountMap)
      } catch (err) {
        alert("Failed to load projects. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || project.status === filterStatus
    const matchesAccess = filterAccess === "all" || project.access === filterAccess

    return matchesSearch && matchesStatus && matchesAccess
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400"
      case "inactive":
        return "from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400"
      case "archived":
        return "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400"
      default:
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
    }
  }

  const getAccessColor = (access) => {
    switch (access) {
      case "public":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400"
      case "private":
        return "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400"
      case "team":
        return "from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400"
      default:
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
        <div className={`transition-all duration-300 `}>
          <div className="p-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
              />
              <span className="ml-4 text-xl text-gray-300">Loading your projects...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      <div className={`transition-all duration-300`}>
        <div className="p-8">
          {/* Header Section */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Your Projects
                </h1>
                <p className="text-gray-400 mt-2">Manage and organize all your projects in one place</p>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="projects/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                >
                  <Plus className="w-5 h-5" />
                  Create New Project
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                  <FolderOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{projects.length}</p>
                  <p className="text-sm text-gray-400">Total Projects</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter((p) => p.status === "active").length}
                  </p>
                  <p className="text-sm text-gray-400">Active Projects</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{projects.filter((p) => p.access === "team").length}</p>
                  <p className="text-sm text-gray-400">Team Projects</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-lg">
                  <Crown className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter((p) => p.owner?._id === p._id).length}
                  </p>
                  <p className="text-sm text-gray-400">Owned Projects</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={filterAccess}
                  onChange={(e) => setFilterAccess(e.target.value)}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Access</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="team">Team</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-gray-700/30 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Projects Grid/List */}
          <AnimatePresence mode="wait">
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16"
              >
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-12">
                  <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    {searchTerm || filterStatus !== "all" || filterAccess !== "all"
                      ? "No projects match your filters"
                      : "You don't have any projects yet"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || filterStatus !== "all" || filterAccess !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Create your first project to get started"}
                  </p>
                  <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Project
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`group bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 ${
                      viewMode === "list" ? "flex items-center gap-6" : ""
                    }`}
                  >
                    <div className={viewMode === "list" ? "flex-1" : ""}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-full border bg-gradient-to-r ${getStatusColor(project.status)} font-medium`}
                          >
                            {project.status}
                          </span>
                          <span
                            className={`text-xs px-3 py-1 rounded-full border bg-gradient-to-r ${getAccessColor(project.access)} font-medium`}
                          >
                            {project.access}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{project.owner?.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Key className="w-4 h-4" />
                          <span>{projectKeyCounts[project._id] || 0} keys</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Role Badge */}
                      {project.owner?._id === project._id ? (
                        <div className="flex items-center gap-1 text-xs text-orange-400 font-medium mb-4">
                          <Crown className="w-3 h-3" />
                          You are the Owner
                        </div>
                      ) : (
                        (() => {
                          const currentUserId = project.members?.find((m) => m.user?._id === project.owner?._id)?._id
                          const role = project.members?.find((m) => m.user?._id === currentUserId)?.role
                          return role ? (
                            <div className="flex items-center gap-1 text-xs text-purple-400 font-medium mb-4">
                              <Users className="w-3 h-3" />
                              Role: {role}
                            </div>
                          ) : null
                        })()
                      )}
                    </div>

                    <div
                      className={`flex ${viewMode === "list" ? "flex-col gap-2" : "justify-between items-center"} mt-4`}
                    >
                      <Link
                        href={`projects/${project._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-blue-300 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        View Project
                      </Link>

                      <Link
                        href={`projects/${project._id}?tab=settings`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 border border-gray-500/30 text-gray-300 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
