import Navbar from "@/components/Navbar"
import Hero from "@/components/hero-section"
import Features from "@/components/feature-section"
import Footer from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen text-white bg-black">
      {/* Background gradient field */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      />
      <Navbar />
      <main>
        <Hero />
        <Features />
        {/* Extra section to ensure scroll and visual depth */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 pb-24">
            <div className="rounded-2xl border border-gray-800/70 bg-gray-900/40 p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-semibold">Works the way you do</h3>
              <p className="mt-2 max-w-3xl text-gray-300">
                Keep your keys safe, searchable, and shareable. KeyLoopr integrates into your daily workflow and scales
                from personal projects to enterprise teams with strong, practical security.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <li className="rounded-xl border border-gray-800/70 bg-gray-900/50 p-5">
                  <p className="text-sm text-gray-400">Visibility</p>
                  <p className="mt-1 font-medium">Project-level overview, quick filters, and activity trails</p>
                </li>
                <li className="rounded-xl border border-gray-800/70 bg-gray-900/50 p-5">
                  <p className="text-sm text-gray-400">Control</p>
                  <p className="mt-1 font-medium">Role-based access with invites and member management</p>
                </li>
                <li className="rounded-xl border border-gray-800/70 bg-gray-900/50 p-5">
                  <p className="text-sm text-gray-400">Confidence</p>
                  <p className="mt-1 font-medium">Audit everything with activity logging and timelines</p>
                </li>
                <li className="rounded-xl border border-gray-800/70 bg-gray-900/50 p-5">
                  <p className="text-sm text-gray-400">Speed</p>
                  <p className="mt-1 font-medium">Fast, responsive UI with a modern dark experience</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
