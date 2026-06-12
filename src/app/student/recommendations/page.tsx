"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  ai_match?: number;
};

function getWords(text: string) {
  return text
    .toLowerCase()
    .split(/[\s,.-]+/)
    .filter((word) => word.length > 2);
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

export default function AIRecommendationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("student_profiles")
        .select("skills, experience, availability, preferred_job_type, location")
        .eq("student_id", userData.user.id)
        .maybeSingle();

      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open");

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const recommendedJobs = (jobsData || [])
        .map((job) => ({
          ...job,
          ai_match: calculateAIMatch(job, profile),
        }))
        .sort((a, b) => (b.ai_match || 0) - (a.ai_match || 0));

      setJobs(recommendedJobs);
      setLoading(false);
    }

    fetchRecommendations();
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/student/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">AI Job Recommendations</h1>

        <p className="mt-2 text-gray-400">
          Jobs ranked by your skills, location, availability and preferred job type.
        </p>

        {loading && <p className="mt-8 text-gray-400">Loading AI recommendations...</p>}

        {!loading && jobs.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">No recommendations yet</h2>
            <p className="mt-2 text-gray-400">
              Complete your student profile and check again.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{job.job_position}</h2>
                  <p className="mt-2 text-blue-400">{job.job_type}</p>
                </div>

                <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-bold text-green-400">
                  AI Match: {job.ai_match}% · {getMatchLabel(job.ai_match || 50)}
                </span>
              </div>

              <p className="mt-4 text-gray-300">{job.description}</p>

              <div className="mt-5 space-y-2 text-sm text-gray-400">
                <p>Company: {job.employer_name}</p>
                <p>Location: {job.job_location}</p>
                <p>Salary: {job.salary}</p>
                <p>Skills: {job.required_skills}</p>
              </div>

              <Link
                href={`/student/apply?id=${job.id}`}
                className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}