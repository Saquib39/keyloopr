"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Sparkles, Folder, Users, Settings } from "lucide-react"
import Link from "next/link"

export default function CreateNewProjectPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [access, setAccess] = useState("personal")
  const [status, setStatus] = useState("active")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/projects/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          access,
          status,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        alert("Project created successfully!")
        
        // Reset form
        setName("")
        setDescription("")
        setAccess("personal")
        setStatus("active")
      } else {
        const errorText = await res.text()
       
        alert("Error: " + errorText)
      }
    } catch (error) {
    
      alert("An error occurred while creating the project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create New Project
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Start building something amazing. Set up your project with the perfect configuration.
          </p>
        </motion.div>

        {/* Main Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Name */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <Folder className="w-4 h-4" />
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your project name..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <Sparkles className="w-4 h-4" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe what your project is about..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </motion.div>

            {/* Configuration Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Access Type */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <Users className="w-4 h-4" />
                  Access Type
                </label>
                <select
                  value={access}
                  onChange={(e) => setAccess(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="personal">Personal Project</option>
                  <option value="team">Team Project</option>
                </select>
              </motion.div>

              {/* Status */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <Settings className="w-4 h-4" />
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 pt-4"
            >
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Project...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Project
                  </div>
                )}
              </button>

              <Link
                href="/dashboard/projects"
                className="px-6 py-3 bg-gray-700/50 text-gray-300 font-medium rounded-xl hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </Link>
            </motion.div>
          </form>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          {[
            { icon: Folder, title: "Organized", desc: "Keep your projects structured" },
            { icon: Users, title: "Collaborative", desc: "Work with your team seamlessly" },
            { icon: Sparkles, title: "Powerful", desc: "Advanced features at your fingertips" },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl text-center"
            >
              <feature.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
