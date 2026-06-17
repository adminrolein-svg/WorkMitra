import Link from "next/link";

export default function StudentDashboard() {
  const cards = [
    {
      href: "/student/jobs",
      title: "Find Jobs",
      desc: "Browse verified jobs and apply instantly.",
      icon: "🚀",
      tag: "Live",
      style: "from-blue-600/30 to-cyan-500/10 border-blue-400/30",
    },
    {
      href: "/student/recommendations",
      title: "AI Recommendations",
      desc: "Jobs ranked by your skills and profile.",
      icon: "🤖",
      tag: "AI Match",
      style: "from-purple-600/30 to-blue-500/10 border-purple-400/30",
    },
    {
      href: "/student/nearby-jobs",
      title: "Nearby Jobs",
      desc: "Find opportunities around your location.",
      icon: "📍",
      tag: "Local",
      style: "from-orange-600/30 to-yellow-500/10 border-orange-400/30",
    },
    {
      href: "/student/applications",
      title: "My Applications",
      desc: "Track applied, shortlisted and accepted jobs.",
      icon: "📄",
      tag: "Tracker",
      style: "from-green-600/30 to-emerald-500/10 border-green-400/30",
    },
    {
      href: "/student/messages",
      title: "Messages",
      desc: "Chat with recruiters after unlock.",
      icon: "💬",
      tag: "Chat",
      style: "from-indigo-600/30 to-purple-500/10 border-indigo-400/30",
    },
    {
      href: "/student/saved-jobs",
      title: "Saved Jobs",
      desc: "Your bookmarked opportunities.",
      icon: "❤️",
      tag: "Saved",
      style: "from-pink-600/30 to-rose-500/10 border-pink-400/30",
    },
    {
      href: "/student/notifications",
      title: "Notifications",
      desc: "Application and platform updates.",
      icon: "🔔",
      tag: "Updates",
      style: "from-yellow-600/30 to-orange-500/10 border-yellow-400/30",
    },
    {
      href: "/student/profile",
      title: "My Profile",
      desc: "Improve skills, location and preferences.",
      icon: "👤",
      tag: "Profile",
      style: "from-slate-600/30 to-blue-500/10 border-white/20",
    },
  ];

  const stats = [
    ["AI Match", "96%", "text-cyan-300"],
    ["Verified Jobs", "10K+", "text-blue-300"],
    ["Fast Apply", "1 Tap", "text-green-300"],
    ["Career Boost", "24/7", "text-purple-300"],
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-8rem] h-96 w-96 animate-pulse rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute right-[-8rem] top-32 h-[28rem] w-[28rem] animate-pulse rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-3xl font-black tracking-tight">
            Work<span className="text-blue-400">Mitra</span>
          </Link>

          <Link
            href="/student/jobs"
            className="rounded-2xl bg-white px-5 py-3 font-black text-black hover:scale-105"
          >
            Start Applying →
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-blue-950/40 backdrop-blur-2xl md:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200">
                ⚡ Student Career Command Center
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
                Find Jobs That{" "}
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  Actually Match You.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
                AI recommendations, nearby jobs, saved jobs, recruiter chat,
                application tracking aur verified opportunities — sab ek smart
                dashboard me.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/student/recommendations"
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-black shadow-lg shadow-blue-600/30 hover:scale-105"
                >
                  🤖 View AI Matches
                </Link>

                <Link
                  href="/student/profile"
                  className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black backdrop-blur hover:bg-white/15"
                >
                  Upgrade Profile
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6">
              <p className="text-sm font-bold text-gray-400">Today’s AI Boost</p>

              <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-cyan-200">Profile Strength</p>
                  <p className="text-3xl font-black text-cyan-300">87%</p>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" />
                </div>

                <p className="mt-4 text-sm text-gray-300">
                  Add more skills to unlock better AI recommendations.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-2xl font-black text-green-300">Fast</p>
                  <p className="text-sm text-gray-400">Quick apply system</p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-2xl font-black text-purple-300">Smart</p>
                  <p className="text-sm text-gray-400">AI ranked jobs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {stats.map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/10"
            >
              <h2 className={`text-4xl font-black ${color}`}>{value}</h2>
              <p className="mt-2 text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative overflow-hidden rounded-[1.7rem] border bg-gradient-to-br ${card.style} p-6 shadow-xl shadow-black/25 backdrop-blur-xl transition hover:-translate-y-2 hover:shadow-blue-950/40`}
            >
              <div className="absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-white/10 blur-2xl transition group-hover:scale-150" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-inner">
                    {card.icon}
                  </div>

                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-gray-200">
                    {card.tag}
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-black">{card.title}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-300">
                  {card.desc}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-200">
                    Open
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-cyan-600/15 p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black">
                Ready for your next opportunity?
              </h2>
              <p className="mt-2 text-gray-300">
                Complete profile → Get AI matches → Apply faster → Chat with
                recruiters.
              </p>
            </div>

            <Link
              href="/student/jobs"
              className="rounded-2xl bg-white px-6 py-4 font-black text-black hover:scale-105"
            >
              Explore Jobs
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}