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
  description: string;
  required_skills: string;
  job_type: string;
};

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSavedJobs() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { data: savedData, error: savedError } = await supabase
      .from("saved_jobs")
      .select("job_id")
      .eq("student_id", userData.user.id);

    if (savedError) {
      alert(savedError.message);
      setLoading(false);
      return;
    }

    const jobIds = (savedData || []).map((item) => item.job_id);

    if (jobIds.length === 0) {
      setJobs([]);
      setLoading(false);
      return;
    }

    const { data: jobsData, error: jobsError } = await supabase
      .from("jobs")
      .select("*")
      .in("id", jobIds);

    if (jobsError) {
      alert(jobsError.message);
      setLoading(false);
      return;
    }

    setJobs(jobsData || []);
    setLoading(false);
  }

  async function removeSavedJob(jobId: string) {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      return;
    }

    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("student_id", userData.user.id)
      .eq("job_id", jobId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Saved job removed");
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  }

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/student/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Saved Jobs ❤️</h1>

        {loading && <p className="mt-8 text-gray-400">Loading saved jobs...</p>}

        {!loading && jobs.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">No saved jobs yet</h2>
            <p className="mt-2 text-gray-400">
              Find Jobs page se jobs save karo.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-bold">{job.job_position}</h2>

              <p className="mt-2 text-blue-400">{job.job_type}</p>

              <p className="mt-4 text-gray-300">{job.description}</p>

              <div className="mt-5 space-y-2 text-sm text-gray-400">
                <p>Company: {job.employer_name}</p>
                <p>Location: {job.job_location}</p>
                <p>Salary: {job.salary}</p>
                <p>Skills: {job.required_skills}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/student/apply?id=${job.id}`}
                  className="inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
                >
                  Apply Now
                </Link>

                <button
                  type="button"
                  onClick={() => removeSavedJob(job.id)}
                  className="rounded-xl bg-red-600 px-5 py-3 font-bold hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}