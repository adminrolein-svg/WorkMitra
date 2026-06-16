"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Application = {
  id: string;
  student_id: string;
  job_id: string | null;
  full_name: string;
  contact_number: string;
  address: string;
  college_name: string | null;
  skills: string | null;
  portfolio_url: string | null;
  resume_file_url: string | null;
  availability: string | null;
  experience: string | null;
  preferred_shift: string | null;
  has_resume: string | null;
  status: string;
  jobs?: {
    job_position: string | null;
    job_location: string | null;
    required_skills: string | null;
    job_type: string | null;
    description: string | null;
  } | null;
};

function words(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function getAiMatch(app: Application) {
  const job = app.jobs;

  const applicantText = `${app.skills || ""} ${app.experience || ""} ${
    app.availability || ""
  } ${app.preferred_shift || ""} ${app.address || ""}`;

  const jobText = `${job?.required_skills || ""} ${job?.description || ""} ${
    job?.job_location || ""
  } ${job?.job_type || ""}`;

  const applicantWords = new Set(words(applicantText));
  const jobWords = words(jobText);

  if (jobWords.length === 0) {
    return {
      score: 50,
      label: "Needs Review",
      skillsMatch: "Not enough job data",
      reason: "Job skills/description missing hai.",
    };
  }

  const matched = jobWords.filter((w) => applicantWords.has(w));
  const uniqueMatched = Array.from(new Set(matched));

  let score = Math.round((uniqueMatched.length / new Set(jobWords).size) * 100);

  if (app.has_resume === "Yes") score += 8;
  if (app.experience && app.experience.length > 5) score += 8;
  if (app.skills && app.skills.length > 5) score += 10;

  if (
    job?.job_location &&
    app.address &&
    app.address.toLowerCase().includes(job.job_location.toLowerCase())
  ) {
    score += 10;
  }

  score = Math.max(35, Math.min(score, 98));

  let label = "Needs Review";
  let skillsMatch = "Low";

  if (score >= 80) {
    label = "Strong Candidate";
    skillsMatch = "High";
  } else if (score >= 60) {
    label = "Good Match";
    skillsMatch = "Medium";
  }

  return {
    score,
    label,
    skillsMatch,
    reason:
      uniqueMatched.length > 0
        ? `Matched keywords: ${uniqueMatched.slice(0, 8).join(", ")}`
        : "Skills aur job requirements me direct keyword match kam hai.",
  };
}

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoShortlisting, setAutoShortlisting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function fetchApplications() {
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        jobs (
          job_position,
          job_location,
          required_skills,
          job_type,
          description
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      const normalizedApplications = (data || []).map((app: any) => ({
        ...app,
        jobs: Array.isArray(app.jobs)
          ? app.jobs[0] || null
          : app.jobs || null,
      }));

      setApplications(normalizedApplications);
    }

    setLoading(false);
  }

  async function updateStatus(app: Application, status: string) {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", app.id);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("notifications").insert({
      user_id: app.student_id,
      title: `Application ${status}`,
      message: `Your application has been ${status}.`,
      type: status,
    });

    alert(`Application ${status}`);
    fetchApplications();
  }

  async function autoShortlistTopCandidates() {
    if (applications.length === 0) {
      alert("No applicants found");
      return;
    }

    const confirmShortlist = confirm(
      "AI top 5 candidates ko automatically Shortlist kar de?"
    );

    if (!confirmShortlist) return;

    setAutoShortlisting(true);

    const topCandidates = [...applications]
      .filter(
        (app) =>
          app.status !== "Accepted" &&
          app.status !== "Rejected" &&
          app.status !== "Shortlisted"
      )
      .sort((a, b) => getAiMatch(b).score - getAiMatch(a).score)
      .slice(0, 5);

    if (topCandidates.length === 0) {
      alert("No eligible candidates for auto-shortlist");
      setAutoShortlisting(false);
      return;
    }

    const ids = topCandidates.map((app) => app.id);

    const { error } = await supabase
      .from("applications")
      .update({ status: "Shortlisted" })
      .in("id", ids);

    if (error) {
      alert(error.message);
      setAutoShortlisting(false);
      return;
    }

    await supabase.from("notifications").insert(
      topCandidates.map((app) => ({
        user_id: app.student_id,
        title: "Application Shortlisted",
        message: "Your application has been shortlisted by AI ranking.",
        type: "Shortlisted",
      }))
    );

    alert(`AI ne ${topCandidates.length} candidates shortlist kar diye`);
    setAutoShortlisting(false);
    fetchApplications();
  }

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const ai = getAiMatch(app);

        const text = `
          ${app.full_name}
          ${app.contact_number}
          ${app.address}
          ${app.college_name || ""}
          ${app.skills || ""}
          ${app.experience || ""}
          ${app.availability || ""}
          ${app.preferred_shift || ""}
          ${app.status}
          ${app.jobs?.job_position || ""}
          ${app.jobs?.required_skills || ""}
          ${ai.label}
          ${ai.score}
        `.toLowerCase();

        const matchesSearch = text.includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || app.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => getAiMatch(b).score - getAiMatch(a).score);
  }, [applications, search, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/employer/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Job Applicants</h1>
            <p className="mt-2 text-gray-400">
              AI Match Score ke basis par best candidates automatically top par
              dikh rahe hain.
            </p>
          </div>

          <button
            onClick={autoShortlistTopCandidates}
            disabled={autoShortlisting || loading}
            className="rounded-xl bg-green-600 px-5 py-3 font-bold disabled:opacity-50"
          >
            {autoShortlisting ? "Shortlisting..." : "🤖 AI Auto Shortlist Top 5"}
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            placeholder="Search applicants e.g. Kanpur, React, Sales, Evening, Strong Candidate"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-black p-3"
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Viewed">Viewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-gray-300">
            Showing{" "}
            <span className="font-bold text-blue-400">
              {filteredApplications.length}
            </span>{" "}
            applicants out of{" "}
            <span className="font-bold text-white">{applications.length}</span>.
          </p>
        </div>

        {loading && <p className="mt-8 text-gray-400">Loading...</p>}

        {!loading && filteredApplications.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">No applicants found</h2>
            <p className="mt-2 text-gray-400">
              Try a different search or status filter.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {filteredApplications.map((app, index) => {
            const ai = getAiMatch(app);

            return (
              <div
                key={app.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-block rounded-full bg-yellow-500 px-4 py-1 text-sm font-black text-black">
                      AI Rank #{index + 1}
                    </div>

                    <h2 className="text-2xl font-bold">{app.full_name}</h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Applied for: {app.jobs?.job_position || "Job not linked"}
                    </p>
                  </div>

                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-bold">
                    {app.status}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-300">AI Match Score</p>
                      <h3 className="text-3xl font-black text-green-400">
                        {ai.score}%
                      </h3>
                    </div>

                    <div className="rounded-xl bg-green-600 px-4 py-2 font-bold">
                      {ai.label}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-300">
                    Skills Match:{" "}
                    <span className="font-bold text-white">
                      {ai.skillsMatch}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-gray-400">{ai.reason}</p>
                </div>

                <div className="mt-4 grid gap-3 text-gray-300 md:grid-cols-2">
                  <p>📞 Contact: {app.contact_number}</p>
                  <p>📍 Address: {app.address}</p>
                  <p>🏫 College: {app.college_name || "Not provided"}</p>
                  <p>🛠 Skills: {app.skills || "Not provided"}</p>
                  <p>🕒 Availability: {app.availability || "Not provided"}</p>
                  <p>🌙 Shift: {app.preferred_shift || "Not provided"}</p>
                  <p>💼 Experience: {app.experience || "Not provided"}</p>
                  <p>
                    📄 Resume:{" "}
                    {app.has_resume === "Yes" ? "Uploaded" : "Not uploaded"}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/chat?id=${app.student_id}`}
                    className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white"
                  >
                    Chat With Student
                  </Link>

                  {app.status === "Accepted" && (
                    <Link
                      href={`/feedback?user=${app.student_id}&role=jobseeker&app=${app.id}`}
                      className="rounded-xl bg-yellow-500 px-4 py-2 font-bold text-black"
                    >
                      ⭐ Rate Job Seeker
                    </Link>
                  )}

                  {app.portfolio_url && (
                    <a
                      href={app.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-purple-600 px-4 py-2 font-bold text-white"
                    >
                      Open Portfolio
                    </a>
                  )}

                  {app.resume_file_url ? (
                    <a
                      href={app.resume_file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-white px-4 py-2 font-bold text-black"
                    >
                      Download Resume
                    </a>
                  ) : (
                    <span className="rounded-xl border border-white/10 px-4 py-2 text-gray-400">
                      No Resume Uploaded
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => updateStatus(app, "Viewed")}
                    className="rounded-xl bg-gray-700 px-4 py-2 font-bold"
                  >
                    Viewed
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(app, "Shortlisted")}
                    className="rounded-xl bg-yellow-500 px-4 py-2 font-bold text-black"
                  >
                    Shortlist
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(app, "Accepted")}
                    className="rounded-xl bg-green-600 px-4 py-2 font-bold"
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(app, "Rejected")}
                    className="rounded-xl bg-red-600 px-4 py-2 font-bold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}