"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    job_position: "",
    employer_name: "",
    contact_number: "",
    job_location: "",
    salary: "",
    description: "",
    required_skills: "",
    job_type: "Part-Time",
    status: "open",
  });

  useEffect(() => {
    async function fetchJob() {
      if (!jobId) {
        alert("Job ID missing");
        router.push("/employer/jobs");
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) {
        alert(error.message);
        router.push("/employer/jobs");
        return;
      }

      setForm({
        job_position: data.job_position || "",
        employer_name: data.employer_name || "",
        contact_number: data.contact_number || "",
        job_location: data.job_location || "",
        salary: data.salary || "",
        description: data.description || "",
        required_skills: data.required_skills || "",
        job_type: data.job_type || "Part-Time",
        status: data.status || "open",
      });

      setLoading(false);
    }

    fetchJob();
  }, [jobId, router]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!jobId) {
      alert("Job ID missing");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("jobs")
      .update(form)
      .eq("id", jobId);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    alert("Job updated successfully");
    router.push("/employer/jobs");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <p>Loading job...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/employer/jobs" className="text-blue-400">
          ← Back to Jobs
        </Link>

        <h1 className="mt-8 text-4xl font-black">Edit Job</h1>
        <p className="mt-2 text-gray-400">Update job information.</p>

        <form onSubmit={handleUpdate} className="mt-8 space-y-4">
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
            required
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
            placeholder="Salary / Wage"
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
            <option>WFH</option>
            <option>Nearby Job</option>
            <option>Urgent Hiring</option>
            <option>Daily Task Job</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black p-3"
          >
            <option value="open">open</option>
            <option value="closed">closed</option>
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
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Job"}
          </button>
        </form>
      </div>
    </main>
  );
}