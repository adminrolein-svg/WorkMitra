"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function UnlockPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  async function unlockPremium() {
    setLoading(true);

    try {
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
      });

      const order = await orderRes.json();

      if (!orderRes.ok || order.error) {
        alert(order.error || "Razorpay order create nahi hua");
        setLoading(false);
        return;
      }

      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        alert("NEXT_PUBLIC_RAZORPAY_KEY_ID missing hai");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "WorkMitra",
        description: "WorkMitra Plus Unlock",
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

          const { error } = await supabase.from("paid_unlocks").upsert({
            user_id: userData.user.id,
            amount: 50,
            status: "paid",
          });

          if (error) {
            alert(error.message);
            setLoading(false);
            return;
          }

          alert("Payment successful. WorkMitra Plus unlocked!");
          router.push("/student/dashboard");
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
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description || "Payment failed");
        setLoading(false);
      });

      paymentObject.open();
    } catch (error: any) {
      alert(error.message || "Payment start nahi hua");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/student/dashboard" className="text-blue-400">
          ← Back
        </Link>

        <div className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-600/10 p-8">
          <h1 className="text-4xl font-black">Unlock WorkMitra Plus 🔓</h1>

          <p className="mt-4 text-gray-300">
            Pay ₹50 to unlock recruiter chat, full job details, exact address,
            and direct contact access.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6">
            <h2 className="text-3xl font-black text-yellow-400">₹50</h2>
            <p className="mt-2 text-gray-400">
              One-time unlock for job seekers.
            </p>
          </div>

          <button
            type="button"
            onClick={unlockPremium}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-yellow-500 py-4 font-bold text-black hover:bg-yellow-400 disabled:opacity-60"
          >
            {loading ? "Opening Payment..." : "Pay ₹50 & Unlock"}
          </button>
        </div>
      </div>
    </main>
  );
}