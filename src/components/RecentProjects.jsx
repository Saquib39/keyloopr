"use client"
import { motion } from "framer-motion"
import { FolderOpen, Key, Clock, TrendingUp, AlertCircle, CheckCircle, Pause } from "lucide-react"

export default function RecentProjects({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
          <FolderOpen size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-400 text-lg font-medium">No projects found</p>
        <p className="text-gray-500 text-sm mt-1">Create your first project to get started</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (window.location.href = "/dashboard/projects/new")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
        >
          Create Project
        </motion.button>
      </div>
    )
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return CheckCircle
      case "paused":
        return Pause
      case "error":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "paused":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "error":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  return (
    <div className="space-y-4">
      {projects.map((project, index) => {
        const StatusIcon = getStatusIcon(project.status)
        const statusColor = getStatusColor(project.status)

        return (
          <motion.div
            key={project._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="p-5 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:from-gray-800/60 hover:to-gray-900/60 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 group cursor-pointer"
            onClick={() => (window.location.href = `/dashboard/projects/${project._id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-200">
                  <FolderOpen size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">
                    {project.name}
                  </h3>
                  <div
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium border ${statusColor}`}
                  >
                    <StatusIcon size={10} />
                    <span>{project.status || "Unknown"}</span>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 group-hover:text-white transition-colors"
              >
                <TrendingUp size={16} />
              </motion.div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
              {project.description || "No description available"}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-gray-400">
                  <Key size={12} />
                  <span>{project.keyCount || 0} keys</span>
                </div>

                {project.createdAt && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock size={12} />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <motion.div
                whileHover={{ x: 4 }}
                className="text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                View →
              </motion.div>
            </div>

            {/* Progress bar if available */}
            {project.progress !== undefined && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
