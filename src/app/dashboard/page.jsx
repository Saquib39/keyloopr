"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import SummaryBoxes from "@/components/SummaryBoxes"
import RecentActivity from "@/components/RecentActivity"
import RecentProjects from "@/components/RecentProjects"
import { Search, Filter, Bell } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()

  const [projects, setProjects] = useState([])
  const [activities, setActivities] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProjects, setFilteredProjects] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [mounted, setMounted] = useState(false)

  // ✅ Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Check login
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/auth/me", { 
          credentials: "include", 
          cache: "no-store" 
        })
        const data = await res.json()

        if (data.isLoggedIn) {
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
        }
      } catch {
        setIsLoggedIn(false)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkLogin()
  }, [])

  // ✅ Fetch dashboard data (only if logged in)
  useEffect(() => {
    if (!isLoggedIn) return
    async function fetchData() {
      const projectsRes = await fetch("/api/projects", { cache: "no-store" })
      const projectsData = projectsRes.ok ? await projectsRes.json() : []
      setProjects(projectsData)

      const activitiesRes = await fetch("/api/activities", { cache: "no-store" })
      const activitiesData = activitiesRes.ok ? await activitiesRes.json() : []
      setActivities(activitiesData)
    }
    fetchData()
  }, [isLoggedIn])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(
        projects.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
  }, [searchTerm, projects])

 
  if (!mounted || checkingAuth) return null
  if (!isLoggedIn) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex">
        <motion.main
          className="flex-1 transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <motion.header
            className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage your API keys and projects securely
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors">
                  <Filter className="w-5 h-5 text-gray-300" />
                </button>

                <button className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                <button
                  onClick={() => router.push("/dashboard/projects/new")}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-5 py-2 rounded-lg transition-all"
                >
                  + New Project
                </button>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Summary Boxes */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SummaryBoxes projects={projects} />
            </motion.div>

            {/* Recent Activity and Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Recent Activity
                  </h2>
                  <RecentActivity activities={activities.slice(0, 4)} />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Recent Projects
                  </h2>
                  <RecentProjects projects={filteredProjects.slice(0, 3)} />
                  {filteredProjects.length > 3 && (
                    <button
                      onClick={() => router.push("/dashboard/projects")}
                      className="mt-4 text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      View All Projects
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  )
}