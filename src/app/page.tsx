import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  const categories = [
    ["Part-Time Jobs", "Flexible college-friendly shifts", "⚡"],
    ["Full-Time Jobs", "Start your professional journey", "💼"],
    ["Internships", "Learn, build, and grow faster", "🎓"],
    ["Freelancing", "Earn with your skills", "🚀"],
    ["WFH Jobs", "Remote work from anywhere", "🏠"],
    ["Nearby Jobs", "Local opportunities around you", "📍"],
    ["Urgent Hiring", "Quick joining roles", "🔥"],
    ["Daily Task Jobs", "Short tasks. Fast income.", "✅"],
  ];

  const stats = [
    ["10K+", "Active Jobs"],
    ["5K+", "Students"],
    ["1K+", "Employers"],
    ["98%", "Smart Match"],
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <Navbar />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 animate-pulse rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute right-[-8%] top-[12%] h-[28rem] w-[28rem] animate-pulse rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[35%] h-[30rem] w-[30rem] animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-28 text-center">
        <div className="soft-glow rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold text-blue-100 backdrop-blur-xl">
          AI Powered Hiring Platform · Study. Work. Grow.
        </div>

        <h1 className="mt-8 max-w-6xl text-5xl font-black leading-tight tracking-tight md:text-8xl">
          Find Work Faster With{" "}
          <span className="gradient-text">KarrierHub AI.</span>
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
          Students, freshers aur local workers ke liye AI job matching,
          verified recruiters, instant chat, premium unlocks aur smart hiring
          tools — sab ek powerful platform me.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/student/login" className="primary-btn">
            Find Jobs Now
          </Link>

          <Link
            href="/employer/login"
            className="rounded-2xl border border-white/15 bg-white/10 px-8 py-4 font-extrabold text-white backdrop-blur-xl hover:bg-white/15"
          >
            Hire Talent
          </Link>
        </div>
          

        <div className="relative mt-16 w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-blue-950/40 backdrop-blur-2xl md:p-6">
          <div className="absolute -top-4 left-8 rounded-full border border-green-400/30 bg-green-500/15 px-4 py-2 text-xs font-bold text-green-300 backdrop-blur">
            ● Live AI Matching
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-left">
              <p className="text-sm font-bold text-blue-300">Student Match</p>
              <h3 className="mt-3 text-4xl font-black">96%</h3>
              <p className="mt-3 text-gray-400">
                AI ranks jobs by skills, location and experience.
              </p>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-left">
              <p className="text-sm font-bold text-purple-300">
                Employer Intelligence
              </p>
              <h3 className="mt-3 text-4xl font-black">Top 5</h3>
              <p className="mt-3 text-gray-400">
                Auto-shortlist candidates using smart score.
              </p>
              <div className="mt-6 grid grid-cols-5 gap-2">
                {[90, 80, 72, 64, 56].map((height) => (
                  <div
                    key={height}
                    className="rounded-full bg-gradient-to-t from-purple-600 to-blue-400"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-left">
              <p className="text-sm font-bold text-green-300">
                Verified Hiring
              </p>
              <h3 className="mt-3 text-4xl font-black">Secure</h3>
              <p className="mt-3 text-gray-400">
                Admin approval, recruiter verification and safe chat monitoring.
              </p>
              <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-500/10 p-4 text-green-300">
                ✅ Trusted Platform Flow
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid w-full max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(([number, label]) => (
            <div key={label} className="premium-card rounded-3xl p-6">
              <h3 className="text-4xl font-black text-blue-300">{number}</h3>
              <p className="mt-2 text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-4">
          {categories.map(([title, subtitle, icon]) => (
            <div
              key={title}
              className="premium-card group rounded-3xl p-6 text-left"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl group-hover:scale-110">
                {icon}
              </div>

              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 mb-20 w-full max-w-5xl rounded-[2rem] border border-blue-400/20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 p-8 backdrop-blur-2xl">
          <h2 className="text-3xl font-black md:text-5xl">
            Ready to build your career?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            KarrierHub helps students find real work and helps recruiters hire
            faster with AI.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/student/signup" className="primary-btn">
              Join as Student
            </Link>

            <Link
              href="/employer/login"
              className="rounded-2xl border border-white/15 bg-white/10 px-8 py-4 font-extrabold hover:bg-white/15"
            >
              Start Hiring
            </Link>
          </div>
        </div>
        <footer className="w-full border-t border-white/10 py-16">
  <div className="mx-auto max-w-7xl px-6">

    <div className="grid gap-10 md:grid-cols-4">

      <div>
        <h3 className="text-3xl font-black">
          Karrier<span className="text-blue-500">Hub</span>
        </h3>

        <p className="mt-4 text-gray-400">
          AI-powered hiring platform helping students find jobs and employers hire faster.
        </p>
      </div>

      <div>
        <h4 className="mb-4 text-lg font-bold">
          Company
        </h4>

        <div className="space-y-2">
          <Link href="/about" className="block text-gray-400 hover:text-white">
            About Us
          </Link>

          <Link href="/contact" className="block text-gray-400 hover:text-white">
            Contact Us
          </Link>
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-lg font-bold">
          Legal
        </h4>

        <div className="space-y-2">
          <Link href="/privacy-policy" className="block text-gray-400 hover:text-white">
            Privacy Policy
          </Link>

          <Link href="/terms-and-conditions" className="block text-gray-400 hover:text-white">
            Terms & Conditions
          </Link>
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-lg font-bold">
          Quick Links
        </h4>

        <div className="space-y-2">
          <Link href="/student/signup" className="block text-gray-400 hover:text-white">
            Student Signup
          </Link>

          <Link href="/employer/login" className="block text-gray-400 hover:text-white">
            Employer Login
          </Link>
        </div>
      </div>

    </div>

    <div className="mt-10 border-t border-white/10 pt-6 text-center text-gray-500">
      © 2026 KarrierHub. All Rights Reserved.
    </div>

  </div>
</footer>
      </section>
    </main>
  );
}