"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    location: "",
    skills: "",
    experience: "",
    availability: "",
    preferred_job_type: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("student_id", userData.user.id)
      .maybeSingle();

    if (data) {
      setForm({
        full_name: data.full_name || "",
        location: data.location || "",
        skills: data.skills || "",
        experience: data.experience || "",
        availability: data.availability || "",
        preferred_job_type: data.preferred_job_type || "",
      });
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();

    if (!form.location.trim()) {
      alert("Location required for Nearby Jobs");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Login required");
      setLoading(false);
      return;
    }

    const { data: existing } = await supabase
      .from("student_profiles")
      .select("id")
      .eq("student_id", userData.user.id)
      .maybeSingle();

    let error;

    if (existing) {
      const result = await supabase
        .from("student_profiles")
        .update({
          full_name: form.full_name,
          location: form.location,
          skills: form.skills,
          experience: form.experience,
          availability: form.availability,
          preferred_job_type: form.preferred_job_type,
        })
        .eq("student_id", userData.user.id);

      error = result.error;
    } else {
      const result = await supabase.from("student_profiles").insert({
        student_id: userData.user.id,
        full_name: form.full_name,
        location: form.location,
        skills: form.skills,
        experience: form.experience,
        availability: form.availability,
        preferred_job_type: form.preferred_job_type,
      });

      error = result.error;
    }

    if (error) {
      alert(error.message);
    } else {
      alert("Profile Saved");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/student/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Student Profile</h1>

        <p className="mt-2 text-gray-400">
          Add your city, skills and availability. Nearby Jobs and AI Matching use
          this profile.
        </p>

        <form onSubmit={saveProfile} className="mt-8 space-y-4">
          <input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-4"
          />

          <input
            name="location"
            placeholder="Your City / Location e.g. Kanpur"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 p-4"
          />

          <textarea
            name="skills"
            placeholder="Skills e.g. communication, sales, cashier, excel"
            value={form.skills}
            onChange={handleChange}
            className="h-32 w-full rounded-xl border border-white/10 bg-white/5 p-4"
          />

          <textarea
            name="experience"
            placeholder="Experience e.g. Fresher, 6 months retail, event work"
            value={form.experience}
            onChange={handleChange}
            className="h-32 w-full rounded-xl border border-white/10 bg-white/5 p-4"
          />

          <select
            name="availability"
            value={form.availability}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black p-4"
          >
            <option value="">Select Availability</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Weekend Only">Weekend Only</option>
            <option value="Flexible">Flexible</option>
          </select>

          <select
            name="preferred_job_type"
            value={form.preferred_job_type}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black p-4"
          >
            <option value="">Preferred Job Type</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Internship">Internship</option>
            <option value="Freelancing">Freelancing</option>
            <option value="WFH">WFH</option>
            <option value="Nearby Job">Nearby Job</option>
            <option value="Urgent Hiring">Urgent Hiring</option>
            <option value="Daily Task Job">Daily Task Job</option>
          </select>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 p-4 font-bold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}