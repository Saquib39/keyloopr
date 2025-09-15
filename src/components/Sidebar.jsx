"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { House, LayoutDashboard, FolderOpen, UserPlus, Plus, Menu, X, ChevronRight, BarChart3 } from "lucide-react"

const menuItems = [
  { icon: House, label: "Home", href: "/" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, label: "Projects", href: "/dashboard/projects" },
  { icon: UserPlus, label: "Invites", href: "/dashboard/invites" },
  { icon: Plus, label: "Create Project", href: "/dashboard/projects/new" },
]


export default function Sidebar({ isOpen, setIsOpen }) {
  const [hoveredItem, setHoveredItem] = useState(null)

  const pathname = usePathname()

  // 🔐 user state
  const [user, setUser] = useState ( null )
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (!res.ok) throw new Error("Not logged in")
        const data = await res.json()
        if (data.user) setUser(data.user)
      } catch {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 z-50 p-2 bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 rounded-lg transition-all duration-300 ${
          isOpen ? "left-60" : "left-6"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 backdrop-blur-xl z-40"
      >
        <div className="p-6">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === item.href || pathname.startsWith(item.href + "/")

  return (
    <motion.div
      key={item.label}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      onHoverStart={() => setHoveredItem(index)}
      onHoverEnd={() => setHoveredItem(null)}
    >
      <Link href={item.href}>
        <button
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300"
              : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
          }`}
        >
          <item.icon
            className={`w-5 h-5 transition-transform duration-200 ${
              hoveredItem === index ? "scale-110" : ""
            }`}
          />
          <span className="font-medium">{item.label}</span>
          {isActive && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </button>
      </Link>
    </motion.div>
  )
})}

          </nav>

          {/* User Profile */}
          <motion.div
            className="absolute bottom-6 left-6 right-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {user?.username || "Guest"}
                  </p>
                 
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  )
}
