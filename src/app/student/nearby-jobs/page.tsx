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
  job_type: string;
};

export default function NearbyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNearbyJobs() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("student_profiles")
        .select("location")
        .eq("student_id", userData.user.id)
        .maybeSingle();

      if (!profile?.location) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .ilike("job_location", `%${profile.location}%`)
        .eq("status", "open");

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setJobs(data || []);
      setLoading(false);
    }

    loadNearbyJobs();
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/student/dashboard" className="text-blue-400">
          ← Back
        </Link>

        <h1 className="mt-8 text-4xl font-black">
          Nearby Jobs 📍
        </h1>

        {loading && (
          <p className="mt-8 text-gray-400">
            Loading nearby jobs...
          </p>
        )}

        {!loading && jobs.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">
              No nearby jobs found
            </h2>

            <p className="mt-2 text-gray-400">
              Update your city in profile.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-bold">
                {job.job_position}
              </h2>

              <p className="mt-2 text-blue-400">
                {job.job_type}
              </p>

              <p className="mt-4 text-gray-300">
                {job.description}
              </p>

              <div className="mt-5 space-y-2 text-sm text-gray-400">
                <p>Company: {job.employer_name}</p>
                <p>Location: {job.job_location}</p>
                <p>Salary: {job.salary}</p>
              </div>

              <Link
                href={`/student/apply?id=${job.id}`}
                className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}