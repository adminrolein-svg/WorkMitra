"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PostJobPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    job_position: "",
    employer_name: "",
    contact_number: "",
    job_location: "",
    salary: "",
    description: "",
    required_skills: "",
    job_type: "Part-Time",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      router.push("/employer/login");
      return;
    }

    const { error } = await supabase.from("jobs").insert({
      employer_id: userData.user.id,
      ...form,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Job posted successfully!");
    router.push("/employer/jobs");
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/employer/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Post a Job</h1>
        <p className="mt-2 text-gray-400">Create a new job for students.</p>

        <form onSubmit={handlePostJob} className="mt-8 space-y-4">
          <input name="job_position" placeholder="Job Position" onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-white/5 p-3" />
          <input name="employer_name" placeholder="Employer Name" onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-white/5 p-3" />
          <input name="contact_number" placeholder="Contact Number" onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-white/5 p-3" />
          <input name="job_location" placeholder="Job Location" onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-white/5 p-3" />
          <input name="salary" placeholder="Salary / Wage" onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-white/5 p-3" />

          <select name="job_type" onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black p-3">
            <option>Part-Time</option>
            <option>Full-Time</option>
            <option>Internship</option>
            <option>Freelancing</option>
            <option>WFH</option>
            <option>Nearby Job</option>
            <option>Urgent Hiring</option>
            <option>Daily Task Job</option>
          </select>

          <textarea name="required_skills" placeholder="Required Skills" onChange={handleChange} required className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3" />
          <textarea name="description" placeholder="Job Description" onChange={handleChange} required className="min-h-32 w-full rounded-xl border border-white/10 bg-white/5 p-3" />

          <button disabled={loading} className="w-full rounded-xl bg-white py-3 font-bold text-black">
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </main>
  );
}