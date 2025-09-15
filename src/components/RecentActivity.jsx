"use client"
import { motion } from "framer-motion"
import { Clock, User, GitBranch, Key, Settings, Trash2 } from "lucide-react"

export default function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
          <Clock size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-400 text-lg font-medium">No recent activity</p>
        <p className="text-gray-500 text-sm mt-1">Activity will appear here when you start using the platform</p>
      </div>
    )
  }

  const getActivityIcon = (message) => {
    if (message.includes("created")) return GitBranch
    if (message.includes("key") || message.includes("API")) return Key
    if (message.includes("settings") || message.includes("updated")) return Settings
    if (message.includes("deleted")) return Trash2
    return User
  }

  const getActivityColor = (message) => {
    if (message.includes("created")) return "text-green-400 bg-green-400/10"
    if (message.includes("key") || message.includes("API")) return "text-blue-400 bg-blue-400/10"
    if (message.includes("settings") || message.includes("updated")) return "text-yellow-400 bg-yellow-400/10"
    if (message.includes("deleted")) return "text-red-400 bg-red-400/10"
    return "text-gray-400 bg-gray-400/10"
  }

  return (
    <div className="space-y-4">
      {activities.map((log, index) => {
        const IconComponent = getActivityIcon(log.message)
        const colorClass = getActivityColor(log.message)

        return (
          <motion.div
            key={log._id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="flex items-start space-x-4 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200 group"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform duration-200`}
            >
              <IconComponent size={16} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-medium leading-relaxed">{log.message}</p>

              <div className="flex items-center space-x-3 mt-2 text-sm">
                <span className="text-gray-400 flex items-center space-x-1">
                  <User size={12} />
                  <span>{log.user?.username || "Someone"}</span>
                </span>

                <span className="text-gray-500">•</span>

                <span className="text-gray-400 flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </span>
              </div>

              {log.projectName && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                    <GitBranch size={10} className="mr-1" />
                    {log.projectName}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
