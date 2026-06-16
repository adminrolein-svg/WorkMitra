"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Job = {
  id: string;
  status: string;
  job_position: string | null;
};

type Application = {
  id: string;
  job_id: string | null;
  full_name: string | null;
  status: string;
  created_at: string;
  jobs?: {
    job_position: string | null;
  } | null;
};

export default function EmployerAnalyticsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("id, status, job_position")
        .eq("employer_id", userData.user.id);

      if (jobsError) {
        alert(jobsError.message);
        setLoading(false);
        return;
      }

      const jobIds = jobsData?.map((job) => job.id) || [];
      setJobs((jobsData || []) as Job[]);

      if (jobIds.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select(
          `
          id,
          job_id,
          full_name,
          status,
          created_at,
          jobs (
            job_position
          )
        `
        )
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });

      if (appsError) {
        alert(appsError.message);
      } else {
        const normalizedApplications = (appsData || []).map((app: any) => ({
  ...app,
  jobs: Array.isArray(app.jobs)
    ? app.jobs[0] || null
    : app.jobs || null,
}));

setApplications(normalizedApplications);
      }

      setLoading(false);
    }

    loadAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const totalJobs = jobs.length;
    const openJobs = jobs.filter((j) => j.status === "open").length;
    const closedJobs = jobs.filter((j) => j.status === "closed").length;

    const totalApplicants = applications.length;
    const accepted = applications.filter((a) => a.status === "Accepted").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    const shortlisted = applications.filter(
      (a) => a.status === "Shortlisted"
    ).length;
    const pending = applications.filter((a) => a.status === "Applied").length;
    const viewed = applications.filter((a) => a.status === "Viewed").length;

    const percent = (value: number) =>
      totalApplicants === 0 ? 0 : Math.round((value / totalApplicants) * 100);

    const jobCounts: Record<string, number> = {};

    applications.forEach((app) => {
      const title = app.jobs?.job_position || "Unknown Job";
      jobCounts[title] = (jobCounts[title] || 0) + 1;
    });

    const bestJob =
      Object.entries(jobCounts).sort((a, b) => b[1] - a[1])[0] || null;

    return {
      totalJobs,
      openJobs,
      closedJobs,
      totalApplicants,
      accepted,
      rejected,
      shortlisted,
      pending,
      viewed,
      acceptanceRate: percent(accepted),
      rejectionRate: percent(rejected),
      shortlistRate: percent(shortlisted),
      viewedRate: percent(viewed),
      bestJob,
      recentApplicants: applications.slice(0, 5),
    };
  }, [jobs, applications]);

  const cards = [
    ["Total Jobs", analytics.totalJobs, "text-blue-400"],
    ["Open Jobs", analytics.openJobs, "text-green-400"],
    ["Closed Jobs", analytics.closedJobs, "text-red-400"],
    ["Total Applicants", analytics.totalApplicants, "text-purple-400"],
    ["Accepted", analytics.accepted, "text-green-400"],
    ["Rejected", analytics.rejected, "text-red-400"],
    ["Shortlisted", analytics.shortlisted, "text-yellow-400"],
    ["Pending", analytics.pending, "text-gray-300"],
  ];

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/employer/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">
          Employer Analytics 📊
        </h1>

        <p className="mt-2 text-gray-400">
          Hiring funnel, conversion rates aur recent applicant insights.
        </p>

        {loading && <p className="mt-8 text-gray-400">Loading analytics...</p>}

        {!loading && (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {cards.map(([label, value, color]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <h2 className={`text-4xl font-black ${color}`}>
                    {value}
                  </h2>
                  <p className="mt-2 text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl border border-green-500/30 bg-green-600/10 p-6">
                <h2 className="text-4xl font-black text-green-400">
                  {analytics.acceptanceRate}%
                </h2>
                <p className="mt-2 text-gray-300">Acceptance Rate</p>
              </div>

              <div className="rounded-3xl border border-red-500/30 bg-red-600/10 p-6">
                <h2 className="text-4xl font-black text-red-400">
                  {analytics.rejectionRate}%
                </h2>
                <p className="mt-2 text-gray-300">Rejection Rate</p>
              </div>

              <div className="rounded-3xl border border-yellow-500/30 bg-yellow-600/10 p-6">
                <h2 className="text-4xl font-black text-yellow-400">
                  {analytics.shortlistRate}%
                </h2>
                <p className="mt-2 text-gray-300">Shortlist Rate</p>
              </div>

              <div className="rounded-3xl border border-blue-500/30 bg-blue-600/10 p-6">
                <h2 className="text-4xl font-black text-blue-400">
                  {analytics.viewedRate}%
                </h2>
                <p className="mt-2 text-gray-300">Viewed Rate</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-black">Hiring Funnel</h2>

                <div className="mt-6 space-y-4">
                  <FunnelBar
                    label="Applied"
                    value={analytics.pending}
                    total={analytics.totalApplicants}
                  />
                  <FunnelBar
                    label="Viewed"
                    value={analytics.viewed}
                    total={analytics.totalApplicants}
                  />
                  <FunnelBar
                    label="Shortlisted"
                    value={analytics.shortlisted}
                    total={analytics.totalApplicants}
                  />
                  <FunnelBar
                    label="Accepted"
                    value={analytics.accepted}
                    total={analytics.totalApplicants}
                  />
                  <FunnelBar
                    label="Rejected"
                    value={analytics.rejected}
                    total={analytics.totalApplicants}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-black">Quick Insights</h2>

                <div className="mt-6 space-y-4 text-gray-300">
                  <p>
                    🔥 Most Applied Job:{" "}
                    <span className="font-bold text-white">
                      {analytics.bestJob
                        ? `${analytics.bestJob[0]} (${analytics.bestJob[1]} applicants)`
                        : "No data"}
                    </span>
                  </p>

                  <p>
                    ✅ Hiring Health:{" "}
                    <span className="font-bold text-white">
                      {analytics.acceptanceRate >= 30
                        ? "Strong"
                        : analytics.totalApplicants > 0
                        ? "Needs improvement"
                        : "No applicants yet"}
                    </span>
                  </p>

                  <p>
                    📌 Suggestion:{" "}
                    <span className="font-bold text-white">
                      {analytics.totalApplicants === 0
                        ? "Post more jobs or improve job descriptions."
                        : analytics.shortlistRate < 20
                        ? "Shortlist more candidates for better hiring flow."
                        : "Your hiring funnel looks active."}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black">Recent Applicants</h2>

              <div className="mt-6 grid gap-3">
                {analytics.recentApplicants.length === 0 && (
                  <p className="text-gray-400">No recent applicants.</p>
                )}

                {analytics.recentApplicants.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <div>
                      <p className="font-bold">
                        {app.full_name || "Unnamed Applicant"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {app.jobs?.job_position || "Unknown Job"}
                      </p>
                    </div>

                    <span className="rounded-xl bg-blue-600 px-3 py-1 text-sm font-bold">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function FunnelBar({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span>
          {value} · {percentage}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}