"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

const navItems = [
  { label: "HOME", href: "/" },
  { label: "DASHBOARD", href: "/dashboard" },
  { label: "ABOUT", href: "/about" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  // ✅ Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Fetch login status
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (!res.ok) throw new Error("Not logged in")
        const data = await res.json()
        setIsLoggedIn(data.isLoggedIn)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkLogin()
  }, [])

  // ✅ Logout logic
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch {}
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    router.push("/login")
  }

  // ✅ Scroll shrink animation
  const y = useMotionValue(0)
  const smoothY = useSpring(y, { stiffness: 150, damping: 25, mass: 0.5 })
  const headerY = useTransform(smoothY, [0, 300], [0, -12])

  useEffect(() => {
    let raf
    const onScroll = () => {
      y.set(window.scrollY)
      setScrolled(window.scrollY > 16)
      raf = requestAnimationFrame(() => {})
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [y])

  const isActive = (href) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  if (!mounted) return null // ✅ Prevent hydration mismatch

  return (
    <motion.header style={{ y: headerY }} className="sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <motion.nav
          animate={{
            height: scrolled ? 52 : 72, // shrink height
            borderColor: scrolled ? "rgba(55,65,81,0.6)" : "rgba(55,65,81,0.35)",
            backgroundColor: scrolled ? "rgba(17,24,39,0.65)" : "rgba(17,24,39,0.45)",
            boxShadow: scrolled
              ? "0 6px 24px rgba(0,0,0,0.45)"
              : "0 4px 18px rgba(0,0,0,0.25)",
            paddingLeft: scrolled ? 10 : 18,
            paddingRight: scrolled ? 10 : 18,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="relative flex items-center justify-between rounded-full border backdrop-blur-xl transition-all"
          aria-label="Primary"
        >
          {/* Left: Logo */}
          <Link
            href="/"
            className="group relative inline-flex select-none items-center gap-2 rounded-full px-4 py-2"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 ring-2 ring-blue-500/30 group-hover:scale-105 transition-transform" />
            <span className="text-lg font-semibold tracking-wide">KeyLoopr</span>
          </Link>

          {/* Middle: Nav */}
          <ul className="hidden md:flex items-center gap-1 rounded-full bg-gray-800/40 p-1 ring-1 ring-gray-700/50">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Auth */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="rounded-full bg-gray-800/60 px-4 py-2 text-sm text-gray-200 ring-1 ring-gray-700/60 hover:bg-gray-700/60 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium shadow-lg shadow-blue-900/30 hover:brightness-110 transition"
              >
                Login
              </Link>
            )}
          </div>
        </motion.nav>
      </div>
    </motion.header>
  )
}
