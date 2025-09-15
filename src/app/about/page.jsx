"use client"

import Navbar from "@/components/Navbar"
import { motion } from "framer-motion"
import Link from "next/link"

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
     <Navbar />
      {/* Header */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-6">
          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeIn}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-3 inline-block rounded-full border border-gray-700/50 bg-gray-800/50 px-3 py-1 text-xs text-gray-300"
          >
            About KeyLoopr
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeIn}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="text-pretty text-4xl font-semibold md:text-5xl"
          >
            Give your API keys a safe home
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              — KeyLoopr
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeIn}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 max-w-2xl text-gray-300 leading-relaxed"
          >
            KeyLoopr is a secure, collaborative workspace for managing API keys, secrets, and access across teams and
            projects. Built for developers, with security-first defaults, effortless sharing, and beautiful, responsive
            UI.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-6 flex items-center gap-3"
          >
            <Link
              href="/dashboard"
              className="rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium transition hover:opacity-90"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/dashboard/projects"
              className="rounded-md border border-gray-700/50 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
            >
              View Projects
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { label: "Projects secured", value: "100+" },
            { label: "API keys managed", value: "1k+" },
            { label: "Teams collaborating", value: "50+" },
            { label: "Avg. setup time", value: "< 3 min" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4 backdrop-blur-xl">
              <p className="text-sm text-gray-400">{s.label}</p>
              <p className="mt-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-semibold text-transparent">
                {s.value}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Why KeyLoopr */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-pretty text-2xl font-semibold"
        >
          Why developers choose
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> KeyLoopr</span>
        </motion.h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {[
            {
              title: "Security-first",
              desc: "Encrypted at rest and in transit. Scoped access, audit logs, and role-based permissions prevent accidental exposure.",
            },
            {
              title: "Team-ready",
              desc: "Invite members, assign roles, and manage access per project. Keep personal and team spaces separate and safe.",
            },
            {
              title: "Developer UX",
              desc: "Keyboard-friendly, fast, and delightful. Copy, rotate, and revoke keys with smooth, accessible interactions.",
            },
            {
              title: "Observability",
              desc: "Recent activity timelines and key usage insights help you track changes and detect anomalies faster.",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-pretty text-2xl font-semibold"
        >
          How KeyLoopr works
        </motion.h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {[
            {
              step: "1",
              title: "Create a project",
              desc: "Spin up personal or team projects. Each project has isolated keys, members, and activity.",
            },
            {
              step: "2",
              title: "Add your keys",
              desc: "Store API keys and secrets securely. Tag by type, add descriptions, and rotate safely.",
            },
            {
              step: "3",
              title: "Collaborate & audit",
              desc: "Invite teammates with roles, track changes in activity, and keep access under control.",
            },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="relative rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 backdrop-blur-xl"
            >
              <div className="absolute -top-3 left-5 rounded-full border border-gray-700/50 bg-gray-900 px-2 py-0.5 text-xs text-gray-300">
                Step {s.step}
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-pretty text-2xl font-semibold"
        >
          Our values
        </motion.h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Trust",
              desc: "Security isn’t a feature, it’s a foundation. We design to prevent leaks and reduce blast radius.",
            },
            {
              title: "Clarity",
              desc: "Minimal, purposeful design. Everything you need, clearly visible—nothing you don’t.",
            },
            {
              title: "Speed",
              desc: "Fast to navigate, easy to manage, delightful to use—so you can ship with confidence.",
            },
          ].map((v) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 text-center backdrop-blur-xl"
        >
          <h3 className="text-pretty text-2xl font-semibold">
            Ready to secure your API keys with
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              KeyLoopr
            </span>
            ?
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-300 leading-relaxed">
            Create a project in minutes, invite your team, and manage secrets with confidence.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/dashboard/create-project"
              className="rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium transition hover:opacity-90"
            >
              Create Project
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-gray-700/50 bg-gray-900/50 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
