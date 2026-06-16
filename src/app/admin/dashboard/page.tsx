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
      .update({
        approval_status: "approved",
        status: "open",
      })
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
      .update({
        approval_status: "rejected",
        status: "closed",
      })
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
      <main className="min-h-screen bg-black p-6 text-white">
        Loading admin dashboard...
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <h1 className="text-4xl font-black">Access Denied</h1>
        <p className="mt-2 text-gray-400">Only admins can access this page.</p>
        <Link href="/" className="mt-6 inline-block text-blue-400">
          Go Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-3xl font-black">
          Work<span className="text-blue-500">Mitra</span>
        </Link>

        <h1 className="mt-10 text-4xl font-black">Admin Dashboard</h1>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Link href="/admin/recruiters" className="rounded-3xl border border-green-500/30 bg-green-600/10 p-6 transition hover:bg-green-600/20">
            <h2 className="text-xl font-bold">Recruiter Verification ✅</h2>
            <p className="mt-2 text-gray-400">Approve or reject recruiter profiles.</p>
          </Link>

          <Link href="/admin/jobs" className="rounded-3xl border border-blue-500/30 bg-blue-600/10 p-6 transition hover:bg-blue-600/20">
            <h2 className="text-xl font-bold">Admin Jobs</h2>
            <p className="mt-2 text-gray-400">Approve, reject, add or delete jobs.</p>
          </Link>

          <Link href="/admin/chats" className="rounded-3xl border border-purple-500/30 bg-purple-600/10 p-6 transition hover:bg-purple-600/20">
            <h2 className="text-xl font-bold">Admin Chat View</h2>
            <p className="mt-2 text-gray-400">View platform messages for safety.</p>
          </Link>

          <Link href="/admin/feedback" className="rounded-3xl border border-yellow-500/30 bg-yellow-600/10 p-6 transition hover:bg-yellow-600/20">
            <h2 className="text-xl font-bold">Feedback</h2>
            <p className="mt-2 text-gray-400">Review platform feedback.</p>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Stat title="Users" value={stats.profiles} color="text-blue-400" />
          <Stat title="Recruiters" value={stats.recruiters} color="text-green-400" />
          <Stat title="Total Jobs" value={stats.jobs} color="text-white" />
          <Stat title="Pending Jobs" value={stats.pendingJobs} color="text-yellow-400" />
          <Stat title="Approved Jobs" value={stats.approvedJobs} color="text-green-400" />
          <Stat title="Applications" value={stats.applications} color="text-purple-400" />
          <Stat title="Messages" value={stats.messages} color="text-pink-400" />
        </div>

        <h2 className="mt-12 text-3xl font-black">Latest Jobs</h2>

        <div className="mt-6 grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{job.job_position}</h3>
                  <p className="mt-2 text-gray-400">
                    {job.employer_name} · {job.job_location} · {job.salary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-lg bg-blue-600 px-3 py-1 font-bold">
                      Status: {job.status}
                    </span>

                    <span className="rounded-lg bg-yellow-600 px-3 py-1 font-bold">
                      Approval: {job.approval_status || "pending"}
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
                  <button onClick={() => approveJob(job.id)} className="rounded-xl bg-green-600 px-4 py-2 font-bold">
                    Approve
                  </button>

                  <button onClick={() => rejectJob(job.id)} className="rounded-xl bg-yellow-500 px-4 py-2 font-bold text-black">
                    Reject
                  </button>

                  <button onClick={() => deleteJob(job.id)} className="rounded-xl bg-red-600 px-4 py-2 font-bold">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-gray-400">No jobs found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className={`text-3xl font-black ${color}`}>{value}</h2>
      <p className="mt-2 text-gray-400">{title}</p>
    </div>
  );
}