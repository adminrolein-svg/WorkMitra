"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Recruiter = {
  employer_id: string;
  company_name: string | null;
  company_location: string | null;
  company_website: string | null;
  verification_status: string | null;
};

export default function AdminRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRecruiters() {
    const { data, error } = await supabase
      .from("company_profiles")
      .select(
        "employer_id, company_name, company_location, company_website, verification_status"
      )
      .order("company_name");

    if (error) {
      alert(error.message);
    } else {
      setRecruiters((data || []) as Recruiter[]);
    }

    setLoading(false);
  }

  async function updateStatus(
    employerId: string,
    status: "approved" | "rejected"
  ) {
    const { error: companyError } = await supabase
      .from("company_profiles")
      .update({
        verification_status: status,
        verified_at: new Date().toISOString(),
      })
      .eq("employer_id", employerId);

    if (companyError) {
      alert(companyError.message);
      return;
    }

    if (status === "approved") {
      const { error: jobsError } = await supabase
        .from("jobs")
        .update({
          approval_status: "approved",
          status: "open",
        })
        .eq("employer_id", employerId)
        .or("approval_status.is.null,approval_status.eq.pending");

      if (jobsError) {
        alert(jobsError.message);
        return;
      }
    }

    if (status === "rejected") {
      const { error: jobsError } = await supabase
        .from("jobs")
        .update({
          approval_status: "rejected",
          status: "closed",
        })
        .eq("employer_id", employerId)
        .neq("posted_by_admin", true);

      if (jobsError) {
        alert(jobsError.message);
        return;
      }
    }

    alert(`Recruiter ${status}`);
    fetchRecruiters();
  }

  useEffect(() => {
    fetchRecruiters();
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin/dashboard" className="text-blue-400">
          ← Back to Admin Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Recruiter Verification</h1>

        <p className="mt-2 text-gray-400">
          Recruiter approve hone ke baad uski pending jobs bhi approved ho
          jayengi.
        </p>

        {loading && <p className="mt-8 text-gray-400">Loading recruiters...</p>}

        {!loading && recruiters.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400">No recruiters found.</p>
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {recruiters.map((recruiter) => (
            <div
              key={recruiter.employer_id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-bold">
                {recruiter.company_name || "Unnamed Company"}
              </h2>

              <p className="mt-2 text-gray-400">
                📍 {recruiter.company_location || "Location not provided"}
              </p>

              <p className="mt-2 text-gray-400">
                🌐 {recruiter.company_website || "Website not provided"}
              </p>

              <div className="mt-4">
                <span
                  className={`rounded-lg px-3 py-1 text-sm font-bold ${
                    recruiter.verification_status === "approved"
                      ? "bg-green-600"
                      : recruiter.verification_status === "rejected"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {recruiter.verification_status || "pending"}
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => updateStatus(recruiter.employer_id, "approved")}
                  className="rounded-xl bg-green-600 px-4 py-2 font-bold"
                >
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => updateStatus(recruiter.employer_id, "rejected")}
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