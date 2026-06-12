"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Recruiter = {
  employer_id: string;
  company_name: string;
  company_location: string;
  company_website: string;
  verification_status: string;
};

export default function AdminRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRecruiters() {
    const { data, error } = await supabase
      .from("company_profiles")
      .select("*")
      .order("company_name");

    if (error) {
      alert(error.message);
    } else {
      setRecruiters(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(
    employerId: string,
    status: "approved" | "rejected"
  ) {
    const { error } = await supabase
      .from("company_profiles")
      .update({
        verification_status: status,
        verified_at: new Date().toISOString(),
      })
      .eq("employer_id", employerId);

    if (error) {
      alert(error.message);
      return;
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

        <h1 className="mt-8 text-4xl font-black">
          Recruiter Verification
        </h1>

        {loading && (
          <p className="mt-8 text-gray-400">
            Loading recruiters...
          </p>
        )}

        <div className="mt-8 grid gap-4">
          {recruiters.map((recruiter) => (
            <div
              key={recruiter.employer_id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-2xl font-bold">
                {recruiter.company_name}
              </h2>

              <p className="mt-2 text-gray-400">
                📍 {recruiter.company_location}
              </p>

              <p className="mt-2 text-gray-400">
                🌐 {recruiter.company_website}
              </p>

              <div className="mt-4">
                <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-bold">
                  {recruiter.verification_status}
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() =>
                    updateStatus(
                      recruiter.employer_id,
                      "approved"
                    )
                  }
                  className="rounded-xl bg-green-600 px-4 py-2 font-bold"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      recruiter.employer_id,
                      "rejected"
                    )
                  }
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