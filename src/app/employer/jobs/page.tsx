"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Job = {
  id: string;
  job_position: string;
  employer_name: string;
  contact_number: string;
  job_location: string;
  salary: string;
  description: string;
  required_skills: string;
  job_type: string;
  status: string;
  approval_status: string | null;
  auto_approved: boolean | null;
  auto_approval_paid: boolean | null;
};

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchJobs() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setJobs((data || []) as Job[]);
    }

    setLoading(false);
  }

  async function closeJob(id: string) {
    const { error } = await supabase
      .from("jobs")
      .update({ status: "closed" })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Job closed successfully");
    fetchJobs();
  }

  async function deleteJob(id: string) {
    const yes = confirm("Delete this job permanently?");
    if (!yes) return;

    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Job deleted successfully");
    fetchJobs();
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/employer/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">My Jobs</h1>
        <p className="mt-2 text-gray-400">
          Manage your posted jobs. Pending jobs need admin approval or ₹100 auto approval.
        </p>

        {loading && <p className="mt-8 text-gray-400">Loading jobs...</p>}

        {!loading && jobs.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">No jobs yet</h2>
            <p className="mt-2 text-gray-400">
              Post your first job to start hiring.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {jobs.map((job) => {
            const approvalStatus = job.approval_status || "pending";
            const isApproved = approvalStatus === "approved";
            const isPending = approvalStatus === "pending";

            return (
              <div
                key={job.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold">{job.job_position}</h2>

                  <div className="flex flex-wrap justify-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        job.status === "open"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {job.status}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        isApproved
                          ? "bg-green-500/20 text-green-400"
                          : approvalStatus === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      Approval: {approvalStatus}
                    </span>

                    {job.auto_approved && (
                      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">
                        ₹100 Auto Approved
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-blue-400">{job.job_type}</p>
                <p className="mt-4 text-gray-300">{job.description}</p>

                <div className="mt-5 space-y-2 text-sm text-gray-400">
                  <p>Employer: {job.employer_name}</p>
                  <p>Location: {job.job_location}</p>
                  <p>Salary: {job.salary}</p>
                  <p>Skills: {job.required_skills}</p>
                  <p>Contact: {job.contact_number}</p>
                </div>

                {isPending && (
                  <div className="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-600/10 p-4">
                    <p className="font-bold text-yellow-400">
                      This job is waiting for admin approval.
                    </p>
                    <p className="mt-2 text-sm text-gray-300">
                      ₹100 payment karke is job ko instant auto approve kar sakte ho.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/employer/edit-job?id=${job.id}`}
                    className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white"
                  >
                    Edit Job
                  </Link>

                  {isPending && (
                    <Link
                      href={`/employer/auto-approve?id=${job.id}`}
                      className="rounded-xl bg-green-600 px-4 py-2 font-bold text-white"
                    >
                      Pay ₹100 & Auto Approve
                    </Link>
                  )}

                  {job.status === "open" && (
                    <button
                      type="button"
                      onClick={() => closeJob(job.id)}
                      className="rounded-xl bg-yellow-500 px-4 py-2 font-bold text-black"
                    >
                      Close Job
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteJob(job.id)}
                    className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
                  >
                    Delete Job
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/employer/post-job"
          className="mt-8 inline-block rounded-xl bg-white px-5 py-3 font-bold text-black"
        >
          Post New Job
        </Link>
      </div>
    </main>
  );
}