"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, User, Key, UserPlus, Settings, Trash2, Edit3, Clock, Calendar } from "lucide-react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ProjectActivityTab({ id }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`/api/projects/${id}/activity`)
        if (res.ok) {
          const data = await res.json()
          setLogs(data)
          // toast.success("Activity logs loaded successfully ✅")
        } else {
          toast.error("Failed to load activity logs ❌")
        }
      } catch (error) {
        toast.error("Something went wrong while fetching activity logs ❌")
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [id])

  const getActivityIcon = (message) => {
    const msg = (message || "").toLowerCase()

    if (msg.includes("key")) return Key
    if (msg.includes("member") || msg.includes("invite")) return UserPlus
    if (msg.includes("setting") || msg.includes("update")) return Settings
    if (msg.includes("delete")) return Trash2
    if (msg.includes("edit")) return Edit3
    return Activity
  }

  const getActivityColor = (message) => {
    const msg = (message || "").toLowerCase()

    if (msg.includes("delete")) return "text-red-400 bg-red-500/20"
    if (msg.includes("add") || msg.includes("create")) return "text-green-400 bg-green-500/20"
    if (msg.includes("update") || msg.includes("edit")) return "text-blue-400 bg-blue-500/20"
    if (msg.includes("invite")) return "text-purple-400 bg-purple-500/20"
    return "text-gray-400 bg-gray-500/20"
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now - time) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return time.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Project Activity</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Project Activity</h2>
        </div>
        <div className="text-sm text-gray-400">
          {logs.length} {logs.length === 1 ? "activity" : "activities"}
        </div>
      </div>

      {logs.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No activity yet</p>
          <p className="text-gray-500 text-sm">Project activities will appear here as they happen</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
      {logs.slice(-7).reverse().map((log, index) => {
    const ActivityIcon = getActivityIcon(log.message)
    const colorClasses = getActivityColor(log.message)
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200"
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${colorClasses}`}>
            <ActivityIcon className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <p className="text-white text-base leading-relaxed mb-2">{log.message}</p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{log.user?.username || "Someone"}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(log.timestamp)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(log.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  })}
</AnimatePresence>

        </div>
      )}
    </div>
  )
}
