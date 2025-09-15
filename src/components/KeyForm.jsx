"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Save, X, Key, Type, FileText, Plus, Trash2, Eye, EyeOff, Copy } from "lucide-react"
import toast from "react-hot-toast"

export default function KeyForm({ projectId, existingKey = null, onSuccess }) {
  const [keys, setKeys] = useState(
    existingKey
      ? [{ ...existingKey }]
      : [
          {
            name: "",
            key: "",
            value: "",
            type: "apikey",
            description: "",
          },
        ],
  )
  const [loading, setLoading] = useState(false)
  const [showValues, setShowValues] = useState({})
  const router = useRouter()

  const handleChange = (index, field, value) => {
    const updated = [...keys]
    updated[index][field] = value
    setKeys(updated)
  }

  const addMore = () => {
    setKeys([...keys, { name: "", key: "", value: "", type: "apikey", description: "" }])
  }

  const removeKey = (index) => {
    if (keys.length > 1) {
      const updated = keys.filter((_, i) => i !== index)
      setKeys(updated)
    }
  }

  const toggleShowValue = (index) => {
    setShowValues((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const handleSubmit = async () => {
    // Validate all keys
    for (let i = 0; i < keys.length; i++) {
      const keyObj = keys[i]
      if (!keyObj.name.trim() || !keyObj.value.trim()) {
        toast.error(`Key ${i + 1}: Name and value are required`)
        return
      }
    }

    setLoading(true)
    try {
      const payload = keys[0] // For single key edit, or first key for new

      const url = existingKey ? `/api/projects/${projectId}/keys/${existingKey._id}` : `/api/projects/${projectId}/keys`

      const res = await fetch(url, {
        method: existingKey ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(`Key ${existingKey ? "updated" : "added"} successfully`)
        onSuccess?.()
        router.refresh()
      } else {
        const error = await res.text()
        toast.error(error || "Failed to submit")
      }
    } catch (error) {
      console.error("Error saving key:", error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const keyTypes = [
    { value: "apikey", label: "API Key", color: "text-blue-400" },
    { value: "secret", label: "Secret", color: "text-red-400" },
    { value: "token", label: "Token", color: "text-green-400" },
    { value: "env", label: "Env Var", color: "text-purple-400" },
  ]

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {keys.map((keyObj, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 space-y-4"
          >
            {/* Header with key number and remove button */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Key {idx + 1}
              </h3>
              {!existingKey && keys.length > 1 && (
                <motion.button
                  onClick={() => removeKey(idx)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Type className="w-4 h-4" />
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Production API Key"
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={keyObj.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                />
              </div>

              {/* Key Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Key className="w-4 h-4" />
                  Key
                </label>
                <input
                  type="text"
                  placeholder="e.g., API_KEY"
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={keyObj.key}
                  onChange={(e) => handleChange(idx, "key", e.target.value)}
                />
              </div>

              {/* Value Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Key className="w-4 h-4" />
                  Value
                </label>
                <div className="relative">
                  <input
                    type={showValues[idx] ? "text" : "password"}
                    placeholder="Enter key value"
                    className="w-full p-3 pr-20 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                    value={keyObj.value}
                    onChange={(e) => handleChange(idx, "value", e.target.value)}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleShowValue(idx)}
                      className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    >
                      {showValues[idx] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {keyObj.value && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(keyObj.value)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Type Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Type className="w-4 h-4" />
                  Type
                </label>
                <select
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={keyObj.type}
                  onChange={(e) => handleChange(idx, "type", e.target.value)}
                >
                  {keyTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-gray-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                placeholder="Describe what this key is used for..."
                rows={2}
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                value={keyObj.description}
                onChange={(e) => handleChange(idx, "description", e.target.value)}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add More Button */}
      {!existingKey && (
        <motion.button
          onClick={addMore}
          className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all duration-200 border border-blue-400/20 hover:border-blue-400/40"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Add More Keys
        </motion.button>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700/50">
        <motion.button
          type="button"
          onClick={() => onSuccess?.()}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4" />
          Cancel
        </motion.button>

        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : existingKey ? "Update Key" : "Add Keys"}
        </motion.button>
      </div>
    </div>
  )
}
