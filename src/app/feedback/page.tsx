"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function FeedbackPage() {
  const searchParams = useSearchParams();

  const toUserId = searchParams.get("user") || "";
  const roleParam = searchParams.get("role") || "jobseeker";
  const applicationId = searchParams.get("app") || "";

  const reviewForRole = roleParam === "recruiter" ? "employer" : "student";

  const labels =
    reviewForRole === "student"
      ? ["Punctuality", "Communication", "Work Efficiency", "Discipline", "Overall Behaviour"]
      : ["Payment Clarity", "Work Environment", "Communication", "Professionalism", "Overall Experience"];

  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([5, 5, 5, 5, 5]);
  const [feedback, setFeedback] = useState("");

  function updateRating(index: number, value: number) {
    const copy = [...ratings];
    copy[index] = value;
    setRatings(copy);
  }

  async function submitFeedback() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Login required");
      setLoading(false);
      return;
    }

    if (!toUserId || !applicationId) {
      alert("Feedback link invalid");
      setLoading(false);
      return;
    }

    const { data: existing } = await supabase
      .from("feedback_ratings")
      .select("id")
      .eq("application_id", applicationId)
      .eq("from_user_id", userData.user.id)
      .maybeSingle();

    if (existing) {
      alert("You already submitted feedback.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    const { error } = await supabase.from("feedback_ratings").insert({
      from_user_id: userData.user.id,
      to_user_id: toUserId,
      application_id: applicationId,
      reviewer_role: profile?.role || "user",
      review_for_role: reviewForRole,
      category_1: ratings[0],
      category_2: ratings[1],
      category_3: ratings[2],
      category_4: ratings[3],
      category_5: ratings[4],
      feedback_text: feedback,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Feedback submitted ⭐");
    window.history.back();
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => window.history.back()} className="text-blue-400">
          ← Back
        </button>

        <h1 className="mt-8 text-4xl font-black">Rate & Feedback ⭐</h1>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          {labels.map((label, index) => (
            <div key={label} className="mb-6">
              <div className="flex items-center justify-between">
                <p className="font-bold">{label}</p>
                <p className="text-yellow-400">{ratings[index]} ⭐</p>
              </div>

              <input
                type="range"
                min={1}
                max={5}
                value={ratings[index]}
                onChange={(e) => updateRating(index, Number(e.target.value))}
                className="mt-3 w-full"
              />
            </div>
          ))}

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback..."
            className="mt-4 h-40 w-full rounded-xl border border-white/10 bg-black p-4"
          />

          <button
            onClick={submitFeedback}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-yellow-500 p-4 font-bold text-black"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </main>
  );
}