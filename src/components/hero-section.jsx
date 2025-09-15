"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -120])
  const yText = useTransform(scrollYProgress, [0, 1], [0, -40])
  const opacityTitle = useTransform(scrollYProgress, [0, 0.6], [1, 0.6])

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Parallax BG layers */}
      <motion.div
        aria-hidden="true"
        style={{ y: ySlow }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_-10%,rgba(59,130,246,0.12),transparent),radial-gradient(50rem_35rem_at_90%_-20%,rgba(168,85,247,0.10),transparent)]"
      />
      <div className="relative mx-auto max-w-5xl px-4 pt-28 pb-28">
        <motion.h1
          style={{ y: yText, opacity: opacityTitle }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-balance text-center text-4xl font-bold leading-tight md:text-6xl"
        >
          Your API keys deserve a safe home.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Keep them secure with KeyLoopr.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto mt-5 max-w-2xl text-center text-gray-300"
        >
          Centralize, manage, and rotate API keys with confidence. Role-based permissions, activity tracking, and
          seamless team collaboration—wrapped in a beautiful dark interface.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Link
            href="/dashboard"
            className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-medium shadow-lg shadow-blue-900/30 hover:brightness-110 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="#learn-more"
            className="rounded-full bg-gray-800/60 px-6 py-3 text-sm text-gray-200 ring-1 ring-gray-700/60 hover:bg-gray-700/60 transition"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Decorative particles */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-10 top-16 h-1 w-1 rounded-full bg-blue-400/70 blur-[1px]" />
          <div className="absolute right-24 top-28 h-1 w-1 rounded-full bg-purple-400/70 blur-[1px]" />
          <div className="absolute left-1/3 bottom-10 h-1 w-1 rounded-full bg-blue-300/60 blur-[1px]" />
        </div>
      </div>
    </section>
  )
}
