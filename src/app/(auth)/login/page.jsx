"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "react-toastify"

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        // ✅ Save JWT in localStorage
        localStorage.setItem("token", data.token)
        toast.success("Welcome back!")
        router.push("/")
      } else {
        toast.error(data?.message || "Invalid credentials")
      }
    } catch (err) {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <section className="mx-auto flex min-h-dvh max-w-xl items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-xl shadow-2xl"
        >
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-white text-balance">Sign in to KeyLoopr</h1>
            <p className="mt-2 text-sm text-gray-400">Your API keys deserve a safe home.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-gray-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              disabled={loading}
              type="submit"
              className="group relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 font-medium text-white transition disabled:opacity-70"
            >
              <span className="relative">{loading ? "Signing in..." : "Sign in"}</span>
            </motion.button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition"
              >
                Register
              </Link>
            </div>
            <Link href="/" className="text-gray-400 hover:text-gray-200 transition">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
