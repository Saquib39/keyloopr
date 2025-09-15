"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-800/70 bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 ring-2 ring-blue-500/30" />
            <span className="text-lg font-semibold">KeyLoopr</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-300">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
          </nav>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} KeyLoopr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
