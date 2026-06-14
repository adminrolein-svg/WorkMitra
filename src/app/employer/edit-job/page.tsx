"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditJobPage() {
  const router = useRouter();
  const [jobId, setJobId] = useState<string | null>(null);

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
    const params = new URLSearchParams(window.location.search);
    setJobId(params.get("id"));
  }, []);

  useEffect(() => {
    async function fetchJob() {
      if (!jobId) return;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!jobId) {
        router.push("/employer/jobs");
      }
    }, 1000);

    return () => clearTimeout(timer);
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

    if (!jobId) return;

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
        Loading...
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

        <form onSubmit={handleUpdate} className="mt-8 space-y-4">
          <input
            name="job_position"
            value={form.job_position}
            onChange={handleChange}
            placeholder="Job Position"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="employer_name"
            value={form.employer_name}
            onChange={handleChange}
            placeholder="Recruiter Name"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="job_location"
            value={form.job_location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <textarea
            name="required_skills"
            value={form.required_skills}
            onChange={handleChange}
            placeholder="Required Skills"
            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="min-h-32 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold"
          >
            {saving ? "Updating..." : "Update Job"}
          </button>
        </form>
      </div>
    </main>
  );
}