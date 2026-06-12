"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Application = {
  id: string;
  student_id: string;
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
};

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function fetchApplications() {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setApplications(data || []);
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

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
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
      `.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
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

        <h1 className="mt-8 text-4xl font-black">Job Applicants</h1>

        <p className="mt-2 text-gray-400">
          Search and filter applicants by name, skills, location, experience or
          status.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            placeholder="Search applicants e.g. Kanpur, React, Sales, Evening"
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
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">{app.full_name}</h2>

                <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-bold">
                  {app.status}
                </span>
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
          ))}
        </div>
      </div>
    </main>
  );
}