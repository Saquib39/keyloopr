"use client"
import { motion } from "framer-motion"
import { FolderOpen, Users, User, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function SummaryBoxes({ projects }) {
  const safeProjects = projects || []

  const stats = {
    totalProjects: safeProjects.length,
    activeProjects: safeProjects.filter((p) => p.status === "active").length,
    teamProjects: safeProjects.filter((p) => p.access === "team").length,
    personalProjects: safeProjects.filter((p) => p.access === "personal").length,
  }

  const summaryData = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      change: "+12%",
      trend: "up",
      icon: FolderOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      change: "+8%",
      trend: "up",
      icon: Activity,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Team Projects",
      value: stats.teamProjects,
      change: "+15%",
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Personal Projects",
      value: stats.personalProjects,
      change: "+5%",
      trend: "up",
      icon: User,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-500/20",
    },
  ]

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return TrendingUp
      case "down":
        return TrendingDown
      default:
        return Minus
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {summaryData.map((item, index) => {
        const IconComponent = item.icon
        const TrendIcon = getTrendIcon(item.trend)
        const trendColor = getTrendColor(item.trend)

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative p-6 rounded-2xl bg-gradient-to-br ${item.bgColor} backdrop-blur-xl border ${item.borderColor} hover:border-opacity-50 transition-all duration-300 group overflow-hidden`}
          >
            {/* Background gradient effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent size={20} className="text-white" />
                </div>

                <div className={`flex items-center space-x-1 text-sm font-medium ${trendColor}`}>
                  <TrendIcon size={14} />
                  <span>{item.change}</span>
                </div>
              </div>

              <div className="space-y-1">
                <motion.h3
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {item.value.toLocaleString()}
                </motion.h3>
                <p className="text-gray-400 text-sm font-medium">{item.title}</p>
              </div>

              {/* Subtle animation line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${item.color} opacity-50`}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
