import Link from "next/link";

export default function StudentDashboard() {
  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-3xl font-black">
          Work<span className="text-blue-500">Mitra</span>
        </Link>

        <h1 className="mt-10 text-4xl font-black">Student Dashboard</h1>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/student/jobs"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-bold">Find Jobs</h2>
            <p className="mt-2 text-gray-400">Browse latest jobs.</p>
          </Link>

          <Link
            href="/student/nearby-jobs"
            className="rounded-3xl border border-orange-500/30 bg-orange-600/10 p-6 transition hover:bg-orange-600/20"
          >
            <h2 className="text-xl font-bold">Nearby Jobs 📍</h2>
            <p className="mt-2 text-gray-400">
              Find jobs near your location.
            </p>
          </Link>

          <Link
            href="/student/recommendations"
            className="rounded-3xl border border-blue-500/30 bg-blue-600/10 p-6 transition hover:bg-blue-600/20"
          >
            <h2 className="text-xl font-bold">AI Recommendations</h2>
            <p className="mt-2 text-gray-400">Jobs matched for you.</p>
          </Link>

          <Link
            href="/student/profile"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-bold">My Profile</h2>
            <p className="mt-2 text-gray-400">Manage skills.</p>
          </Link>

          <Link
            href="/student/applications"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-bold">My Applications</h2>
            <p className="mt-2 text-gray-400">Track applications.</p>
          </Link>

          <Link
            href="/student/notifications"
            className="rounded-3xl border border-green-500/30 bg-green-600/10 p-6 transition hover:bg-green-600/20"
          >
            <h2 className="text-xl font-bold">Notifications</h2>
            <p className="mt-2 text-gray-400">Status updates.</p>
          </Link>

          <Link
            href="/student/messages"
            className="rounded-3xl border border-purple-500/30 bg-purple-600/10 p-6 transition hover:bg-purple-600/20"
          >
            <h2 className="text-xl font-bold">Messages</h2>
            <p className="mt-2 text-gray-400">Chat with employers.</p>
          </Link>

          <Link
            href="/student/saved-jobs"
            className="rounded-3xl border border-pink-500/30 bg-pink-600/10 p-6 transition hover:bg-pink-600/20"
          >
            <h2 className="text-xl font-bold">Saved Jobs ❤️</h2>
            <p className="mt-2 text-gray-400">
              View your bookmarked jobs.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}