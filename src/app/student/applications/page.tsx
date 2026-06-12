"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Application = {
  id: string;
  job_id: string;
  full_name: string;
  contact_number: string;
  status: string;
  created_at: string;
  employer_id?: string;
  job_position?: string;
};

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const { data: applicationsData, error: applicationsError } =
        await supabase
          .from("applications")
          .select("*")
          .eq("student_id", userData.user.id)
          .order("created_at", { ascending: false });

      if (applicationsError) {
        alert(applicationsError.message);
        setLoading(false);
        return;
      }

      const applicationsWithJobs = await Promise.all(
        (applicationsData || []).map(async (app) => {
          const { data: jobData } = await supabase
            .from("jobs")
            .select("employer_id, job_position")
            .eq("id", app.job_id)
            .maybeSingle();

          return {
            ...app,
            employer_id: jobData?.employer_id,
            job_position: jobData?.job_position,
          };
        })
      );

      setApplications(applicationsWithJobs);
      setLoading(false);
    }

    fetchApplications();
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/student/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">My Applications</h1>

        <p className="mt-2 text-gray-400">
          Track status, chat with recruiters and rate them after selection.
        </p>

        {loading && (
          <p className="mt-8 text-gray-400">Loading applications...</p>
        )}

        {!loading && applications.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">No applications yet</h2>
            <p className="mt-2 text-gray-400">Pehle kisi job par apply karo.</p>
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-xl font-bold">
                {app.job_position || "Applied Job"}
              </h2>

              <p className="mt-2 text-gray-400">Applicant: {app.full_name}</p>

              <p className="mt-2 text-gray-400">
                Contact: {app.contact_number}
              </p>

              <div className="mt-4">
                <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-bold">
                  {app.status}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {app.employer_id && (
                  <Link
                    href={`/chat?id=${app.employer_id}`}
                    className="inline-block rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
                  >
                    Chat With Recruiter
                  </Link>
                )}

                {app.status === "Accepted" && app.employer_id && (
                  <Link
                    href={`/feedback?user=${app.employer_id}&role=recruiter&app=${app.id}`}
                    className="inline-block rounded-xl bg-yellow-500 px-5 py-3 font-bold text-black hover:bg-yellow-400"
                  >
                    ⭐ Rate Recruiter
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}