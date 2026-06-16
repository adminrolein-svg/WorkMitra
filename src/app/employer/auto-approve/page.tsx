"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function AutoApprovePage() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setJobId(params.get("id"));
  }, []);

  function loadRazorpayScript() {
    return new Promise<boolean>((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function payAndApprove() {
    if (!jobId) {
      alert("Job ID missing");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert("Razorpay script load nahi ho raha");
      setLoading(false);
      return;
    }

    const orderRes = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 100 }),
    });

    const order = await orderRes.json();

    if (!orderRes.ok || order.error) {
      alert(order.error || "Order create nahi hua");
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "WorkMitra",
      description: "Job Auto Approval ₹100",
      order_id: order.id,

      handler: async function (response: any) {
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
          alert(verifyData.error || "Payment verification failed");
          setLoading(false);
          return;
        }

        const { error } = await supabase
          .from("jobs")
          .update({
            approval_status: "approved",
            status: "open",
            auto_approved: true,
            auto_approval_paid: true,
          })
          .eq("id", jobId)
          .eq("employer_id", userData.user.id);

        if (error) {
          alert(error.message);
          setLoading(false);
          return;
        }

        alert("Payment successful. Job auto approved!");
        window.location.href = "/employer/jobs";
      },

      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },

      prefill: {
        email: userData.user.email || "",
      },

      theme: {
        color: "#16a34a",
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.on("payment.failed", function (response: any) {
      alert(response.error.description || "Payment failed");
      setLoading(false);
    });

    paymentObject.open();
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/employer/jobs" className="text-blue-400">
          ← Back to My Jobs
        </Link>

        <div className="mt-10 rounded-3xl border border-green-500/30 bg-green-600/10 p-8">
          <h1 className="text-4xl font-black">Auto Approve Job 🚀</h1>

          <p className="mt-4 text-gray-300">
            Pay ₹100 and your job will be instantly approved and visible to students.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6">
            <h2 className="text-3xl font-black text-green-400">₹100</h2>
            <p className="mt-2 text-gray-400">One-time auto approval fee.</p>
          </div>

          <button
            onClick={payAndApprove}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-green-600 py-4 font-bold hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Opening Payment..." : "Pay ₹100 & Auto Approve"}
          </button>
        </div>
      </div>
    </main>
  );
}