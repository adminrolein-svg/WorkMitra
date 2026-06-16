"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AutoApprovePage() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setJobId(params.get("id"));
  }, []);

  async function handlePaymentAndApprove() {
    if (!jobId) {
      alert("Job ID missing");
      return;
    }

    const ok = confirm("₹100 payment confirm karna hai? Demo payment mode.");
    if (!ok) return;

    setLoading(true);

    const { error } = await supabase
      .from("jobs")
      .update({
        approval_status: "approved",
        status: "open",
        auto_approved: true,
        auto_approval_paid: true,
      })
      .eq("id", jobId);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Payment successful. Job auto approved!");
    window.location.href = "/employer/jobs";
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/employer/jobs" className="text-blue-400">
          ← Back to My Jobs
        </Link>

        <div className="mt-10 rounded-3xl border border-green-500/30 bg-green-600/10 p-8">
          <h1 className="text-4xl font-black">Auto Approve Job</h1>

          <p className="mt-4 text-gray-300">
            ₹100 payment ke baad job direct approve ho jayegi aur student side
            visible ho jayegi.
          </p>

          <button
            onClick={handlePaymentAndApprove}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-green-600 py-3 font-bold disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay ₹100 & Auto Approve"}
          </button>
        </div>
      </div>
    </main>
  );
}