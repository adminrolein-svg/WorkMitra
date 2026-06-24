"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Job = {
  id: string;
  job_position: string;
  employer_name: string;
  job_location: string;
  salary: string;
  status: string;
  approval_status: string | null;
  auto_approved: boolean | null;
  posted_by_admin: boolean | null;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [stats, setStats] = useState({
    profiles: 0,
    jobs: 0,
    pendingJobs: 0,
    approvedJobs: 0,
    applications: 0,
    messages: 0,
    recruiters: 0,
  });

  const [jobs, setJobs] = useState<Job[]>([]);

  async function loadAdminData() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { data: adminData } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!adminData) {
      alert("You are not admin");
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    const [
      { count: profilesCount },
      { count: jobsCount },
      { count: pendingJobsCount },
      { count: approvedJobsCount },
      { count: applicationsCount },
      { count: messagesCount },
      { count: recruitersCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("approval_status", "approved"),
      supabase.from("applications").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("company_profiles").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      profiles: profilesCount || 0,
      jobs: jobsCount || 0,
      pendingJobs: pendingJobsCount || 0,
      approvedJobs: approvedJobsCount || 0,
      applications: applicationsCount || 0,
      messages: messagesCount || 0,
      recruiters: recruitersCount || 0,
    });

    const { data: jobsData } = await supabase
      .from("jobs")
      .select(
        "id, job_position, employer_name, job_location, salary, status, approval_status, auto_approved, posted_by_admin"
      )
      .order("created_at", { ascending: false });

    setJobs((jobsData || []) as Job[]);
    setLoading(false);
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function approveJob(id: string) {
    const { error } = await supabase
      .from("jobs")
      .update({ approval_status: "approved", status: "open" })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Job approved");
    loadAdminData();
  }

  async function rejectJob(id: string) {
    const { error } = await supabase
      .from("jobs")
      .update({ approval_status: "rejected", status: "closed" })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Job rejected");
    loadAdminData();
  }

  async function deleteJob(id: string) {
    const ok = confirm("Delete this job?");
    if (!ok) return;

    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Job deleted");
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] p-6 text-white">
        Loading admin dashboard...
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#020617] p-6 text-white">
        <h1 className="text-4xl font-black">Access Denied</h1>
        <p className="mt-2 text-gray-400">Only admins can access this page.</p>
        <Link href="/" className="mt-6 inline-block text-blue-400">
          Go Home
        </Link>
      </main>
    );
  }

  const actionCards = [
    {
      href: "/admin/recruiters",
      title: "Recruiter Verification",
      desc: "Approve or reject recruiter profiles.",
      icon: "✅",
      color: "from-green-600/30 to-emerald-500/10 border-green-400/30",
    },
    {
      href: "/admin/jobs",
      title: "Admin Jobs",
      desc: "Approve, reject, add or delete jobs.",
      icon: "🧠",
      color: "from-blue-600/30 to-cyan-500/10 border-blue-400/30",
    },
    {
      href: "/admin/post-job",
      title: "Post Platform Job",
      desc: "Admin ke naam se platform job post karo.",
      icon: "🚀",
      color: "from-cyan-600/30 to-blue-500/10 border-cyan-400/30",
    },
    {
      href: "/admin/chats",
      title: "Chat Monitoring",
      desc: "Platform messages safety ke liye view karo.",
      icon: "🛡️",
      color: "from-purple-600/30 to-indigo-500/10 border-purple-400/30",
    },
    {
      href: "/admin/feedback",
      title: "Feedback",
      desc: "Platform feedback aur ratings review karo.",
      icon: "⭐",
      color: "from-yellow-600/30 to-orange-500/10 border-yellow-400/30",
    },
  ];

  const statCards = [
    ["Users", stats.profiles, "👥", "text-blue-300"],
    ["Recruiters", stats.recruiters, "🏢", "text-green-300"],
    ["Total Jobs", stats.jobs, "💼", "text-white"],
    ["Pending Jobs", stats.pendingJobs, "⏳", "text-yellow-300"],
    ["Approved Jobs", stats.approvedJobs, "✅", "text-green-300"],
    ["Applications", stats.applications, "📄", "text-purple-300"],
    ["Messages", stats.messages, "💬", "text-pink-300"],
  ];

  const latestJobs = jobs.slice(0, 8);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-8rem] h-96 w-96 animate-pulse rounded-full bg-red-600/25 blur-3xl" />
        <div className="absolute right-[-8rem] top-32 h-[28rem] w-[28rem] animate-pulse rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-3xl font-black tracking-tight">
            Work<span className="text-blue-400">Mitra</span>
          </Link>

          <Link
            href="/admin/post-job"
            className="rounded-2xl bg-white px-5 py-3 font-black text-black hover:scale-105"
          >
            Post Platform Job →
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-red-950/30 backdrop-blur-2xl md:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200">
                👑 Platform Control Center
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
                Control The Entire{" "}
                <span className="bg-gradient-to-r from-red-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
                  KarrierHub System.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
                Recruiter verification, job approvals, platform jobs, chat
                monitoring, feedback aur live stats — sab ek premium admin
                command center me.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/admin/jobs"
                  className="rounded-2xl bg-gradient-to-r from-red-600 to-purple-600 px-6 py-4 font-black shadow-lg shadow-red-600/30 hover:scale-105"
                >
                  Review Jobs
                </Link>

                <Link
                  href="/admin/recruiters"
                  className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 font-black backdrop-blur hover:bg-white/15"
                >
                  Verify Recruiters
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6">
              <p className="text-sm font-bold text-gray-400">
                Live Approval Health
              </p>

              <div className="mt-5 rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-yellow-200">Pending Jobs</p>
                  <p className="text-4xl font-black text-yellow-300">
                    {stats.pendingJobs}
                  </p>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-400"
                    style={{
                      width: `${Math.min(
                        100,
                        stats.jobs === 0 ? 0 : Math.round((stats.pendingJobs / stats.jobs) * 100)
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-4 text-sm text-gray-300">
                  Pending queue ko clear rakhna platform trust ke liye zaroori hai.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-2xl font-black text-green-300">
                    {stats.approvedJobs}
                  </p>
                  <p className="text-sm text-gray-400">Approved jobs</p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-2xl font-black text-pink-300">
                    {stats.messages}
                  </p>
                  <p className="text-sm text-gray-400">Messages tracked</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {statCards.map(([title, value, icon, color]) => (
            <div
              key={String(title)}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-400/40 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{icon}</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-gray-300">
                  Live
                </span>
              </div>
              <h2 className={`mt-5 text-4xl font-black ${color}`}>{value}</h2>
              <p className="mt-2 text-gray-400">{title}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {actionCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative overflow-hidden rounded-[1.7rem] border bg-gradient-to-br ${card.color} p-6 shadow-xl shadow-black/25 backdrop-blur-xl transition hover:-translate-y-2 hover:shadow-red-950/40`}
            >
              <div className="absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-white/10 blur-2xl transition group-hover:scale-150" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-inner">
                  {card.icon}
                </div>

                <h2 className="mt-6 text-xl font-black">{card.title}</h2>
                <p className="mt-2 min-h-14 text-sm leading-6 text-gray-300">
                  {card.desc}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-bold text-red-100">Open</span>
                  <span className="rounded-full bg-white/10 px-3 py-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Latest Jobs Queue</h2>
              <p className="mt-2 text-gray-400">
                Approve, reject, delete aur monitor latest platform jobs.
              </p>
            </div>

            <Link
              href="/admin/jobs"
              className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-black hover:bg-white/15"
            >
              View All Jobs
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {latestJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-3xl border border-white/10 bg-black/35 p-6 transition hover:border-red-400/30 hover:bg-white/[0.06]"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">{job.job_position}</h3>
                    <p className="mt-2 text-gray-400">
                      {job.employer_name} · {job.job_location} · {job.salary}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-lg bg-blue-600 px-3 py-1 font-bold">
                        {job.status}
                      </span>

                      <span
                        className={`rounded-lg px-3 py-1 font-bold ${
                          job.approval_status === "approved"
                            ? "bg-green-600"
                            : job.approval_status === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {job.approval_status || "pending"}
                      </span>

                      {job.auto_approved && (
                        <span className="rounded-lg bg-green-600 px-3 py-1 font-bold">
                          ₹100 Auto Approved
                        </span>
                      )}

                      {job.posted_by_admin && (
                        <span className="rounded-lg bg-purple-600 px-3 py-1 font-bold">
                          Platform Job
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => approveJob(job.id)}
                      className="rounded-xl bg-green-600 px-4 py-2 font-bold hover:bg-green-500"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectJob(job.id)}
                      className="rounded-xl bg-yellow-500 px-4 py-2 font-bold text-black hover:bg-yellow-400"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => deleteJob(job.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 font-bold hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {latestJobs.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-black/35 p-6">
                <p className="text-gray-400">No jobs found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}