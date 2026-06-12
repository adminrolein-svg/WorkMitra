"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function StudentApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  const [form, setForm] = useState({
    full_name: "",
    contact_number: "",
    address: "",
    college_name: "",
    skills: "",
    portfolio_url: "",
    has_resume: "No",
    availability: "",
    experience: "",
    preferred_shift: "Flexible",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function uploadResume(userId: string) {
    if (!resumeFile) return "";

    if (resumeFile.type !== "application/pdf") {
      alert("Only PDF resume allowed");
      return "";
    }

    const filePath = `${userId}/${Date.now()}-${resumeFile.name}`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(filePath, resumeFile);

    if (error) {
      alert(error.message);
      return "";
    }

    const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();

    if (!jobId) {
      alert("Job ID missing");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      router.push("/student/login");
      return;
    }

    let resumeFileUrl = "";

    if (form.has_resume === "Yes") {
      if (!resumeFile) {
        alert("Please upload your PDF resume or choose No Resume");
        setLoading(false);
        return;
      }

      resumeFileUrl = await uploadResume(userData.user.id);

      if (!resumeFileUrl) {
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      student_id: userData.user.id,
      full_name: form.full_name,
      contact_number: form.contact_number,
      address: form.address,
      college_name: form.college_name,
      skills: form.skills,
      portfolio_url: form.portfolio_url,
      has_resume: form.has_resume,
      resume_file_url: resumeFileUrl,
      availability: form.availability,
      experience: form.experience,
      preferred_shift: form.preferred_shift,
      status: "Applied",
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Application submitted successfully!");
    router.push("/student/applications");
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/student/jobs" className="text-blue-400">
          ← Back to Jobs
        </Link>

        <h1 className="mt-8 text-4xl font-black">Smart Apply</h1>

        <p className="mt-2 text-gray-400">
          Local jobs ke liye resume optional hai. Professional jobs ke liye PDF
          resume upload kar sakte ho.
        </p>

        <form onSubmit={handleApply} className="mt-8 space-y-4">
          <input
            name="full_name"
            placeholder="Full Name *"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="contact_number"
            placeholder="Contact Number *"
            value={form.contact_number}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <textarea
            name="address"
            placeholder="Address *"
            value={form.address}
            onChange={handleChange}
            required
            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="availability"
            placeholder="Availability e.g. 4 hours daily, weekends, evening"
            value={form.availability}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <select
            name="preferred_shift"
            value={form.preferred_shift}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black p-3"
          >
            <option>Flexible</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Night</option>
            <option>Weekend Only</option>
          </select>

          <textarea
            name="experience"
            placeholder="Experience e.g. Fresher, 6 months shop work, event work"
            value={form.experience}
            onChange={handleChange}
            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="college_name"
            placeholder="College Name (optional)"
            value={form.college_name}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <textarea
            name="skills"
            placeholder="Skills e.g. communication, sales, Excel, cashier"
            value={form.skills}
            onChange={handleChange}
            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="portfolio_url"
            placeholder="Portfolio URL (optional)"
            value={form.portfolio_url}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="block text-sm font-bold text-gray-300">
              Do you want to upload a resume? (Optional)
            </label>

            <select
              name="has_resume"
              value={form.has_resume}
              onChange={handleChange}
              className="mt-3 w-full rounded-xl border border-white/10 bg-black p-3"
            >
              <option value="No">No, continue without resume</option>
              <option value="Yes">Yes, upload PDF resume</option>
            </select>

            {form.has_resume === "Yes" && (
              <div className="mt-4">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setResumeFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black p-3"
                />

                {resumeFile && (
                  <p className="mt-2 text-sm text-green-400">
                    Selected: {resumeFile.name}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </main>
  );
}