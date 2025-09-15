"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const features = [
  {
    title: "Secure by Design",
    desc: "Encrypted storage, access controls, and comprehensive audit logs.",
  },
  {
    title: "Team Collaboration",
    desc: "Invite teammates, assign roles, and manage projects effortlessly.",
  },
  {
    title: "Powerful Activity",
    desc: "Every action is tracked, so you know who did what and when.",
  },
  {
    title: "Fast & Intuitive",
    desc: "Beautiful, responsive UI that keeps you in flow.",
  },
]

export default function Features() {
  return (
    <section id="learn-more" className="relative z-10">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-semibold md:text-4xl"
        >
          Why KeyLoopr?
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-800/70 bg-gray-900/50 p-6 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-gray-300">{f.desc}</p>
              <div className="mt-4">
                <Link href="/dashboard/projects" className="text-sm text-blue-400 hover:text-blue-300">
                  Explore Projects →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra content to ensure scroll */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-2xl border border-gray-800/70 bg-gray-900/40 p-8 backdrop-blur-xl"
        >
          <h3 className="text-xl font-semibold">Built for developers and teams</h3>
          <p className="mt-2 max-w-3xl text-gray-300">
            KeyLoopr focuses on ergonomics, performance, and security. From personal projects to large teams, centralize
            your secrets with a frictionless workflow and modern UX. Rotate, revoke, invite, and collaborate—all in one
            place.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gray-800/70 px-3 py-1 text-xs text-gray-200 ring-1 ring-gray-700/60">
              RBAC
            </span>
            <span className="rounded-full bg-gray-800/70 px-3 py-1 text-xs text-gray-200 ring-1 ring-gray-700/60">
              Audit Logs
            </span>
            <span className="rounded-full bg-gray-800/70 px-3 py-1 text-xs text-gray-200 ring-1 ring-gray-700/60">
              Activity Feed
            </span>
            <span className="rounded-full bg-gray-800/70 px-3 py-1 text-xs text-gray-200 ring-1 ring-gray-700/60">
              Teams
            </span>
            <span className="rounded-full bg-gray-800/70 px-3 py-1 text-xs text-gray-200 ring-1 ring-gray-700/60">
              Projects
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
