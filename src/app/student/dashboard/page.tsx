"use client";

import Link from "next/link";
import CountUp from "react-countup";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const cards = [
    ["🚀", "Find Jobs", "Browse verified jobs.", "/student/jobs", "Live"],
    ["🤖", "AI Recommendations", "Jobs matched for you.", "/student/recommendations", "AI"],
    ["📍", "Nearby Jobs", "Jobs around your location.", "/student/nearby-jobs", "Local"],
    ["📄", "My Applications", "Track job status.", "/student/applications", "Track"],
    ["💬", "Messages", "Chat with employers.", "/student/messages", "Chat"],
    ["❤️", "Saved Jobs", "Bookmarked jobs.", "/student/saved-jobs", "Saved"],
    ["🔔", "Notifications", "Important updates.", "/student/notifications", "Updates"],
    ["👤", "My Profile", "Improve your profile.", "/student/profile", "Profile"],
  ];

  const stats = [
    ["AI Match", 96, "%", "text-cyan-300"],
    ["Verified Jobs", 10000, "+", "text-blue-300"],
    ["Fast Apply", 1, " Tap", "text-green-300"],
    ["Career Boost", 24, "/7", "text-purple-300"],
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] p-6 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-96 w-96 animate-pulse rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute right-[-8rem] top-32 h-[28rem] w-[28rem] animate-pulse rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-7xl"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-black">
            Work<span className="text-blue-400">Mitra</span>
          </Link>

          <Link href="/student/jobs" className="rounded-2xl bg-white px-5 py-3 font-black text-black hover:scale-105">
            Start Applying →
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-blue-950/40 backdrop-blur-2xl">
          <p className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200">
            ⚡ Student Career Command Center
          </p>

          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
            Find Jobs That{" "}
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Actually Match You.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
            AI recommendations, nearby jobs, saved jobs, recruiter chat aur application tracking — sab ek smart dashboard me.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/student/recommendations" className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-black shadow-lg shadow-blue-600/30 hover:scale-105">
              🤖 View AI Matches
            </Link>

            <Link href="/student/profile" className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black hover:bg-white/15">
              Upgrade Profile
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {stats.map(([label, value, suffix, color]) => (
            <motion.div
              key={String(label)}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
            >
              <h2 className={`text-4xl font-black ${color}`}>
                <CountUp end={Number(value)} duration={2} separator="," />
                {suffix}
              </h2>
              <p className="mt-2 text-gray-400">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map(([icon, title, desc, href, tag]) => (
            <motion.div
              key={href}
              variants={{
                hidden: { opacity: 0, y: 25 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10, scale: 1.025 }}
            >
              <Link
                href={href}
                className="group block h-full rounded-[1.7rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-6 shadow-xl shadow-black/25 backdrop-blur-xl hover:border-blue-400/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                    {icon}
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold">
                    {tag}
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-black">{title}</h2>
                <p className="mt-2 text-sm text-gray-300">{desc}</p>

                <div className="mt-6 flex justify-between">
                  <span className="text-sm font-bold text-blue-200">Open</span>
                  <span className="rounded-full bg-white/10 px-3 py-2 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}