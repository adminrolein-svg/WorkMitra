"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CompanyProfilePage() {
  const [form, setForm] = useState({
    company_name: "",
    company_website: "",
    company_location: "",
    company_description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("employer_id", userData.user.id)
        .maybeSingle();

      if (data) {
        setForm({
          company_name: data.company_name || "",
          company_website: data.company_website || "",
          company_location: data.company_location || "",
          company_description: data.company_description || "",
        });
      }
    }

    fetchProfile();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { data: existingProfile } = await supabase
      .from("company_profiles")
      .select("id")
      .eq("employer_id", userData.user.id)
      .maybeSingle();

    if (existingProfile) {
      const { error } = await supabase
        .from("company_profiles")
        .update({
          company_name: form.company_name,
          company_website: form.company_website,
          company_location: form.company_location,
          company_description: form.company_description,
        })
        .eq("employer_id", userData.user.id);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.from("company_profiles").insert({
        employer_id: userData.user.id,
        company_name: form.company_name,
        company_website: form.company_website,
        company_location: form.company_location,
        company_description: form.company_description,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }
    }

    alert("Company profile saved successfully");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/employer/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Company Profile</h1>

        <p className="mt-2 text-gray-400">
          Add your company details to build trust with students.
        </p>

        <form onSubmit={saveProfile} className="mt-8 space-y-4">
          <input
            name="company_name"
            placeholder="Company / Business Name"
            value={form.company_name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="company_website"
            placeholder="Website or Instagram Link (optional)"
            value={form.company_website}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <input
            name="company_location"
            placeholder="Business Location"
            value={form.company_location}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <textarea
            name="company_description"
            placeholder="About your business / company"
            value={form.company_description}
            onChange={handleChange}
            required
            className="min-h-32 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-bold text-black"
          >
            {loading ? "Saving..." : "Save Company Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}