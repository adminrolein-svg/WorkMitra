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
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [stats, setStats] = useState({
    profiles: 0,
    jobs: 0,
    applications: 0,
    messages: 0,
    recruiters: 0,
  });

  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
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
        { count: applicationsCount },
        { count: messagesCount },
        { count: recruitersCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("company_profiles").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        profiles: profilesCount || 0,
        jobs: jobsCount || 0,
        applications: applicationsCount || 0,
        messages: messagesCount || 0,
        recruiters: recruitersCount || 0,
      });

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("id, job_position, employer_name, job_location, salary, status")
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);
      setLoading(false);
    }

    loadAdminData();
  }, []);

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

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/recruiters"
            className="rounded-3xl border border-green-500/30 bg-green-600/10 p-6 transition hover:bg-green-600/20"
          >
            <h2 className="text-xl font-bold">Recruiter Verification ✅</h2>
            <p className="mt-2 text-gray-400">
              Approve or reject recruiter profiles.
            </p>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-black text-blue-400">{stats.profiles}</h2>
            <p className="mt-2 text-gray-400">Users</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-black text-green-400">{stats.recruiters}</h2>
            <p className="mt-2 text-gray-400">Recruiters</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-black text-green-400">{stats.jobs}</h2>
            <p className="mt-2 text-gray-400">Jobs</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-black text-yellow-400">{stats.applications}</h2>
            <p className="mt-2 text-gray-400">Applications</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-black text-purple-400">{stats.messages}</h2>
            <p className="mt-2 text-gray-400">Messages</p>
          </div>
        </div>

        <h2 className="mt-12 text-3xl font-black">Manage Jobs</h2>

        <div className="mt-6 grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{job.job_position}</h3>
                  <p className="mt-2 text-gray-400">
                    {job.employer_name} · {job.job_location} · {job.salary}
                  </p>
                  <p className="mt-2 text-sm text-blue-400">{job.status}</p>
                </div>

                <button
                  onClick={() => deleteJob(job.id)}
                  className="rounded-xl bg-red-600 px-4 py-2 font-bold"
                >
                  Delete Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}