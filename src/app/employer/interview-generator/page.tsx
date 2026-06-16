"use client";

import { useState } from "react";
import Link from "next/link";

export default function InterviewGeneratorPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);

  function generateQuestions() {
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const generated: string[] = [];

    generated.push(
      `Tell me about yourself and why you are interested in the ${jobTitle} role?`
    );

    generated.push(
      `What makes you a good fit for this ${jobTitle} position?`
    );

    skillList.forEach((skill) => {
      generated.push(`Explain your experience with ${skill}.`);
      generated.push(`What are the biggest challenges in ${skill}?`);
      generated.push(`Rate your ${skill} skills from 1 to 10 and explain why.`);
    });

    generated.push(
      "Describe a situation where you solved a difficult problem."
    );

    generated.push(
      "How do you handle pressure and deadlines?"
    );

    generated.push(
      "Why should we hire you?"
    );

    generated.push(
      "Where do you see yourself in the next 3 years?"
    );

    setQuestions(generated);
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/employer/dashboard" className="text-blue-400">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-black">
          AI Interview Generator 🤖
        </h1>

        <p className="mt-2 text-gray-400">
          Generate interview questions based on job role and skills.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Job Title (e.g. React Developer)"
            className="mb-4 w-full rounded-xl border border-white/10 bg-black p-3"
          />

          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills (e.g. React, TypeScript, Next.js)"
            className="h-32 w-full rounded-xl border border-white/10 bg-black p-3"
          />

          <button
            onClick={generateQuestions}
            className="mt-4 rounded-xl bg-blue-600 px-6 py-3 font-bold"
          >
            Generate Questions
          </button>
        </div>

        {questions.length > 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">
              Generated Questions
            </h2>

            <div className="mt-6 space-y-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-black/40 p-4"
                >
                  <span className="font-bold text-blue-400">
                    Q{index + 1}.
                  </span>{" "}
                  {question}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}