"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type RatingSummary = {
  rating: number;
  total_reviews: number;
};

type CompanyProfile = {
  company_name: string | null;
  company_website: string | null;
  company_location: string | null;
  company_description: string | null;
  verification_status: string | null;
};

type StudentProfile = {
  skills: string | null;
  experience: string | null;
  availability: string | null;
  preferred_job_type: string | null;
  location: string | null;
};

type Job = {
  id: string;
  employer_id: string;
  job_position: string;
  employer_name: string;
  contact_number: string;
  job_location: string;
  salary: string;
  description: string;
  required_skills: string;
  job_type: string;
  status: string;
  company?: CompanyProfile | null;
  ai_match?: number;
  is_saved?: boolean;
  recruiter_rating?: RatingSummary | null;
};

function getWords(text: string) {
  return text.toLowerCase().split(/[\s,.-]+/).filter((word) => word.length > 2);
}

function getPublicLocation(location: string) {
  if (!location) return "Location not provided";
  return location.split(",")[0].trim();
}

function calculateAIMatch(job: Job, profile: StudentProfile | null) {
  if (!profile) return 50;

  let score = 40;

  const studentSkills = getWords(profile.skills || "");
  const jobSkills = getWords(job.required_skills || "");
  const jobDescription = getWords(job.description || "");

  const matchedSkills = studentSkills.filter(
    (skill) => jobSkills.includes(skill) || jobDescription.includes(skill)
  );

  score += Math.min(matchedSkills.length * 12, 35);

  if (
    profile.preferred_job_type &&
    job.job_type.toLowerCase().includes(profile.preferred_job_type.toLowerCase())
  ) {
    score += 10;
  }

  if (
    profile.location &&
    job.job_location.toLowerCase().includes(profile.location.toLowerCase())
  ) {
    score += 10;
  }

  if (
    profile.availability &&
    job.description.toLowerCase().includes(profile.availability.toLowerCase())
  ) {
    score += 5;
  }

  return Math.min(score, 98);
}

function getMatchLabel(score: number) {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  return "Low Match";
}

function getMatchColor(score: number) {
  if (score >= 80) return "bg-green-500/20 text-green-400";
  if (score >= 60) return "bg-yellow-500/20 text-yellow-400";
  return "bg-red-500/20 text-red-400";
}

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [hasUnlock, setHasUnlock] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesType =
        selectedType === "All" ||
        job.job_type.toLowerCase().includes(selectedType.toLowerCase());

      const searchText = `
        ${job.job_position}
        ${job.employer_name}
        ${job.job_location}
        ${job.salary}
        ${job.description}
        ${job.required_skills}
        ${job.job_type}
        ${job.company?.company_name || ""}
        ${job.company?.company_location || ""}
        ${job.company?.company_description || ""}
      `.toLowerCase();

      return matchesType && searchText.includes(search.toLowerCase());
    });
  }, [jobs, selectedType, search]);

  async function saveJob(jobId: string) {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      return;
    }

    const { error } = await supabase.from("saved_jobs").insert({
      student_id: userData.user.id,
      job_id: jobId,
    });

    if (error) {
      alert("Job already saved ❤️");
      return;
    }

    alert("Job saved ❤️");

    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, is_saved: true } : job
      )
    );
  }

  useEffect(() => {
    async function fetchJobs() {
      const { data: userData } = await supabase.auth.getUser();

      let studentProfile: StudentProfile | null = null;
      let savedJobIds: string[] = [];

      if (userData.user) {
        const { data: unlockData } = await supabase
          .from("paid_unlocks")
          .select("id")
          .eq("user_id", userData.user.id)
          .eq("status", "paid")
          .maybeSingle();

        setHasUnlock(!!unlockData);

        const { data: profileData } = await supabase
          .from("student_profiles")
          .select("skills, experience, availability, preferred_job_type, location")
          .eq("student_id", userData.user.id)
          .maybeSingle();

        studentProfile = profileData || null;

        const { data: savedData } = await supabase
          .from("saved_jobs")
          .select("job_id")
          .eq("student_id", userData.user.id);

        savedJobIds = savedData?.map((item) => item.job_id) || [];
      }

      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (jobsError) {
        alert(jobsError.message);
        setLoading(false);
        return;
      }

      const { data: companyProfiles, error: companyError } = await supabase
        .from("company_profiles")
        .select(
          "employer_id, company_name, company_website, company_location, company_description, verification_status"
        );

      if (companyError) {
        alert(companyError.message);
        setLoading(false);
        return;
      }

      const { data: ratingsData } = await supabase
        .from("user_rating_summary")
        .select("*");

      const jobsWithCompany = (jobsData || []).map((job) => {
        const company =
          companyProfiles?.find(
            (profile) => profile.employer_id === job.employer_id
          ) || null;

        const recruiterRating =
          ratingsData?.find((rating) => rating.to_user_id === job.employer_id) ||
          null;

        return {
          ...job,
          company,
          recruiter_rating: recruiterRating,
          ai_match: calculateAIMatch(job, studentProfile),
          is_saved: savedJobIds.includes(job.id),
        };
      });

      setJobs(jobsWithCompany);
      setLoading(false);
    }

    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/student/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">Find Jobs</h1>

        <p className="mt-2 text-gray-400">
          Latest jobs with AI-powered match score.
        </p>

        {!hasUnlock && (
          <div className="mt-6 rounded-3xl border border-yellow-500/30 bg-yellow-600/10 p-5">
            <h2 className="text-xl font-bold text-yellow-400">
              Premium Details Locked 🔒
            </h2>
            <p className="mt-2 text-gray-300">
              Full address, contact number and recruiter chat unlock karne ke liye ₹50 pay karo.
            </p>
            <Link
              href="/student/unlock"
              className="mt-4 inline-block rounded-xl bg-yellow-500 px-5 py-3 font-bold text-black"
            >
              Pay ₹50 & Unlock
            </Link>
          </div>
        )}

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs e.g. Kanpur, Sales, Cashier, React"
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 p-3"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "All",
            "Part-Time",
            "Full-Time",
            "Internship",
            "Freelancing",
            "WFH",
            "Nearby Job",
            "Urgent Hiring",
            "Daily Task Job",
          ].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                selectedType === type
                  ? "bg-blue-600 text-white"
                  : "border border-white/10 bg-white/5"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-400">
          Showing{" "}
          <span className="font-bold text-blue-400">{filteredJobs.length}</span>{" "}
          jobs out of <span className="font-bold text-white">{jobs.length}</span>
        </p>

        {loading && <p className="mt-8 text-gray-400">Loading jobs...</p>}

        {!loading && filteredJobs.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">No jobs found</h2>
            <p className="mt-2 text-gray-400">
              Try a different search or category.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{job.job_position}</h2>
                  <p className="mt-2 text-blue-400">{job.job_type}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                    Open
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${getMatchColor(
                      job.ai_match || 50
                    )}`}
                  >
                    AI Match: {job.ai_match || 50}% ·{" "}
                    {getMatchLabel(job.ai_match || 50)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div>
                  <h3 className="font-bold text-white">
                    {job.company?.company_name || job.employer_name}
                  </h3>

                  {job.company?.verification_status === "approved" && (
                    <p className="mt-2 inline-block rounded-full bg-green-500/20 px-3 py-1 text-sm font-bold text-green-400">
                      ✅ Verified Recruiter
                    </p>
                  )}

                  {job.company?.verification_status === "pending" && (
                    <p className="mt-2 inline-block rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-bold text-yellow-400">
                      🟡 Verification Pending
                    </p>
                  )}

                  {job.company?.verification_status === "rejected" && (
                    <p className="mt-2 inline-block rounded-full bg-red-500/20 px-3 py-1 text-sm font-bold text-red-400">
                      ❌ Unverified Recruiter
                    </p>
                  )}

                  {job.recruiter_rating && (
                    <p className="mt-2 font-bold text-yellow-400">
                      ⭐ {job.recruiter_rating.rating}/5 (
                      {job.recruiter_rating.total_reviews} reviews)
                    </p>
                  )}
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  📍{" "}
                  {hasUnlock
                    ? job.company?.company_location || job.job_location
                    : getPublicLocation(
                        job.company?.company_location || job.job_location
                      )}
                  {!hasUnlock && " · Full address locked"}
                </p>

                {job.company?.company_description && (
                  <p className="mt-3 text-sm text-gray-300">
                    {job.company.company_description}
                  </p>
                )}

                {job.company?.company_website && hasUnlock && (
                  <a
                    href={job.company.company_website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm font-bold text-blue-400"
                  >
                    Open Website / Instagram
                  </a>
                )}
              </div>

              <p className="mt-5 text-gray-300">{job.description}</p>

              <div className="mt-5 space-y-2 text-sm text-gray-400">
                <p>
                  Location:{" "}
                  {hasUnlock ? job.job_location : getPublicLocation(job.job_location)}
                  {!hasUnlock && " · Locked"}
                </p>
                <p>Salary: {job.salary}</p>
                <p>Skills: {job.required_skills}</p>
                <p>
                  Contact:{" "}
                  {hasUnlock ? (
                    job.contact_number
                  ) : (
                    <span className="text-yellow-400">Locked 🔒</span>
                  )}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => saveJob(job.id)}
                  disabled={job.is_saved}
                  className={`rounded-xl px-5 py-3 font-bold ${
                    job.is_saved
                      ? "bg-pink-600/30 text-pink-300"
                      : "border border-pink-500 text-pink-400 hover:bg-pink-600/20"
                  }`}
                >
                  {job.is_saved ? "Saved ❤️" : "Save Job ❤️"}
                </button>

                <Link
                  href={`/student/apply?id=${job.id}`}
                  className="inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
                >
                  Apply Now
                </Link>

                {!hasUnlock && (
                  <Link
                    href="/student/unlock"
                    className="inline-block rounded-xl bg-yellow-500 px-5 py-3 font-bold text-black hover:bg-yellow-400"
                  >
                    Unlock Details 🔓
                  </Link>
                )}

                {hasUnlock && (
                  <Link
                    href={`/chat?id=${job.employer_id}`}
                    className="inline-block rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
                  >
                    Chat With Recruiter
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}