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

export default function AdminJobsPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");

  async function checkAdminAndLoadJobs() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (adminError) {
      alert(adminError.message);
      setLoading(false);
      return;
    }

    if (!adminData) {
      alert("You are not admin");
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    const { data, error } = await supabase
      .from("jobs")
      .select(
        "id, job_position, employer_name, job_location, salary, status, approval_status, auto_approved, posted_by_admin"
      )
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setJobs((data || []) as Job[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    checkAdminAndLoadJobs();
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
    checkAdminAndLoadJobs();
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
    checkAdminAndLoadJobs();
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

  const filteredJobs = jobs.filter((job) =>
    `
      ${job.job_position}
      ${job.employer_name}
      ${job.job_location}
      ${job.salary}
      ${job.status}
      ${job.approval_status || ""}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        Loading admin jobs...
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <h1 className="text-4xl font-black">Access Denied</h1>
        <p className="mt-2 text-gray-400">Only admins can access this page.</p>
        <Link href="/admin/dashboard" className="mt-6 inline-block text-blue-400">
          Back to Admin Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin/dashboard" className="text-blue-400">
          ← Back to Admin Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Admin Job Management</h1>

        <p className="mt-2 text-gray-400">
          Approve, reject, search and delete platform jobs.
        </p>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs by title, employer, location, status..."
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 p-3"
        />

        <div className="mt-8 grid gap-4">
          {filteredJobs.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-gray-400">No jobs found.</p>
            </div>
          )}

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{job.job_position}</h2>

                  <p className="mt-2 text-gray-400">
                    {job.employer_name} · {job.job_location} · {job.salary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
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
                        Admin Job
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => approveJob(job.id)}
                    className="rounded-xl bg-green-600 px-4 py-2 font-bold"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => rejectJob(job.id)}
                    className="rounded-xl bg-yellow-500 px-4 py-2 font-bold text-black"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteJob(job.id)}
                    className="rounded-xl bg-red-600 px-4 py-2 font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}