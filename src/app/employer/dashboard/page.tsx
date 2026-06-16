import Link from "next/link";

export default function EmployerDashboard() {
  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-3xl font-black">
          Work<span className="text-blue-500">Mitra</span>
        </Link>

        <h1 className="mt-10 text-4xl font-black">Employer Dashboard</h1>

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <Link
            href="/employer/company-profile"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-bold">Company Profile</h2>
            <p className="mt-2 text-gray-400">
              Manage company details.
            </p>
          </Link>

          <Link
            href="/employer/post-job"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-bold">Post Job</h2>
            <p className="mt-2 text-gray-400">
              Create a new job.
            </p>
          </Link>

          <Link
            href="/employer/jobs"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-bold">My Jobs</h2>
            <p className="mt-2 text-gray-400">
              Manage posted jobs.
            </p>
          </Link>

          <Link
            href="/employer/applicants"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-bold">Applicants</h2>
            <p className="mt-2 text-gray-400">
              Search and manage applicants.
            </p>
          </Link>

          <Link
            href="/employer/messages"
            className="rounded-3xl border border-purple-500/30 bg-purple-600/10 p-6 transition hover:bg-purple-600/20"
          >
            <h2 className="text-xl font-bold">Messages</h2>
            <p className="mt-2 text-gray-400">
              Chat with students.
            </p>
          </Link>

          <Link
            href="/employer/analytics"
            className="rounded-3xl border border-yellow-500/30 bg-yellow-600/10 p-6 transition hover:bg-yellow-600/20"
          >
            <h2 className="text-xl font-bold">Analytics 📊</h2>
            <p className="mt-2 text-gray-400">
              Track hiring performance.
            </p>
          </Link>

          <Link
            href="/employer/interview-generator"
            className="rounded-3xl border border-cyan-500/30 bg-cyan-600/10 p-6 transition hover:bg-cyan-600/20"
          >
            <h2 className="text-xl font-bold">
              AI Interview Generator 🤖
            </h2>

            <p className="mt-2 text-gray-400">
              Generate interview questions automatically.
            </p>
          </Link>

        </div>
      </div>
    </main>
  );
}