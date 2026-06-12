"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EmployerAnalyticsPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    closedJobs: 0,
    totalApplicants: 0,
    accepted: 0,
    rejected: 0,
    shortlisted: 0,
    pending: 0,
  });

  useEffect(() => {
    async function loadAnalytics() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        alert("Please login first");
        return;
      }

      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, status")
        .eq("employer_id", userData.user.id);

      const jobIds = jobs?.map((job) => job.id) || [];

      let applications: any[] = [];

      if (jobIds.length > 0) {
        const { data } = await supabase
          .from("applications")
          .select("status")
          .in("job_id", jobIds);

        applications = data || [];
      }

      setStats({
        totalJobs: jobs?.length || 0,
        openJobs: jobs?.filter((j) => j.status === "open").length || 0,
        closedJobs: jobs?.filter((j) => j.status === "closed").length || 0,
        totalApplicants: applications.length,
        accepted: applications.filter((a) => a.status === "Accepted").length,
        rejected: applications.filter((a) => a.status === "Rejected").length,
        shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
        pending: applications.filter((a) => a.status === "Applied").length,
      });
    }

    loadAnalytics();
  }, []);

  const cards = [
    ["Total Jobs", stats.totalJobs, "text-blue-400"],
    ["Open Jobs", stats.openJobs, "text-green-400"],
    ["Closed Jobs", stats.closedJobs, "text-red-400"],
    ["Total Applicants", stats.totalApplicants, "text-purple-400"],
    ["Accepted", stats.accepted, "text-green-400"],
    ["Rejected", stats.rejected, "text-red-400"],
    ["Shortlisted", stats.shortlisted, "text-yellow-400"],
    ["Pending", stats.pending, "text-gray-300"],
  ];

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/employer/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Employer Analytics 📊</h1>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {cards.map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className={`text-4xl font-black ${color}`}>{value}</h2>
              <p className="mt-2 text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}