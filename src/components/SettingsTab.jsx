"use client"
import { useState } from "react"
import React from "react"

import { motion } from "framer-motion"
import { Settings, Save, Trash2, LogOut, AlertTriangle, Shield, Users, Eye, Lock } from "lucide-react"

export default function SettingsTab({ project, isOwner, projectId }) {
  const [form, setForm] = useState({
    name: project.name,
    description: project.description,
    access: project.access,
    status: project.status,
  })

  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSaveChanges = async () => {
    if (!isOwner) {
      alert("Only the owner can update project settings.")
      return
    }

    setSaving(true)
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert("Project updated successfully")
    } else {
      alert("Failed to update project")
    }
    setSaving(false)
  }

  const handleLeaveProject = async () => {
    const confirmLeave = confirm("Are you sure you want to leave this project?")
    if (!confirmLeave) return

    const res = await fetch(`/api/projects/${projectId}/leave`, {
      method: "DELETE",
    })

    if (res.ok) {
      alert("Left project")
      window.location.href = "/dashboard/projects"
    } else {
      alert("Failed to leave project")
    }
  }

  const handleDeleteProject = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this project?")
    if (!confirmDelete) return

    const res = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      alert("Project deleted")
      window.location.href = "/dashboard/projects"
    } else {
      alert("Failed to delete project")
    }
  }

  const getAccessIcon = (access) => {
    return access === "team" ? Users : Shield
  }

  const getStatusIcon = (status) => {
    return status === "active" ? Eye : Lock
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Project Settings</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">General Settings</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isOwner}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={!isOwner}
              rows={4}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Describe your project"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Access Level</label>
              <div className="relative">
                <select
                  name="access"
                  value={form.access}
                  onChange={handleChange}
                  disabled={!isOwner}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                >
                  <option value="personal">Personal</option>
                  <option value="team">Team</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {React.createElement(getAccessIcon(form.access), { className: "w-4 h-4 text-gray-400" })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={!isOwner}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {React.createElement(getStatusIcon(form.status), { className: "w-4 h-4 text-gray-400" })}
                </div>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveChanges}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-red-500/5 backdrop-blur-sm rounded-xl border border-red-500/20 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          {!isOwner && (
            <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div>
                <h4 className="text-white font-medium">Leave Project</h4>
                <p className="text-gray-400 text-sm">Remove yourself from this project</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLeaveProject}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Leave Project
              </motion.button>
            </div>
          )}

          {isOwner && (
            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div>
                <h4 className="text-white font-medium">Delete Project</h4>
                <p className="text-gray-400 text-sm">Permanently delete this project and all its data</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteProject}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
