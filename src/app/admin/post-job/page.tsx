"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    job_position: "",
    employer_name: "WorkMitra",
    contact_number: "",
    job_location: "",
    salary: "",
    description: "",
    required_skills: "",
    job_type: "Part-Time",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePostJob(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { data: adminData } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!adminData) {
      alert("You are not admin");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("jobs").insert({
      job_position: form.job_position,
      employer_name: form.employer_name || "WorkMitra",
      contact_number: form.contact_number,
      job_location: form.job_location,
      salary: form.salary,
      description: form.description,
      required_skills: form.required_skills,
      job_type: form.job_type,
      status: "open",
      approval_status: "approved",
      posted_by_admin: true,
      auto_approved: false,
      employer_id: userData.user.id,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Admin job posted successfully");
    router.push("/admin/jobs");
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin/dashboard" className="text-blue-400">
          ← Back to Admin Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Post Platform Job</h1>

        <p className="mt-2 text-gray-400">
          Ye job WorkMitra platform job ke naam se post hogi.
        </p>

        <form onSubmit={handlePostJob} className="mt-8 space-y-4">
          <input
            name="job_position"
            placeholder="Job Position"
            value={form.job_position}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="employer_name"
            placeholder="Employer Name"
            value={form.employer_name}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="contact_number"
            placeholder="Contact Number"
            value={form.contact_number}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="job_location"
            placeholder="Job Location"
            value={form.job_location}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <select
            name="job_type"
            value={form.job_type}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black p-3"
          >
            <option>Part-Time</option>
            <option>Full-Time</option>
            <option>Internship</option>
            <option>Freelancing</option>
            <option>Work From Home</option>
            <option>Daily Task</option>
          </select>

          <textarea
            name="required_skills"
            placeholder="Required Skills"
            value={form.required_skills}
            onChange={handleChange}
            required
            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            required
            className="min-h-32 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post Platform Job"}
          </button>
        </form>
      </div>
    </main>
  );
}